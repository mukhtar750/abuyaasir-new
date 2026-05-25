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

    public function showSubmit($id)
    {
        $assignment = Assignment::with('course')->findOrFail($id);
        $submission = AssignmentSubmission::where('assignment_id', $id)
            ->where('student_id', auth()->id())
            ->first();

        return Inertia::render('Student/Assignments/Submit', [
            'assignment' => $assignment,
            'submission' => $submission
        ]);
    }

    public function submit(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|max:10240' // 10MB max
        ]);

        $path = $request->file('file')->store('submissions', 'public');

        AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $id, 'student_id' => auth()->id()],
            ['file_path' => $path]
        );

        return redirect()->back()->with('success', 'Assignment submitted successfully.');
    }

    public function grade(Request $request, $submissionId)
    {
        $request->validate([
            'score' => 'required|integer|min:0',
            'feedback' => 'nullable|string'
        ]);

        $submission = AssignmentSubmission::with(['student', 'assignment.course'])->findOrFail($submissionId);
        $submission->update([
            'score' => $request->score,
            'feedback' => $request->feedback
        ]);

        // Notify Student
        \Illuminate\Support\Facades\Mail::to($submission->student->email)->send(new \App\Mail\AssignmentGradedMail($submission));

        return redirect()->back()->with('success', 'Assignment graded.');
    }
}
