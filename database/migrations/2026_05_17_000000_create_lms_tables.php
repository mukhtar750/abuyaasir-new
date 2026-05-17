<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Subjects (Math, Physics, Chemistry, etc.)
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->timestamps();
        });

        // 2. Courses (Assigned to a subject, can be JAMB, WAEC, Summer, Standard)
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('Standard'); // JAMB, WAEC, Summer, Standard
            $table->decimal('price', 10, 2)->default(0.00);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        // 3. Subject-Tutor Mapping (Admin assigns Tutors to Subjects)
        Schema::create('subject_tutor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // 4. Enrollments (Can be by Admin, or self-enrolled)
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->boolean('enrolled_by_admin')->default(false);
            $table->integer('progress_percent')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // 5. Lessons (Videos and learning content)
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('video_url')->nullable();
            $table->longText('content')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 6. CBT Exams (Computer Based Tests for JAMB/WAEC prep)
        Schema::create('cbt_exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->integer('duration_minutes')->default(45);
            $table->integer('total_marks')->default(100);
            $table->timestamps();
        });

        // 7. CBT Questions (Multiple choice options in JSON, correct option: A, B, C, D)
        Schema::create('cbt_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cbt_exam_id')->constrained()->onDelete('cascade');
            $table->text('question_text');
            $table->json('options'); // e.g. {"A": "Option A text", "B": "Option B text"...}
            $table->string('correct_option', 1); // 'A', 'B', 'C', 'D'
            $table->timestamps();
        });

        // 8. CBT Results (CBT scores & statistics)
        Schema::create('cbt_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('cbt_exam_id')->constrained()->onDelete('cascade');
            $table->integer('score');
            $table->integer('time_spent_seconds');
            $table->timestamps();
        });

        // 9. Campaigns / Ad Engine (Ad banners on Dashboard & Landing page)
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type')->default('General'); // JAMB, WAEC, Summer, General
            $table->string('image_url')->nullable();
            $table->string('link')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 10. Platform Settings (e.g. toggle Developer/Maintenance mode)
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('cbt_results');
        Schema::dropIfExists('cbt_questions');
        Schema::dropIfExists('cbt_exams');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('subject_tutor');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('subjects');
    }
};
