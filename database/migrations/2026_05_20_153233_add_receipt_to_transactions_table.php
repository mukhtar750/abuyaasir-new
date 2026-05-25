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
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('proof_of_payment')->after('reference')->nullable();
            $table->foreignId('course_id')->after('user_id')->nullable()->constrained()->onDelete('set null');
            $table->text('admin_note')->after('metadata')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->dropColumn(['proof_of_payment', 'course_id', 'admin_note']);
        });
    }
};
