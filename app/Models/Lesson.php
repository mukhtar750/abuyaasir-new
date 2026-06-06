<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'video_url',
        'content',
        'order_index',
        'resources',
    ];

    protected $casts = [
        'resources' => 'array',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
