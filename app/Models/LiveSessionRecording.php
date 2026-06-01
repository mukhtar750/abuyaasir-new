<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveSessionRecording extends Model
{
    protected $fillable = [
        'live_session_id',
        'recording_url',
        'password',
        'duration_minutes',
        'notes',
    ];

    public function liveSession()
    {
        return $this->belongsTo(LiveSession::class);
    }
}
