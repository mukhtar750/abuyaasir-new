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
use App\Models\LiveSession;
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
            'bank_name' => Setting::get('bank_name', 'Not Configured'),
        ];

        // 2. Fetch Lists for Admin Controls
        $tutors = User::where('role', 'tutor')->where('is_approved', true)->with(['courses.enrollments.student', 'subjects', 'tutorSessions'])->get();
        $pendingTutors = User::where('role', 'tutor')->where('is_approved', false)->get();
        $students = User::where('role', 'student')->get();
        $subjects = Subject::with('tutors')->get();
        $courses = Course::with(['subject', 'lessons', 'cbtExams'])->where('is_approved', true)->get();
        $pendingCourses = Course::with(['subject', 'lessons', 'tutors', 'cbtExams'])->where('is_approved', false)->get();
        $campaigns = Campaign::latest()->get();
        $allUsers = User::orderBy('name')->get();
        $pendingTransactions = Transaction::with(['user', 'course'])
            ->where('status', 'pending')
            ->latest()
            ->get();
        $sessions = LiveSession::with(['tutor', 'student', 'course'])
            ->orderBy('scheduled_at', 'desc')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'tutors' => $tutors,
            'pendingTutors' => $pendingTutors,
            'students' => $students,
            'subjects' => $subjects,
            'courses' => $courses,
            'pendingCourses' => $pendingCourses,
            'campaigns' => $campaigns,
            'allUsers' => $allUsers,
            'pendingTransactions' => $pendingTransactions,
            'sessions' => $sessions,
        ]);
    }

    // Admin Action: Approve Tutor Application
    public function approveTutor(User $user)
    {
        $user->update(['is_approved' => true]);
        
        // Notify Tutor via Email
        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\TutorApprovedMail($user));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to send approval mail to tutor: " . $e->getMessage());
        }

        return redirect()->back()->with('message', "Tutor {$user->name} has been approved and notified.");
    }

    // Admin Action: Reject Tutor Application
    public function rejectTutor(Request $request, User $user)
    {
        $request->validate(['note' => 'required|string']);
        $user->update([
            'is_approved' => false,
            'admin_note' => $request->note
        ]);
        return redirect()->back()->with('message', "Tutor application for {$user->name} has been rejected.");
    }

    // Admin Action: Approve Course
    public function approveCourse(Course $course)
    {
        $course->update(['is_approved' => true]);
        return redirect()->back()->with('message', "Course '{$course->title}' has been approved.");
    }

    // Admin Action: Reject Course
    public function rejectCourse(Request $request, Course $course)
    {
        $request->validate(['note' => 'required|string']);
        $course->update([
            'is_approved' => false,
            'admin_note' => $request->note
        ]);
        return redirect()->back()->with('message', "Course '{$course->title}' has been rejected.");
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

    // Admin Action: Create a Course
    public function createCourse(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'type' => 'required|string', // Standard, JAMB, WAEC, Summer
            'price' => 'required|numeric|min:0',
        ]);

        Course::create([
            'subject_id' => $request->subject_id,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'price' => $request->price,
            'is_approved' => true, // Admin created courses are auto-approved
            'is_published' => true,
        ]);

        return redirect()->back()->with('message', 'Course created successfully.');
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
    public function updateUserRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:student,tutor,admin',
        ]);
        
        /** @var \App\Models\User $currentUser */
        $currentUser = auth()->user();

        // Prevent self-demotion from admin
        if ($user->id === $currentUser->id && $request->role !== 'admin') {
            return redirect()->back()->with('error', 'You cannot change your own admin role.');
        }

        $user->role = $request->role;
        $user->save();

        return redirect()->back()->with('message', "Role for {$user->name} updated to {$request->role}.");
    }

    // Admin Action: Delete User Account (Suspension)
    public function deleteUser(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own admin account.');
        }

        $user->delete();

        return redirect()->back()->with('message', "User account {$user->name} deleted successfully.");
    }

    // Admin Action: Reset User Password manually
    public function resetUserPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        $user->save();

        return redirect()->back()->with('message', "Password for {$user->name} has been reset successfully.");
    }

    // Admin Action: Delete Subject Category
    public function deleteSubject(Subject $subject)
    {
        $subject->delete();

        return redirect()->back()->with('message', 'Subject deleted successfully.');
    }

    // Admin Action: Quick Toggle Campaign Status
    public function toggleCampaignStatus(Campaign $campaign)
    {
        $campaign->is_active = !$campaign->is_active;
        $campaign->save();

        $status = $campaign->is_active ? 'Activated' : 'Paused';
        return redirect()->back()->with('message', "Campaign '{$campaign->title}' has been {$status}.");
    }

    // Admin Action: Delete Campaign
    public function deleteCampaign(Campaign $campaign)
    {
        $campaign->delete();

        return redirect()->back()->with('message', 'Campaign deleted successfully.');
    }

    // Admin Action: Get Bank Details
    public function getBankDetails()
    {
        return response()->json([
            'bank_name' => Setting::get('bank_name', 'Not Set'),
            'account_name' => Setting::get('account_name', 'Not Set'),
            'account_number' => Setting::get('bank_account_number', '0123456789'),
        ]);
    }

    // Admin Action: Update Bank Details
    public function updateBankDetails(Request $request)
    {
        $request->validate([
            'bank_name' => 'required|string|max:100',
            'account_name' => 'required|string|max:100',
            'account_number' => 'required|string|max:50',
            'support_whatsapp' => 'nullable|string|max:20',
        ]);
        
        Setting::set('bank_name', $request->bank_name);
        Setting::set('account_name', $request->account_name);
        Setting::set('bank_account_number', $request->account_number);
        Setting::set('support_whatsapp', $request->support_whatsapp);

        return redirect()->back()->with('message', 'Platform settings updated successfully.');
    }

    // Admin UI: Edit Bank Details Page
    public function editBankDetails()
    {
        return Inertia::render('Admin/BankSettings', [
            'bankName' => Setting::get('bank_name', ''),
            'accountName' => Setting::get('account_name', ''),
            'accountNumber' => Setting::get('bank_account_number', ''),
            'supportWhatsapp' => Setting::get('support_whatsapp', ''),
        ]);
    }

}
