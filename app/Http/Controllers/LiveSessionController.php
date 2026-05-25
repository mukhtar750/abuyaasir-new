<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\LiveSession;
use App\Services\GoogleMeetService;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Carbon\Carbon;

class LiveSessionController extends Controller
{
    protected $googleMeet;

    public function __construct(GoogleMeetService $googleMeet)
    {
        $this->googleMeet = $googleMeet;
    }

    public function index()
    {
        $sessions = auth()->user()->role === 'tutor' 
            ? auth()->user()->tutorSessions()->with('student')->get()
            : auth()->user()->studentSessions()->with('tutor')->get();

        return Inertia::render('Sessions/Index', [
            'sessions' => $sessions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tutor_id' => 'required|exists:users,id',
            'topic' => 'required|string|max:255',
            'scheduled_at' => 'required|date',
            'duration_minutes' => 'integer|min:15',
            'platform' => 'required|in:google_meet,webrtc',
        ]);

        $scheduledAt = Carbon::parse($validated['scheduled_at']);
        $meetingLink = null;

        if ($validated['platform'] === 'google_meet') {
            $meetingLink = $this->googleMeet->createMeeting(
                $validated['topic'], 
                $scheduledAt, 
                $validated['duration_minutes'] ?? 60
            );
        }

        $session = LiveSession::create([
            'tutor_id' => $validated['tutor_id'],
            'student_id' => auth()->id(),
            'topic' => $validated['topic'],
            'scheduled_at' => $scheduledAt,
            'duration_minutes' => $validated['duration_minutes'],
            'platform' => $validated['platform'],
            'meeting_link' => $meetingLink,
            'webrtc_room_id' => $validated['platform'] === 'webrtc' ? Str::random(12) : null,
            'status' => 'scheduled',
        ]);

        return back()->with('message', 'Session scheduled successfully' . ($meetingLink ? ' with Google Meet link.' : '.'));
    }

    public function join(LiveSession $session)
    {
        if ($session->platform === 'webrtc') {
            return Inertia::render('Sessions/Room', [
                'session' => $session->load(['tutor', 'student']),
                'roomName' => $session->webrtc_room_id
            ]);
        }

        return redirect($session->meeting_link);
    }
}
