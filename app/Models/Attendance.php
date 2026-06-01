<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'live_session_id',
        'student_id',
        'is_present',
        'status',
        'xp_awarded',
        'notes',
    ];

    protected $casts = [
        'xp_awarded' => 'integer',
    ];

    public function getIsPresentAttribute($value): bool
    {
        if (array_key_exists('status', $this->attributes)) {
            return in_array($this->attributes['status'], ['present', 'late'], true);
        }

        return (bool) $value;
    }

    public function setIsPresentAttribute($value): void
    {
        $this->attributes['is_present'] = (bool) $value;

        if (!array_key_exists('status', $this->attributes)) {
            $this->attributes['status'] = $value ? 'present' : 'absent';
        }
    }

    public function setStatusAttribute($value): void
    {
        $this->attributes['status'] = $value;
        $this->attributes['is_present'] = in_array($value, ['present', 'late'], true);
    }

    public function liveSession()
    {
        return $this->belongsTo(LiveSession::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
