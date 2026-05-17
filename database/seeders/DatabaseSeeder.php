<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Core Users
        $admin = User::create([
            'name' => 'Dr. Abu Yaasir',
            'email' => 'admin@mytutor.plus',
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);

        $tutor = User::create([
            'name' => 'Professor Umar',
            'email' => 'tutor@mytutor.plus',
            'role' => 'tutor',
            'password' => bcrypt('password'),
        ]);

        $student = User::create([
            'name' => 'Adebayo Tunde',
            'email' => 'student@mytutor.plus',
            'role' => 'student',
            'points' => 120,
            'streak_days' => 5,
            'password' => bcrypt('password'),
        ]);

        // 2. Create Core Science Subjects
        $maths = \App\Models\Subject::create([
            'name' => 'Mathematics',
            'description' => 'Algebra, Trigonometry, Calculus, and Quantitative Reasoning.',
        ]);

        $physics = \App\Models\Subject::create([
            'name' => 'Physics',
            'description' => 'Classical Mechanics, Electromagnetism, Optics, and Modern Physics.',
        ]);

        $chemistry = \App\Models\Subject::create([
            'name' => 'Chemistry',
            'description' => 'Organic, Inorganic, and Physical chemistry concepts and labs.',
        ]);

        // 3. Map Tutor to Subjects
        $maths->tutors()->attach($tutor->id);
        $physics->tutors()->attach($tutor->id);

        // 4. Create Custom Specialized Courses
        $mathCourse = \App\Models\Course::create([
            'subject_id' => $maths->id,
            'title' => 'JAMB 2026 Intensive Math Prep',
            'description' => 'Deep dive into standard JAMB math syllabus covering quadratic equations, probability, matrices, and integrations.',
            'type' => 'JAMB',
            'price' => 15000.00,
            'is_published' => true,
        ]);

        $physicsCourse = \App\Models\Course::create([
            'subject_id' => $physics->id,
            'title' => 'WAEC Physics Secrets & Practicals',
            'description' => 'Master physics practical setups, lens equations, electricity circuits, and score an A1 easily.',
            'type' => 'WAEC',
            'price' => 12000.00,
            'is_published' => true,
        ]);

        $summerBootcamp = \App\Models\Course::create([
            'subject_id' => $chemistry->id,
            'title' => 'Chemistry Accelerated Summer Bootcamp',
            'description' => 'Get a head start on organic compounds, stoichiometry calculations, and periodic properties before high school starts.',
            'type' => 'Summer',
            'price' => 20000.00,
            'is_published' => true,
        ]);

        // 5. Enroll Student to Courses
        \App\Models\Enrollment::create([
            'student_id' => $student->id,
            'course_id' => $mathCourse->id,
            'enrolled_by_admin' => true,
            'progress_percent' => 35,
        ]);

        // 6. Create CBT Timed Mock Exam
        $cbt = \App\Models\CbtExam::create([
            'course_id' => $mathCourse->id,
            'title' => 'JAMB Math Diagnostic Mock Exam',
            'duration_minutes' => 10,
            'total_marks' => 30,
        ]);

        // 7. Add multiple choice questions to CBT Exam
        \App\Models\CbtQuestion::create([
            'cbt_exam_id' => $cbt->id,
            'question_text' => 'Evaluate log_2(32) - log_3(27)',
            'options' => [
                'A' => '1',
                'B' => '2',
                'C' => '3',
                'D' => '5'
            ],
            'correct_option' => 'B' // 5 - 3 = 2
        ]);

        \App\Models\CbtQuestion::create([
            'cbt_exam_id' => $cbt->id,
            'question_text' => 'Solve for x if 2x + 5 = 15.',
            'options' => [
                'A' => '2',
                'B' => '4',
                'C' => '5',
                'D' => '10'
            ],
            'correct_option' => 'C'
        ]);

        \App\Models\CbtQuestion::create([
            'cbt_exam_id' => $cbt->id,
            'question_text' => 'What is the derivative of x^3 with respect to x?',
            'options' => [
                'A' => 'x^2',
                'B' => '3x',
                'C' => '3x^2',
                'D' => '2x^3'
            ],
            'correct_option' => 'C'
        ]);

        // 8. Create Promoted Marketing Campaigns / Ads
        \App\Models\Campaign::create([
            'title' => 'Register for the Chemistry Accelerated Summer Bootcamp!',
            'type' => 'Summer',
            'link' => '/dashboard',
            'is_active' => true,
        ]);

        \App\Models\Campaign::create([
            'title' => 'Ace your exams with the JAMB 2026 High-Score Drill!',
            'type' => 'JAMB',
            'link' => '/dashboard',
            'is_active' => true,
        ]);

        // 9. Set Maintenance Mode Settings record
        \App\Models\Setting::set('maintenance_mode', 'false');
    }
}
