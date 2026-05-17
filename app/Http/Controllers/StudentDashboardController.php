<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Subject;
use App\Models\Enrollment;
use App\Models\Campaign;
use App\Models\CbtExam;
use App\Models\CbtResult;
use Inertia\Inertia;

class StudentDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isTutor()) {
            return redirect()->route('tutor.dashboard');
        }

        // 1. Enrolled Courses with their Pivot Data (progress_percent)
        $enrollments = Enrollment::where('student_id', $user->id)
            ->with(['course.subject'])
            ->get();

        // 2. Active Promotional Campaigns (Ad Engine)
        $campaigns = Campaign::where('is_active', true)->get();

        // 3. Recommended/Explore Courses (Physics, Chemistry, Maths)
        $exploreCourses = Course::where('is_published', true)
            ->whereNotIn('id', $enrollments->pluck('course_id'))
            ->with('subject')
            ->limit(4)
            ->get();

        // 4. CBT Mock Exams (JAMB/WAEC prep assigned to enrolled courses)
        $upcomingCbts = CbtExam::whereIn('course_id', $enrollments->pluck('course_id'))
            ->with('course.subject')
            ->get();

        // 5. CBT Exam Results
        $cbtResults = CbtResult::where('student_id', $user->id)
            ->with('cbtExam.course')
            ->latest()
            ->get();

        // 6. Basic Statistics
        $stats = [
            'enrolled_courses' => $enrollments->count(),
            'points' => $user->points,
            'streak_days' => $user->streak_days,
            'completed_courses' => $enrollments->whereNotNull('completed_at')->count(),
        ];

        return Inertia::render('Student/Dashboard', [
            'enrollments' => $enrollments,
            'campaigns' => $campaigns,
            'exploreCourses' => $exploreCourses,
            'upcomingCbts' => $upcomingCbts,
            'cbtResults' => $cbtResults,
            'stats' => $stats,
        ]);
    }

    public function enrollSelf($id)
    {
        $user = auth()->user();
        $course = Course::findOrFail($id);

        // Avoid duplicate enrollment
        $exists = Enrollment::where('student_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors(['enrollment' => 'You are already enrolled in this course.']);
        }

        Enrollment::create([
            'student_id' => $user->id,
            'course_id' => $course->id,
            'enrolled_by_admin' => false,
            'progress_percent' => 0,
        ]);

        // Award startup points for starting a new course!
        $user->increment('points', 10);

        return redirect()->back()->with('message', "Successfully enrolled in {$course->title}! You earned +10 XP!");
    }
}
