<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\TutorDashboardController;
use App\Http\Controllers\CbtController;
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

        // --- CBT Exam taking ---
        Route::get('/cbt/{id}/take', [CbtController::class, 'takeExam'])->name('cbt.take');
        Route::post('/cbt/{id}/submit', [CbtController::class, 'submitExam'])->name('cbt.submit');
        Route::get('/cbt/results/{id}/pdf', [CbtController::class, 'downloadPdf'])->name('cbt.result.pdf');
    });

    // --- Tutor Operations ---
    Route::prefix('tutor')->middleware(['role:tutor', \App\Http\Middleware\CheckMaintenanceMode::class])->group(function () {
        Route::get('/dashboard', [TutorDashboardController::class, 'index'])->name('tutor.dashboard');
        Route::post('/courses', [TutorDashboardController::class, 'createCourse'])->name('tutor.course.create');
        Route::post('/lessons', [TutorDashboardController::class, 'createLesson'])->name('tutor.lesson.create');
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
        Route::delete('/users/{id}', [AdminDashboardController::class, 'deleteUser'])->name('admin.user.delete');
        Route::delete('/subjects/{id}', [AdminDashboardController::class, 'deleteSubject'])->name('admin.subject.delete');
        Route::post('/campaigns/{id}/toggle', [AdminDashboardController::class, 'toggleCampaignStatus'])->name('admin.campaign.toggle');
        Route::delete('/campaigns/{id}', [AdminDashboardController::class, 'deleteCampaign'])->name('admin.campaign.delete');
    });
});

require __DIR__.'/auth.php';

Route::get('/logout', function () {
    auth()->logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout.get');
