<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveSession extends Model
{
    protected $fillable = [
        'tutor_id',
        'student_id',
        'topic',
        'scheduled_at',
        'duration_minutes',
        'status',
        'meeting_link',
        'platform',
        'webrtc_room_id',
        'notes',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
