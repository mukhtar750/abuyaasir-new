<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'points',
        'streak_days',
        'bio',
        'specialty',
        'is_active',
        'is_approved',
        'hourly_rate',
        'balance',
        'last_active_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Role Checkers
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTutor(): bool
    {
        return $this->role === 'tutor';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    // Relationships
    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'subject_tutor', 'tutor_id', 'subject_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'enrollments', 'student_id', 'course_id')
                    ->withPivot('enrolled_by_admin', 'progress_percent', 'completed_at')
                    ->withTimestamps();
    }

    public function cbtResults()
    {
        return $this->hasMany(CbtResult::class, 'student_id');
    }

    public function tutorSessions()
    {
        return $this->hasMany(LiveSession::class, 'tutor_id');
    }

    public function studentSessions()
    {
        return $this->hasMany(LiveSession::class, 'student_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
