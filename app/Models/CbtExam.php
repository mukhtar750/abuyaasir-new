<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CbtExam extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'duration_minutes',
        'total_marks',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function questions()
    {
        return $this->hasMany(CbtQuestion::class);
    }

    public function results()
    {
        return $this->hasMany(CbtResult::class);
    }
}
