<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\LiveSession;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with('subject')->where('is_published', true)->get();
        return Inertia::render('Student/Courses/Catalog', [
            'courses' => $courses
        ]);
    }

    public function show($id)
    {
        $course = Course::with(['subject', 'lessons'])->findOrFail($id);
        $bankAccountNumber = Setting::get('bank_account_number', '0123456789');
        return Inertia::render('Student/Courses/Show', [
            'course' => $course,
            'bankAccountNumber' => $bankAccountNumber,
        ]);
    }

    public function learn($id)
    {
        $course = Course::with(['lessons', 'subject'])->findOrFail($id);
        
        $enrollment = $course->enrollments()->where('student_id', auth()->id())->firstOrFail();

        $completedLessonIds = LessonProgress::where('user_id', auth()->id())
            ->whereIn('lesson_id', $course->lessons->pluck('id'))
            ->pluck('lesson_id')
            ->toArray();

        // Retrieve live sessions scheduled for this specific course
        $liveSessions = LiveSession::where('course_id', $course->id)
            ->with('tutor')
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return Inertia::render('Student/Courses/Learn', [
            'course' => $course,
            'completedLessonIds' => $completedLessonIds,
            'progressPercent' => $enrollment->progress_percent,
            'liveSessions' => $liveSessions,
        ]);
    }

    public function completeLesson(Request $request, $id, $lesson_id)
    {
        $course = Course::findOrFail($id);
        $lesson = Lesson::where('course_id', $id)->findOrFail($lesson_id);
        $user = auth()->user();

        LessonProgress::firstOrCreate([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
        ], [
            'completed_at' => now(),
        ]);

        $this->updateCourseProgress($user, $course);

        return redirect()->back()->with('success', 'Lesson marked as complete');
    }

    private function updateCourseProgress($user, $course)
    {
        $totalLessons = $course->lessons()->count();
        // Incorporating live sessions based on topic/student presence
        $attendedLiveSessions = LiveSession::where('student_id', $user->id)
            ->where('status', 'completed')
            ->where(function($query) use ($course) {
                $query->where('topic', 'like', '%' . $course->title . '%')
                      ->orWhere('topic', 'like', '%' . $course->subject->name . '%');
            })->count();
        
        $completedLessons = LessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $course->lessons->pluck('id'))
            ->count();

        // Calculate progress matching topic coverage and attendance
        $totalItems = $totalLessons + ($attendedLiveSessions > 0 ? $attendedLiveSessions : 0);
        $completedItems = $completedLessons + $attendedLiveSessions;

        if ($totalItems > 0) {
            $progress = round(($completedItems / $totalItems) * 100);
        } else {
            $progress = 0;
        }

        $enrollment = $course->enrollments()->where('student_id', $user->id)->first();
        if ($enrollment) {
            $enrollment->update(['progress_percent' => min($progress, 100)]);
        }
    }
}
