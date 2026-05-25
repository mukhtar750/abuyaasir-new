<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Subject;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Campaign;
use App\Models\Setting;
use App\Models\Transaction;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 1. Stats Row
        $stats = [
            'total_students' => User::where('role', 'student')->count(),
            'total_tutors' => User::where('role', 'tutor')->count(),
            'total_courses' => Course::count(),
            'total_subjects' => Subject::count(),
            'pending_payments' => Transaction::where('status', 'pending')->count(),
            'maintenance_mode' => Setting::get('maintenance_mode', 'false') === 'true',
        ];

        // 2. Fetch Lists for Admin Controls
        $tutors = User::where('role', 'tutor')->get();
        $students = User::where('role', 'student')->get();
        $subjects = Subject::with('tutors')->get();
        $courses = Course::with(['subject', 'lessons'])->get();
        $campaigns = Campaign::latest()->get();
        $allUsers = User::orderBy('name')->get();
        $pendingTransactions = Transaction::with(['user', 'course'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'tutors' => $tutors,
            'students' => $students,
            'subjects' => $subjects,
            'courses' => $courses,
            'campaigns' => $campaigns,
            'allUsers' => $allUsers,
            'pendingTransactions' => $pendingTransactions,
        ]);
    }

    // Admin Action: Create a Subject (e.g. Physics, Chemistry, Math)
    public function createSubject(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:subjects,name',
            'description' => 'nullable|string',
        ]);

        Subject::create($request->only('name', 'description'));

        return redirect()->back()->with('message', 'Subject created successfully.');
    }

    // Admin Action: Map a Tutor to a Subject
    public function assignTutor(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'tutor_id' => 'required|exists:users,id',
        ]);

        $subject = Subject::findOrFail($request->subject_id);
        $subject->tutors()->syncWithoutDetaching([$request->tutor_id]);

        return redirect()->back()->with('message', 'Tutor assigned to subject successfully.');
    }

    // Admin Action: Manually Enroll a Student to a Course
    public function enrollStudent(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        Enrollment::updateOrCreate(
            [
                'student_id' => $request->student_id,
                'course_id' => $request->course_id,
            ],
            [
                'enrolled_by_admin' => true,
            ]
        );

        return redirect()->back()->with('message', 'Student enrolled successfully.');
    }

    // Admin Action: Create/Update Ad Campaign (Ad Engine)
    public function saveCampaign(Request $request)
    {
        $request->validate([
            'id' => 'nullable|exists:campaigns,id',
            'title' => 'required|string',
            'type' => 'required|string', // Summer, JAMB, General
            'image_url' => 'nullable|string',
            'link' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        Campaign::updateOrCreate(
            ['id' => $request->id],
            $request->only('title', 'type', 'image_url', 'link', 'is_active')
        );

        return redirect()->back()->with('message', 'Campaign saved successfully.');
    }

    // Admin Action: Toggle Maintenance/Developer Mode
    public function toggleMaintenance(Request $request)
    {
        $request->validate([
            'active' => 'required|boolean',
        ]);

        Setting::set('maintenance_mode', $request->active ? 'true' : 'false');

        $status = $request->active ? 'Enabled' : 'Disabled';
        return redirect()->back()->with('message', "Maintenance mode is now {$status}.");
    }

    // Admin Action: Update User Role (e.g. promote Student to Tutor/Admin)
    public function updateUserRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:student,tutor,admin',
        ]);

        $user = User::findOrFail($id);
        
        // Prevent self-demotion from admin
        if ($user->id === auth()->id() && $request->role !== 'admin') {
            return redirect()->back()->with('error', 'You cannot change your own admin role.');
        }

        $user->role = $request->role;
        $user->save();

        return redirect()->back()->with('message', "Role for {$user->name} updated to {$request->role}.");
    }

    // Admin Action: Delete User Account (Suspension)
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own admin account.');
        }

        $user->delete();

        return redirect()->back()->with('message', "User account {$user->name} deleted successfully.");
    }

    // Admin Action: Reset User Password manually
    public function resetUserPassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::findOrFail($id);
        $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        $user->save();

        return redirect()->back()->with('message', "Password for {$user->name} has been reset successfully.");
    }

    // Admin Action: Delete Subject Category
    public function deleteSubject($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return redirect()->back()->with('message', 'Subject deleted successfully.');
    }

    // Admin Action: Quick Toggle Campaign Status
    public function toggleCampaignStatus(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->is_active = !$campaign->is_active;
        $campaign->save();

        $status = $campaign->is_active ? 'Activated' : 'Paused';
        return redirect()->back()->with('message', "Campaign '{$campaign->title}' has been {$status}.");
    }

    // Admin Action: Delete Campaign
    public function deleteCampaign($id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->delete();

        return redirect()->back()->with('message', 'Campaign deleted successfully.');
    }

    // Admin Action: Get Bank Details
    public function getBankDetails()
    {
        return response()->json([
            'account_number' => Setting::get('bank_account_number', '0123456789'),
        ]);
    }

    // Admin Action: Update Bank Details
    public function updateBankDetails(Request $request)
    {
        $request->validate([
            'account_number' => 'required|string|max:50',
        ]);
        Setting::set('bank_account_number', $request->account_number);
        return response()->json(['message' => 'Bank details updated successfully.'], 200);
    }

    // Admin UI: Edit Bank Details Page
    public function editBankDetails()
    {
        $accountNumber = Setting::get('bank_account_number', '0123456789');
        return Inertia::render('Admin/BankSettings', [
            'accountNumber' => $accountNumber,
        ]);
    }

}
