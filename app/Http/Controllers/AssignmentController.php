<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $tutor */
        $tutor = auth()->user();

        // Tutors only see assignments for courses within their assigned subjects
        $assignments = Assignment::whereHas('course', function($query) use ($tutor) {
            $query->whereIn('subject_id', $tutor->subjects()->pluck('subjects.id'));
        })->with(['course', 'submissions.student'])->get();

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

        /** @var \App\Models\User $tutor */
        $tutor = auth()->user();

        // Verify tutor is assigned to the subject of this course
        $course = Course::findOrFail($request->course_id);
        if (!$tutor->subjects()->where('subjects.id', $course->subject_id)->exists()) {
            abort(403, 'You are not authorized to create assignments for this course.');
        }

        $assignment = Assignment::create($request->all());

        // Notify enrolled students
        $course->load('enrollments.user');
        if ($course->enrollments) {
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
