<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_only_access_student_area(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $this->actingAs($student)->get('/dashboard')->assertOk();
        $this->actingAs($student)->get('/admin/dashboard')->assertForbidden();
        $this->actingAs($student)->get('/tutor/dashboard')->assertForbidden();
    }

    public function test_tutor_can_only_access_tutor_area(): void
    {
        $tutor = User::factory()->create(['role' => 'tutor']);

        $this->actingAs($tutor)->get('/tutor/dashboard')->assertOk();
        $this->actingAs($tutor)->get('/dashboard')->assertForbidden();
        $this->actingAs($tutor)->get('/admin/dashboard')->assertForbidden();
    }

    public function test_admin_can_only_access_admin_area(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get('/admin/dashboard')->assertOk();
        $this->actingAs($admin)->get('/dashboard')->assertForbidden();
        $this->actingAs($admin)->get('/tutor/dashboard')->assertForbidden();
    }

    public function test_login_redirects_users_to_their_role_home(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin-role@example.com',
            'role' => 'admin',
        ]);
        $tutor = User::factory()->create([
            'email' => 'tutor-role@example.com',
            'role' => 'tutor',
        ]);
        $student = User::factory()->create([
            'email' => 'student-role@example.com',
            'role' => 'student',
        ]);

        $this->post('/login', ['email' => $admin->email, 'password' => 'password'])
            ->assertRedirect(route('admin.dashboard', absolute: false));
        $this->post('/logout');

        $this->post('/login', ['email' => $tutor->email, 'password' => 'password'])
            ->assertRedirect(route('tutor.dashboard', absolute: false));
        $this->post('/logout');

        $this->post('/login', ['email' => $student->email, 'password' => 'password'])
            ->assertRedirect(route('dashboard', absolute: false));
    }
}
