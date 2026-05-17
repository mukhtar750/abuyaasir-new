<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Schema;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'value'];

    public static function get(string $key, $default = null)
    {
        if (! Schema::hasTable('settings')) {
            return $default;
        }

        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function set(string $key, $value): self
    {
        if (! Schema::hasTable('settings')) {
            throw new \RuntimeException('The settings table has not been migrated.');
        }

        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}
