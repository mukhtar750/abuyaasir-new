<?php

use App\Http\Controllers\LiveSessionController;
use App\Http\Controllers\ManualPaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\TutorDashboardController;
use App\Http\Controllers\CbtController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CbtQuestionController;
use App\Http\Controllers\AssignmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

// 1. Landing Page
Route::get('/', function () {
    $campaigns = Schema::hasTable('campaigns')
        ? \App\Models\Campaign::where('is_active', true)->get()
        : collect();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'campaigns' => $campaigns,
    ]);
});

Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');

// 2. Developer/Maintenance Bypass Route
Route::get('/dev-bypass', function (\Illuminate\Http\Request $request) {
    if ($request->query('secret') === '100k-secret') {
        session(['dev_bypass' => true]);
        return redirect('/')->with('message', 'Developer mode bypass activated successfully.');
    }
    return response('Bypass token invalid.', 401);
});

// 3. Authenticated Core Routes
Route::middleware(['auth', 'verified'])->group(function () {
    
    // --- Profile Management ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- Notifications ---
    Route::post('/notifications/mark-read', function (\Illuminate\Http\Request $request) {
        $request->user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.markRead');

    // --- Live Sessions ---
    Route::get('/sessions', [LiveSessionController::class, 'index'])->name('sessions.index');
    Route::post('/sessions', [LiveSessionController::class, 'store'])->name('sessions.store');
    Route::put('/sessions/{session}', [LiveSessionController::class, 'update'])->name('sessions.update');
    Route::delete('/sessions/{session}', [LiveSessionController::class, 'destroy'])->name('sessions.destroy');
    Route::post('/sessions/{session}/attendance', [LiveSessionController::class, 'submitAttendance'])->name('sessions.attendance');
    Route::post('/sessions/{session}/attendance/unlock', [LiveSessionController::class, 'unlockAttendance'])->name('sessions.attendance.unlock');
    Route::post('/sessions/{session}/recording', [LiveSessionController::class, 'uploadRecording'])->name('sessions.recording');
    Route::get('/sessions/{session}/join', [LiveSessionController::class, 'join'])->name('sessions.join');

    // --- Student Dashboard ---
    Route::middleware('role:student')->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::post('/courses/{course}/enroll', [StudentDashboardController::class, 'enrollSelf'])->name('student.course.enroll');

        // --- Learning Hub ---
        Route::get('/courses/{course}/learn', [CourseController::class, 'learn'])->name('courses.learn');
        Route::post('/courses/{course}/lessons/{lesson}/complete', [CourseController::class, 'completeLesson'])->name('courses.completeLesson');

        // --- Assignments ---
        Route::get('/assignments/{assignment}/submit', [AssignmentController::class, 'showSubmit'])->name('student.assignments.submit');
        Route::post('/assignments/{assignment}/submit', [AssignmentController::class, 'submit'])->name('student.assignments.store');

        // --- CBT Exam taking ---
        Route::get('/cbt/{exam}/take', [CbtController::class, 'takeExam'])->name('cbt.take');
        Route::post('/cbt/{exam}/submit', [CbtController::class, 'submitExam'])->name('cbt.submit');
        Route::get('/cbt/results/{result}/pdf', [CbtController::class, 'downloadPdf'])->name('cbt.result.pdf');

        // --- Manual Payment ---
        Route::post('/payment/upload-receipt', [ManualPaymentController::class, 'submitReceipt'])->name('payment.upload-receipt');
    });

    // --- Tutor Operations ---
    Route::prefix('tutor')->middleware(['role:tutor', 'approved_tutor', \App\Http\Middleware\CheckMaintenanceMode::class])->group(function () {
        Route::get('/dashboard', [TutorDashboardController::class, 'index'])->name('tutor.dashboard');
        Route::post('/courses', [TutorDashboardController::class, 'createCourse'])->name('tutor.course.create');
        Route::post('/lessons', [TutorDashboardController::class, 'createLesson'])->name('tutor.lesson.create');
        
        // --- Assignments & Questions ---
        Route::get('/assignments', [AssignmentController::class, 'index'])->name('tutor.assignments.index');
        Route::post('/assignments', [AssignmentController::class, 'store'])->name('tutor.assignments.store');
        Route::post('/assignments/submissions/{submission}/grade', [AssignmentController::class, 'grade'])->name('tutor.assignments.grade');
        
        Route::get('/cbt-exams/{exam}/questions', [CbtQuestionController::class, 'index'])->name('tutor.cbt.questions.index');
        Route::post('/cbt-exams/{exam}/questions', [CbtQuestionController::class, 'store'])->name('tutor.cbt.questions.store');
        Route::post('/cbt-exams/{exam}/questions/import', [CbtQuestionController::class, 'import'])->name('tutor.cbt.questions.import');
    });

    // --- Admin Operations ---
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::post('/subjects', [AdminDashboardController::class, 'createSubject'])->name('admin.subject.create');
        Route::post('/assign-tutor', [AdminDashboardController::class, 'assignTutor'])->name('admin.tutor.assign');
        Route::post('/enroll', [AdminDashboardController::class, 'enrollStudent'])->name('admin.student.enroll');
        Route::post('/campaigns', [AdminDashboardController::class, 'saveCampaign'])->name('admin.campaign.save');
        Route::post('/maintenance', [AdminDashboardController::class, 'toggleMaintenance'])->name('admin.maintenance.toggle');
        Route::post('/users/{user}/role', [AdminDashboardController::class, 'updateUserRole'])->name('admin.user.role');
        Route::post('/users/{user}/password', [AdminDashboardController::class, 'resetUserPassword'])->name('admin.user.password');
        Route::delete('/users/{user}', [AdminDashboardController::class, 'deleteUser'])->name('admin.user.delete');
        Route::delete('/subjects/{subject}', [AdminDashboardController::class, 'deleteSubject'])->name('admin.subject.delete');
        Route::post('/campaigns/{campaign}/toggle', [AdminDashboardController::class, 'toggleCampaignStatus'])->name('admin.campaign.toggle');
        Route::delete('/campaigns/{campaign}', [AdminDashboardController::class, 'deleteCampaign'])->name('admin.campaign.delete');

        // --- CBT Questions Management ---
        Route::get('/cbt-exams/{exam}/questions', [CbtQuestionController::class, 'index'])->name('admin.cbt.questions.index');
        Route::post('/cbt-exams/{exam}/questions', [CbtQuestionController::class, 'store'])->name('admin.cbt.questions.store');
        Route::post('/cbt-exams/{exam}/questions/import', [CbtQuestionController::class, 'import'])->name('admin.cbt.questions.import');

        // --- Payment Management ---
        Route::post('/payments/{transaction}/approve', [ManualPaymentController::class, 'approve'])->name('admin.payments.approve');
        Route::post('/payments/{transaction}/reject', [ManualPaymentController::class, 'reject'])->name('admin.payments.reject');
        
        // --- Tutor & Course Approvals ---
        Route::post('/tutors/{user}/approve', [AdminDashboardController::class, 'approveTutor'])->name('admin.tutors.approve');
        Route::post('/tutors/{user}/reject', [AdminDashboardController::class, 'rejectTutor'])->name('admin.tutors.reject');
        Route::post('/courses/{course}/approve', [AdminDashboardController::class, 'approveCourse'])->name('admin.courses.approve');
        Route::post('/courses/{course}/reject', [AdminDashboardController::class, 'rejectCourse'])->name('admin.courses.reject');

        // Bank Details Management
        Route::get('/settings/bank', [AdminDashboardController::class, 'editBankDetails'])->name('admin.settings.bank');
        Route::post('/settings/bank', [AdminDashboardController::class, 'updateBankDetails'])->name('admin.settings.bank.update');
});
});

require __DIR__.'/auth.php';

Route::get('/logout', function () {
    \Illuminate\Support\Facades\Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout.get');
