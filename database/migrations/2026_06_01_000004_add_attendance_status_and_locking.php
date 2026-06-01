<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->string('status')->default('absent')->after('is_present');
        });

        DB::table('attendances')
            ->where('is_present', true)
            ->update(['status' => 'present']);

        DB::table('attendances')
            ->where('is_present', false)
            ->update(['status' => 'absent']);

        Schema::table('live_sessions', function (Blueprint $table) {
            $table->boolean('attendance_locked')->default(false)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('live_sessions', function (Blueprint $table) {
            $table->dropColumn('attendance_locked');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
