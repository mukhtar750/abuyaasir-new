<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CbtQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'cbt_exam_id',
        'question_text',
        'options',
        'correct_option',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function cbtExam()
    {
        return $this->belongsTo(CbtExam::class);
    }
}
