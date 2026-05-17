<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'cover_image'];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function tutors()
    {
        return $this->belongsToMany(User::class, 'subject_tutor', 'subject_id', 'tutor_id');
    }
}
