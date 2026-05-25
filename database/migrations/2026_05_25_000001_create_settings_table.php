<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateSettingsTable extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->text('value');
                $table->timestamps();
            });
        }

        if (!DB::table('settings')->where('key', 'bank_account_number')->exists()) {
            DB::table('settings')->insert([
                'key' => 'bank_account_number',
                'value' => '0123456789',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down()
    {
        Schema::dropIfExists('settings');
    }
}
?>
