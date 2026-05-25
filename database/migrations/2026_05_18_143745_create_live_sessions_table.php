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
        Schema::create('live_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->string('topic');
            $table->dateTime('scheduled_at');
            $table->integer('duration_minutes')->default(60);
            $table->string('status')->default('scheduled'); // scheduled, ongoing, completed, cancelled
            $table->string('meeting_link')->nullable();
            $table->string('platform')->default('google_meet'); // google_meet, zoom, webrtc
            $table->string('webrtc_room_id')->nullable(); // for future built-in webrtc
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_sessions');
    }
};
