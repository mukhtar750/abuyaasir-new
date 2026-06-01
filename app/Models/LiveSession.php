<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveSession extends Model
{
    protected $appends = [
        'end_time',
        'computed_status',
    ];

    protected $fillable = [
        'tutor_id',
        'course_id',
        'student_id',
        'topic',
        'scheduled_at',
        'duration_minutes',
        'status',
        'attendance_locked',
        'meeting_link',
        'platform',
        'webrtc_room_id',
        'notes',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'attendance_locked' => 'boolean',
    ];

    public function getEndTimeAttribute()
    {
        return $this->scheduled_at?->copy()->addMinutes($this->duration_minutes ?? 60);
    }

    public function getComputedStatusAttribute(): string
    {
        if ($this->status === 'cancelled') {
            return 'cancelled';
        }

        if ($this->status === 'completed') {
            return 'completed';
        }

        if (!$this->scheduled_at) {
            return $this->status ?? 'scheduled';
        }

        $now = now();

        if ($now->lt($this->scheduled_at)) {
            return $now->diffInMinutes($this->scheduled_at) <= 15
                ? 'starting_soon'
                : 'upcoming';
        }

        if ($this->end_time && $now->lte($this->end_time)) {
            return 'live_now';
        }

        return 'ended';
    }

    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function recordings()
    {
        return $this->hasMany(LiveSessionRecording::class);
    }
}
