<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreLiveSessionRequest;
use App\Http\Requests\UpdateLiveSessionRequest;
use App\Models\Attendance;
use App\Models\LiveSession;
use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class LiveSessionController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        if ($user->role === 'admin') {
            $sessions = LiveSession::with(['tutor', 'student', 'course', 'attendances'])
                ->orderBy('scheduled_at', 'asc')
                ->get();
                
            $courses = Course::all();
            $tutors = User::where('role', 'tutor')->get();
        } elseif ($user->role === 'tutor') {
            $sessions = LiveSession::where('tutor_id', $user->id)
                ->with(['student', 'course.enrollments.student', 'attendances'])
                ->orderBy('scheduled_at', 'asc')
                ->get();
                
            // Tutors need their list of courses to schedule a live class for a course!
            $subjects = $user->subjects()->get();
            $courses = Course::whereIn('subject_id', $subjects->pluck('id'))->get();
            $tutors = [];
        } else {
            // Student
            $enrolledCourseIds = $user->enrolledCourses()->pluck('courses.id')->toArray();
            
            $sessions = LiveSession::where(function($query) use ($user, $enrolledCourseIds) {
                $query->where('student_id', $user->id)
                      ->orWhereIn('course_id', $enrolledCourseIds);
            })
            ->with(['tutor', 'course'])
            ->orderBy('scheduled_at', 'asc')
            ->get();
            
            $courses = [];
            // List of tutors for booking 1-on-1
            $tutors = User::where('role', 'tutor')->get();
        }

        return Inertia::render('Sessions/Index', [
            'sessions' => $sessions,
            'courses' => $courses,
            'tutors' => $tutors
        ]);
    }

    public function store(StoreLiveSessionRequest $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        if ($user->role === 'admin') {
            $tutorId = $request->input('tutor_id');
            $courseId = $request->input('course_id');
        } else {
            // Tutor
            $tutorId = $user->id;
            $courseId = $request->input('course_id');
            
            // SECURITY FIX: Ensure tutor is assigned to this course's subject
            $course = Course::findOrFail($courseId);
            if (!$user->subjects()->where('subjects.id', $course->subject_id)->exists()) {
                abort(403, 'You are not assigned to teach this course.');
            }
        }

        $scheduledAt = Carbon::parse($request->input('scheduled_at'));
        $duration = $request->input('duration_minutes') ?? 60;
        $endTime = $scheduledAt->copy()->addMinutes($duration);

        // HARDENING FIX 1: Double Booking Prevention
        $tutorOverlap = LiveSession::where('tutor_id', $tutorId)
            ->whereIn('status', ['scheduled', 'live'])
            ->where('scheduled_at', '<', $endTime)
            ->get()
            ->contains(fn (LiveSession $existingSession) => $existingSession->end_time?->gt($scheduledAt));

        if ($tutorOverlap) {
            return back()->withErrors(['scheduled_at' => 'Tutor already has a session scheduled during this time slot.']);
        }

        $meetingLink = $request->input('meeting_link');

        $session = LiveSession::create([
            'tutor_id' => $tutorId,
            'student_id' => null,
            'course_id' => $courseId,
            'topic' => $request->input('topic'),
            'scheduled_at' => $scheduledAt,
            'duration_minutes' => $request->input('duration_minutes'),
            'platform' => 'google_meet',
            'meeting_link' => $meetingLink,
            'webrtc_room_id' => null,
            'status' => $request->input('status', 'scheduled') ?: 'scheduled',
        ]);

        $this->notifyStudents(
            $session, 
            "New Class Scheduled: {$session->topic}", 
            "A new class has been scheduled for " . $session->scheduled_at->format('M d, Y h:i A')
        );

        return back()->with('message', 'Session scheduled successfully' . ($meetingLink ? ' with Google Meet link.' : '.'));
    }

    public function join(LiveSession $session)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if (!$this->canAccessSession($user, $session)) {
            abort(403, 'You are not authorized to join this session.');
        }

        if (empty($session->meeting_link)) {
            return back()->withErrors(['meeting_link' => 'Meeting link is not available yet.']);
        }

        return redirect($session->meeting_link);
    }

    private function canAccessSession(User $user, LiveSession $session): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'tutor') {
            return $user->id === $session->tutor_id;
        }

        if ($session->student_id && $user->id === $session->student_id) {
            return true;
        }

        if (!$session->course_id) {
            return false;
        }

        return $user->enrollments()
            ->where('course_id', $session->course_id)
            ->exists();
    }

    public function update(UpdateLiveSessionRequest $request, LiveSession $session)
    {
        // HARDENING FIX 2: State Machine Enforcement
        $oldStatus = $session->status;
        $newStatus = $request->input('status');

        if ($oldStatus !== $newStatus) {
            if ($oldStatus === 'completed' || $oldStatus === 'cancelled') {
                return back()->withErrors(['status' => 'Cannot modify status of a completed or cancelled session.']);
            }
            if ($oldStatus === 'scheduled' && !in_array($newStatus, ['live', 'cancelled'])) {
                return back()->withErrors(['status' => "Invalid transition from scheduled to $newStatus."]);
            }
            if ($oldStatus === 'live' && !in_array($newStatus, ['completed', 'cancelled'])) {
                return back()->withErrors(['status' => "Invalid transition from live to $newStatus."]);
            }
        }

        $session->fill([
            'topic' => $request->input('topic'),
            'scheduled_at' => Carbon::parse($request->input('scheduled_at')),
            'duration_minutes' => $request->input('duration_minutes'),
            'status' => $request->input('status'),
            'meeting_link' => $request->input('meeting_link'),
        ]);

        $timeChanged = $session->isDirty('scheduled_at');
        $session->save();

        if ($timeChanged) {
            $this->notifyStudents(
                $session, 
                "Class Rescheduled: {$session->topic}", 
                "The class is now scheduled for " . $session->scheduled_at->format('M d, Y h:i A')
            );
        }

        return back()->with('message', 'Session updated successfully.');
    }

    public function destroy(LiveSession $session)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if ($user->role !== 'admin' && $user->id !== $session->tutor_id) {
            abort(403, 'Unauthorized action.');
        }

        $session->update(['status' => 'cancelled']);
        
        $this->notifyStudents(
            $session, 
            "Class Cancelled: {$session->topic}", 
            "The class scheduled for " . $session->scheduled_at->format('M d, Y h:i A') . " has been cancelled."
        );

        // Or $session->delete(); but updating status maintains record for history
        return back()->with('message', 'Session cancelled successfully.');
    }

    public function submitAttendance(Request $request, LiveSession $session)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if ($user->role !== 'admin' && $user->id !== $session->tutor_id) {
            abort(403, 'Unauthorized action.');
        }

        if ($session->attendance_locked && $user->role !== 'admin') {
            abort(403, 'Attendance is locked. Contact an administrator to unlock it.');
        }

        $validated = $request->validate([
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:users,id',
            'attendances.*.status' => 'nullable|in:present,absent,late,excused',
            'attendances.*.is_present' => 'nullable|boolean',
            'attendances.*.notes' => 'nullable|string',
        ]);

        foreach ($validated['attendances'] as $data) {
            $attendance = Attendance::firstOrNew([
                'live_session_id' => $session->id,
                'student_id' => $data['student_id']
            ]);

            $newStatus = $data['status'] ?? (($data['is_present'] ?? false) ? 'present' : 'absent');
            $previousXp = $attendance->exists ? (int) $attendance->xp_awarded : 0;
            $newXp = $this->xpForAttendanceStatus($newStatus);

            $attendance->status = $newStatus;
            $attendance->notes = $data['notes'] ?? null;
            $attendance->xp_awarded = $newXp;
            $attendance->save();

            $xpDelta = $newXp - $previousXp;

            if ($xpDelta !== 0) {
                $student = User::find($data['student_id']);

                if ($student) {
                    $student->points = max(0, (int) $student->points + $xpDelta);
                    $student->save();
                }
            }
        }

        $session->forceFill([
            'status' => 'completed',
            'attendance_locked' => true,
        ])->save();

        \Illuminate\Support\Facades\Log::info("Attendance modified for LiveSession {$session->id} by User {$user->id}");

        return back()->with('message', 'Attendance submitted and session marked as completed.');
    }

    public function unlockAttendance(LiveSession $session)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->role !== 'admin') {
            abort(403, 'Only administrators can unlock attendance.');
        }

        $session->update(['attendance_locked' => false]);

        return back()->with('message', 'Attendance unlocked successfully.');
    }

    private function xpForAttendanceStatus(string $status): int
    {
        return match ($status) {
            'present' => 5,
            'late' => 2,
            default => 0,
        };
    }

    public function uploadRecording(Request $request, LiveSession $session)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if ($user->role !== 'admin' && $user->id !== $session->tutor_id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'recording_url' => 'required|url',
            'password' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        \App\Models\LiveSessionRecording::updateOrCreate(
            ['live_session_id' => $session->id],
            [
                'recording_url' => $validated['recording_url'],
                'password' => $validated['password'],
                'notes' => $validated['notes']
            ]
        );

        return back()->with('message', 'Recording link updated successfully.');
    }

    /**
     * Dispatch a notification to relevant students.
     * HARDENING FIX 4: Deduplication guard — skip if an identical unread
     * notification (same title + session) was already sent within the last 60 seconds.
     */
    private function notifyStudents(LiveSession $session, $title, $body)
    {
        $actionUrl = route('sessions.index');

        $recipients = collect();

        if ($session->student_id) {
            $student = \App\Models\User::find($session->student_id);
            if ($student) {
                $recipients->push($student);
            }
        } elseif ($session->course_id) {
            $recipients = \App\Models\User::whereHas('enrollments', function ($q) use ($session) {
                $q->where('course_id', $session->course_id);
            })->get();
        }

        /** @var User $recipient */
        foreach ($recipients as $recipient) {
            // Deduplication: skip if an identical notification was sent in the last 60 seconds
            $alreadySent = DB::table('notifications')
                ->where('notifiable_id', $recipient->id)
                ->where('notifiable_type', User::class)
                ->where('read_at', null)
                ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.title')) = ?", [$title])
                ->where('created_at', '>=', now()->subSeconds(60))
                ->exists();

            if (!$alreadySent) {
                $recipient->notify(new \App\Notifications\ClassNotification($title, $body, $actionUrl));
            }
        }
    }
}
