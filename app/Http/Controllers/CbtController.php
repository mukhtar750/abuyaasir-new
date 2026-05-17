<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CbtExam;
use App\Models\CbtQuestion;
use App\Models\CbtResult;
use Inertia\Inertia;

use Barryvdh\DomPDF\Facade\Pdf;

class CbtController extends Controller
{
    // Start taking a CBT exam
    public function takeExam($id)
    {
        $exam = CbtExam::with(['questions', 'course.subject'])->findOrFail($id);
        $user = auth()->user();

        // Safety: verify student is enrolled in the course associated with this CBT
        if (!$user->enrolledCourses()->where('courses.id', $exam->course_id)->exists() && !$user->isAdmin()) {
            return redirect()->route('dashboard')->withErrors(['unauthorized' => 'You are not enrolled in this course.']);
        }

        return Inertia::render('Cbt/ExamSession', [
            'exam' => $exam,
        ]);
    }

    // Submit CBT Answers and Grade
    public function submitExam(Request $request, $id)
    {
        $request->validate([
            'answers' => 'required|array', // e.g. [question_id => "A", ...]
            'time_spent_seconds' => 'required|integer',
        ]);

        $exam = CbtExam::with('questions')->findOrFail($id);
        $user = auth()->user();

        $questions = $exam->questions;
        $totalQuestions = $questions->count();
        $correctAnswersCount = 0;

        foreach ($questions as $question) {
            $submittedAnswer = $request->answers[$question->id] ?? null;
            if ($submittedAnswer === $question->correct_option) {
                $correctAnswersCount++;
            }
        }

        // Calculate score percentage
        $score = $totalQuestions > 0 ? (int)(($correctAnswersCount / $totalQuestions) * 100) : 0;

        // Save CBT Result
        $result = CbtResult::create([
            'student_id' => $user->id,
            'cbt_exam_id' => $exam->id,
            'score' => $score,
            'time_spent_seconds' => $request->time_spent_seconds,
        ]);

        // --- Gamification Points Engine ---
        // Award points for completing the CBT mock (+50 points)
        // Award extra +5 points for every correct answer
        $earnedPoints = 50 + ($correctAnswersCount * 5);
        $user->increment('points', $earnedPoints);

        // Manage daily learning streak
        $user->increment('streak_days', 1);

        return redirect()->route('dashboard')->with('message', "Mock exam submitted successfully! Score: {$score}%. You earned +{$earnedPoints} points!");
    }

    // Download PDF Certificate of CBT Performance
    public function downloadPdf($id)
    {
        $result = CbtResult::with(['cbtExam.course.subject', 'student'])->findOrFail($id);
        $user = auth()->user();

        // Safety: verify student is the owner of the result or is an Admin
        if ($user->id !== $result->student_id && !$user->isAdmin()) {
            return response('Unauthorized.', 403);
        }

        $data = [
            'student_name' => $result->student->name,
            'subject_name' => $result->cbtExam->course->subject->name,
            'score'        => $result->score,
            'duration_mins'=> (int)($result->time_spent_seconds / 60),
            'date'         => $result->created_at->format('M d, Y - h:i A'),
        ];

        $pdf = Pdf::loadView('pdf.cbt_result', $data);

        return $pdf->download("cbt_report_{$result->id}.pdf");
    }
}
