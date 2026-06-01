<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Enrollment;
use Inertia\Inertia;

class TutorDashboardController extends Controller
{
    public function index()
    {
        $tutor = auth()->user();

        // 1. Get subjects assigned to this tutor by Admin
        $subjects = $tutor->subjects()->get();

        // 2. Get courses belonging to these subjects
        $courses = Course::whereIn('subject_id', $subjects->pluck('id'))
            ->with(['subject', 'lessons'])
            ->get();

        // 3. Find enrolled students across tutor's courses
        $enrollments = Enrollment::whereIn('course_id', $courses->pluck('id'))
            ->with(['student', 'course'])
            ->get();

        $stats = [
            'my_subjects' => $subjects->count(),
            'my_courses' => $courses->count(),
            'total_students' => $enrollments->unique('student_id')->count(),
        ];

        // 4. Fetch classes scheduled today
        $classesToday = \App\Models\LiveSession::where('tutor_id', $tutor->id)
            ->whereDate('scheduled_at', now()->toDateString())
            ->with(['student', 'course'])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return Inertia::render('Tutor/Dashboard', [
            'stats' => $stats,
            'subjects' => $subjects,
            'courses' => $courses,
            'enrollments' => $enrollments,
            'classesToday' => $classesToday,
        ]);
    }

    // Tutor Action: Create a course under their assigned subjects
    public function createCourse(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'type' => 'required|string', // Standard, JAMB, WAEC, Summer
            'price' => 'required|numeric|min:0',
        ]);

        // Verify tutor is actually mapped to this subject
        $tutor = auth()->user();
        if (!$tutor->subjects()->where('subjects.id', $request->subject_id)->exists()) {
            return redirect()->back()->withErrors(['subject_id' => 'You are not assigned to teach this subject.']);
        }

        Course::create([
            'subject_id' => $request->subject_id,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'price' => $request->price,
            'is_published' => true,
        ]);

        return redirect()->back()->with('message', 'Course created successfully.');
    }

    // Tutor Action: Add a lesson to a course
    public function createLesson(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string',
            'video_url' => 'nullable|url',
            'content' => 'nullable|string',
        ]);

        $course = Course::findOrFail($request->course_id);

        // Verify tutor teaches this course's subject
        $tutor = auth()->user();
        if (!$tutor->subjects()->where('subjects.id', $course->subject_id)->exists()) {
            return redirect()->back()->withErrors(['course_id' => 'You do not own this course.']);
        }

        $orderIndex = Lesson::where('course_id', $course->id)->count() + 1;

        Lesson::create([
            'course_id' => $course->id,
            'title' => $request->title,
            'video_url' => $request->video_url,
            'content' => $request->input('content'),
            'order_index' => $orderIndex,
        ]);

        return redirect()->back()->with('message', 'Lesson added successfully.');
    }
}
