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
Route::get('/courses/{id}', [CourseController::class, 'show'])->name('courses.show');

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

    // --- Student Dashboard ---
    Route::middleware('role:student')->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::post('/courses/{id}/enroll', [StudentDashboardController::class, 'enrollSelf'])->name('student.course.enroll');

        // --- Learning Hub ---
        Route::get('/courses/{id}/learn', [CourseController::class, 'learn'])->name('courses.learn');
        Route::post('/courses/{id}/lessons/{lesson_id}/complete', [CourseController::class, 'completeLesson'])->name('courses.completeLesson');

        // --- Assignments ---
        Route::get('/assignments/{id}/submit', [AssignmentController::class, 'showSubmit'])->name('student.assignments.show');
        Route::post('/assignments/{id}/submit', [AssignmentController::class, 'submit'])->name('student.assignments.submit');

        // --- CBT Exam taking ---
        Route::get('/cbt/{id}/take', [CbtController::class, 'takeExam'])->name('cbt.take');
        Route::post('/cbt/{id}/submit', [CbtController::class, 'submitExam'])->name('cbt.submit');
        Route::get('/cbt/results/{id}/pdf', [CbtController::class, 'downloadPdf'])->name('cbt.result.pdf');

        // --- Live Sessions ---
        Route::get('/sessions', [LiveSessionController::class, 'index'])->name('sessions.index');
        Route::post('/sessions', [LiveSessionController::class, 'store'])->name('sessions.store');
        Route::get('/sessions/{session}/join', [LiveSessionController::class, 'join'])->name('sessions.join');

        // --- Manual Payment ---
        Route::post('/payment/upload-receipt', [ManualPaymentController::class, 'submitReceipt'])->name('payment.upload-receipt');
    });

    // --- Tutor Operations ---
    Route::prefix('tutor')->middleware(['role:tutor', \App\Http\Middleware\CheckMaintenanceMode::class])->group(function () {
        Route::get('/dashboard', [TutorDashboardController::class, 'index'])->name('tutor.dashboard');
        Route::post('/courses', [TutorDashboardController::class, 'createCourse'])->name('tutor.course.create');
        Route::post('/lessons', [TutorDashboardController::class, 'createLesson'])->name('tutor.lesson.create');
        
        // --- Assignments & Questions ---
        Route::get('/assignments', [AssignmentController::class, 'index'])->name('tutor.assignments.index');
        Route::post('/assignments', [AssignmentController::class, 'store'])->name('tutor.assignments.store');
        Route::post('/assignments/submissions/{id}/grade', [AssignmentController::class, 'grade'])->name('tutor.assignments.grade');
        
        Route::get('/cbt-exams/{examId}/questions', [CbtQuestionController::class, 'index'])->name('tutor.cbt.questions.index');
        Route::post('/cbt-exams/{examId}/questions', [CbtQuestionController::class, 'store'])->name('tutor.cbt.questions.store');
        Route::post('/cbt-exams/{examId}/questions/import', [CbtQuestionController::class, 'import'])->name('tutor.cbt.questions.import');
    });

    // --- Admin Operations ---
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::post('/subjects', [AdminDashboardController::class, 'createSubject'])->name('admin.subject.create');
        Route::post('/assign-tutor', [AdminDashboardController::class, 'assignTutor'])->name('admin.tutor.assign');
        Route::post('/enroll', [AdminDashboardController::class, 'enrollStudent'])->name('admin.student.enroll');
        Route::post('/campaigns', [AdminDashboardController::class, 'saveCampaign'])->name('admin.campaign.save');
        Route::post('/maintenance', [AdminDashboardController::class, 'toggleMaintenance'])->name('admin.maintenance.toggle');
        Route::post('/users/{id}/role', [AdminDashboardController::class, 'updateUserRole'])->name('admin.user.role');
        Route::post('/users/{id}/password', [AdminDashboardController::class, 'resetUserPassword'])->name('admin.user.password');
        Route::delete('/users/{id}', [AdminDashboardController::class, 'deleteUser'])->name('admin.user.delete');
        Route::delete('/subjects/{id}', [AdminDashboardController::class, 'deleteSubject'])->name('admin.subject.delete');
        Route::post('/campaigns/{id}/toggle', [AdminDashboardController::class, 'toggleCampaignStatus'])->name('admin.campaign.toggle');
        Route::delete('/campaigns/{id}', [AdminDashboardController::class, 'deleteCampaign'])->name('admin.campaign.delete');

        // --- CBT Questions Management ---
        Route::get('/cbt-exams/{examId}/questions', [CbtQuestionController::class, 'index'])->name('admin.cbt.questions.index');
        Route::post('/cbt-exams/{examId}/questions', [CbtQuestionController::class, 'store'])->name('admin.cbt.questions.store');
        Route::post('/cbt-exams/{examId}/questions/import', [CbtQuestionController::class, 'import'])->name('admin.cbt.questions.import');

        // --- Payment Management ---
        Route::post('/payments/{transaction}/approve', [ManualPaymentController::class, 'approve'])->name('admin.payments.approve');
        Route::get('/settings/bank/edit', [AdminDashboardController::class, 'editBankDetails'])->name('admin.settings.bank.edit');
        // Bank Details Management
        Route::get('/settings/bank', [AdminDashboardController::class, 'getBankDetails'])->name('admin.settings.bank.get');
        Route::post('/settings/bank', [AdminDashboardController::class, 'updateBankDetails'])->name('admin.settings.bank.update');
});
});

require __DIR__.'/auth.php';

Route::get('/logout', function () {
    auth()->logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout.get');
