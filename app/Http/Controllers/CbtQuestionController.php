<?php

namespace App\Http\Controllers;

use App\Models\CbtExam;
use App\Models\CbtQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CbtQuestionController extends Controller
{
    public function index(CbtExam $exam)
    {
        return Inertia::render('Tutor/Cbt/QuestionManager', [
            'exam' => $exam->load('questions')
        ]);
    }

    public function store(Request $request, CbtExam $exam)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->role !== 'admin' && $user->role !== 'tutor') {
            abort(403);
        }

        $request->validate([
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'correct_option' => 'required|string',
        ]);

        CbtQuestion::create([
            'cbt_exam_id' => $exam->id,
            'question_text' => $request->question_text,
            'options' => $request->options,
            'correct_option' => $request->correct_option,
        ]);

        return redirect()->back()->with('success', 'Question added successfully.');
    }

    public function import(Request $request, CbtExam $exam)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->role !== 'admin' && $user->role !== 'tutor') {
            abort(403);
        }

        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt'
        ]);

        $path = $request->file('csv_file')->getRealPath();
        $data = array_map('str_getcsv', file($path));
        $header = array_shift($data); // Remove headers

        foreach ($data as $row) {
            if (count($row) >= 6) {
                CbtQuestion::create([
                    'cbt_exam_id' => $exam->id,
                    'question_text' => $row[0],
                    'options' => [
                        'A' => $row[1],
                        'B' => $row[2],
                        'C' => $row[3],
                        'D' => $row[4],
                    ],
                    'correct_option' => $row[5],
                ]);
            }
        }

        return redirect()->back()->with('success', 'Questions imported successfully.');
    }
}
