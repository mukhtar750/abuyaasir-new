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
        Schema::table('users', function (Blueprint $table) {
            $table->text('bio')->after('password')->nullable();
            $table->string('specialty')->after('bio')->nullable();
            $table->boolean('is_active')->after('streak_days')->default(true);
            $table->boolean('is_approved')->after('is_active')->default(false);
            $table->decimal('hourly_rate', 10, 2)->after('is_approved')->nullable();
            $table->decimal('balance', 15, 2)->after('hourly_rate')->default(0.00);
            $table->timestamp('last_active_at')->after('balance')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bio', 'specialty', 'is_active', 'is_approved', 'hourly_rate', 'last_active_at']);
        });
    }
};
