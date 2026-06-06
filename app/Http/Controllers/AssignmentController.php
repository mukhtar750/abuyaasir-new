<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function index()
    {
        $assignments = Assignment::with(['course', 'submissions.student'])->get();
        return Inertia::render('Tutor/Assignments/Index', [
            'assignments' => $assignments
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'max_score' => 'required|integer',
        ]);

        $assignment = Assignment::create($request->all());

        // Notify enrolled students
        $course = \App\Models\Course::with('enrollments.user')->find($request->course_id);
        if ($course) {
            foreach ($course->enrollments as $enrollment) {
                if ($enrollment->user) {
                    \Illuminate\Support\Facades\Mail::to($enrollment->user->email)->send(new \App\Mail\AssignmentPostedMail($assignment, $enrollment->user));
                }
            }
        }

        return redirect()->back()->with('success', 'Assignment created successfully.');
    }

    public function showSubmit(Assignment $assignment)
    {
        $userId = auth()->id();
        $submission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('student_id', $userId)
            ->first();

        return Inertia::render('Student/Assignments/Submit', [
            'assignment' => $assignment->load('course'),
            'submission' => $submission
        ]);
    }

    public function submit(Request $request, Assignment $assignment)
    {
        $request->validate([
            'file' => 'required|file|max:10240' // 10MB max
        ]);

        $path = $request->file('file')->store('submissions', 'public');

        $userId = auth()->id();
        AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'student_id' => $userId],
            ['file_path' => $path]
        );

        return redirect()->back()->with('success', 'Assignment submitted successfully.');
    }

    public function grade(Request $request, AssignmentSubmission $submission)
    {
        $request->validate([
            'score' => 'required|integer|min:0',
            'feedback' => 'nullable|string'
        ]);

        $submission->update([
            'score' => $request->score,
            'feedback' => $request->feedback
        ]);

        // Notify Student
        \Illuminate\Support\Facades\Mail::to($submission->student->email)->send(new \App\Mail\AssignmentGradedMail($submission));

        return redirect()->back()->with('success', 'Assignment graded.');
    }
}
