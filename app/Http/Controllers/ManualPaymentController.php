<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ManualPaymentController extends Controller
{
    /**
     * Student submits a receipt for course enrollment
     */
    public function submitReceipt(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'amount' => 'required|numeric|min:0',
            'receipt' => 'required|image|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        // Prevent duplicate pending submissions for the same course
        $existing = Transaction::where('user_id', auth()->id())
            ->where('course_id', $request->course_id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return back()->withErrors(['duplicate' => 'You already have a pending verification for this course.']);
        }

        $path = $request->file('receipt')->store('receipts', 'public');

        Transaction::create([
            'user_id' => auth()->id(),
            'course_id' => $request->course_id,
            'amount' => $request->amount,
            'type' => 'payment',
            'status' => 'pending',
            'payment_method' => 'manual_upload',
            'reference' => 'MAN-' . strtoupper(Str::random(10)),
            'proof_of_payment' => $path,
        ]);

        return back()->with('message', 'Receipt uploaded successfully! Admin will verify and approve your enrollment shortly.');
    }

    /**
     * Admin approves a transaction and enrolls the student
     */
    public function approve(Transaction $transaction)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $transaction->update(['status' => 'success']);

        // Enroll the student
        Enrollment::updateOrCreate(
            [
                'student_id' => $transaction->user_id,
                'course_id' => $transaction->course_id,
            ],
            [
                'enrolled_by_admin' => true, // Technically approved by admin
                'progress_percent' => 0,
            ]
        );

        return back()->with('message', 'Payment approved and student enrolled successfully.');
    }

    /**
     * Admin rejects a transaction
     */
    public function reject(Request $request, Transaction $transaction)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $request->validate([
            'note' => 'required|string|max:255',
        ]);

        $transaction->update([
            'status' => 'failed',
            'admin_note' => $request->note
        ]);

        return back()->with('message', 'Payment rejected.');
    }
}
