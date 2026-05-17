<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CbtResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'cbt_exam_id',
        'score',
        'time_spent_seconds',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function cbtExam()
    {
        return $this->belongsTo(CbtExam::class);
    }
}
