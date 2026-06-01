<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\LiveSession;
use App\Models\Subject;
use App\Models\Course;
use App\Models\Enrollment;
use Carbon\Carbon;

class LiveSessionTest extends TestCase
{
    use RefreshDatabase;

    protected $tutor;
    protected $student;
    protected $subject;
    protected $course;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->tutor = User::factory()->create(['role' => 'tutor']);
        $this->student = User::factory()->create(['role' => 'student']);
        
        $this->subject = Subject::create(['name' => 'Test Subject']);
        $this->course = Course::create([
            'subject_id' => $this->subject->id,
            'title' => 'Test Course',
            'type' => 'Standard',
            'price' => 1000,
            'is_published' => true,
        ]);

        $this->subject->tutors()->attach($this->tutor->id);
    }

    public function test_tutor_can_create_live_session()
    {
        $response = $this->actingAs($this->tutor)->post('/sessions', [
            'course_id' => $this->course->id,
            'topic' => 'Intro to Testing',
            'scheduled_at' => now()->addDays(1)->format('Y-m-d\TH:i'),
            'duration_minutes' => 60,
            'platform' => 'google_meet',
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('live_sessions', [
            'topic' => 'Intro to Testing',
            'tutor_id' => $this->tutor->id,
            'course_id' => $this->course->id,
            'status' => 'scheduled',
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
        ]);
    }

    public function test_student_cannot_request_live_session()
    {
        $response = $this->actingAs($this->student)->post('/sessions', [
            'tutor_id' => $this->tutor->id,
            'topic' => 'Need Help with Math',
            'scheduled_at' => now()->addDays(2)->format('Y-m-d\TH:i'),
            'duration_minutes' => 30,
            'platform' => 'google_meet',
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
        ]);

        $response->assertStatus(403);
    }

    public function test_tutor_can_update_live_session()
    {
        $session = LiveSession::create([
            'tutor_id' => $this->tutor->id,
            'topic' => 'Old Topic',
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
            'platform' => 'google_meet',
            'status' => 'scheduled',
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
        ]);

        $response = $this->actingAs($this->tutor)->put("/sessions/{$session->id}", [
            'topic' => 'New Updated Topic',
            'scheduled_at' => now()->addDays(2)->format('Y-m-d\TH:i'),
            'duration_minutes' => 90,
            'status' => 'scheduled',
            'meeting_link' => 'https://meet.google.com/xyz-pqrs-tuv',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('live_sessions', [
            'id' => $session->id,
            'topic' => 'New Updated Topic',
            'duration_minutes' => 90,
            'meeting_link' => 'https://meet.google.com/xyz-pqrs-tuv',
        ]);
    }

    public function test_tutor_can_mark_attendance()
    {
        $session = LiveSession::create([
            'tutor_id' => $this->tutor->id,
            'topic' => 'Attendance Test',
            'scheduled_at' => now()->subDay(),
            'duration_minutes' => 60,
            'platform' => 'google_meet',
            'status' => 'live', // tutor will complete it
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
        ]);

        $initialPoints = $this->student->points;

        $response = $this->actingAs($this->tutor)->post("/sessions/{$session->id}/attendance", [
            'attendances' => [
                [
                    'student_id' => $this->student->id,
                    'is_present' => true,
                    'notes' => 'Good participation'
                ]
            ]
        ]);

        $response->assertStatus(302);
        
        $this->assertDatabaseHas('live_sessions', [
            'id' => $session->id,
            'status' => 'completed'
        ]);

        $this->assertDatabaseHas('attendances', [
            'live_session_id' => $session->id,
            'student_id' => $this->student->id,
            'is_present' => true,
            'status' => 'present',
            'xp_awarded' => 5,
        ]);

        $this->assertEquals($initialPoints + 5, $this->student->fresh()->points);
        $this->assertTrue($session->fresh()->attendance_locked);
    }

    public function test_present_gives_five_xp_once()
    {
        $session = $this->createAttendanceSession();

        $this->submitAttendanceStatus($session, 'present')->assertStatus(302);
        $this->assertEquals(5, $this->student->fresh()->points);

        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin)->post("/sessions/{$session->id}/attendance", [
            'attendances' => [[
                'student_id' => $this->student->id,
                'status' => 'present',
            ]],
        ])->assertStatus(302);

        $this->assertEquals(5, $this->student->fresh()->points);
    }

    public function test_changing_present_to_absent_removes_xp()
    {
        $session = $this->createAttendanceSession();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->submitAttendanceStatus($session, 'present')->assertStatus(302);

        $this->actingAs($admin)->post("/sessions/{$session->id}/attendance", [
            'attendances' => [[
                'student_id' => $this->student->id,
                'status' => 'absent',
            ]],
        ])->assertStatus(302);

        $this->assertEquals(0, $this->student->fresh()->points);
        $this->assertDatabaseHas('attendances', [
            'live_session_id' => $session->id,
            'student_id' => $this->student->id,
            'status' => 'absent',
            'xp_awarded' => 0,
        ]);
    }

    public function test_changing_absent_to_present_readds_xp_correctly()
    {
        $session = $this->createAttendanceSession();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->submitAttendanceStatus($session, 'absent')->assertStatus(302);

        $this->actingAs($admin)->post("/sessions/{$session->id}/attendance", [
            'attendances' => [[
                'student_id' => $this->student->id,
                'status' => 'present',
            ]],
        ])->assertStatus(302);

        $this->assertEquals(5, $this->student->fresh()->points);
    }

    public function test_late_gives_two_xp()
    {
        $session = $this->createAttendanceSession();

        $this->submitAttendanceStatus($session, 'late')->assertStatus(302);

        $this->assertEquals(2, $this->student->fresh()->points);
        $this->assertDatabaseHas('attendances', [
            'live_session_id' => $session->id,
            'student_id' => $this->student->id,
            'is_present' => true,
            'status' => 'late',
            'xp_awarded' => 2,
        ]);
    }

    public function test_excused_gives_zero_xp()
    {
        $session = $this->createAttendanceSession();

        $this->submitAttendanceStatus($session, 'excused')->assertStatus(302);

        $this->assertEquals(0, $this->student->fresh()->points);
        $this->assertDatabaseHas('attendances', [
            'live_session_id' => $session->id,
            'student_id' => $this->student->id,
            'is_present' => false,
            'status' => 'excused',
            'xp_awarded' => 0,
        ]);
    }

    public function test_locked_attendance_prevents_tutor_updates()
    {
        $session = $this->createAttendanceSession();

        $this->submitAttendanceStatus($session, 'present')->assertStatus(302);

        $this->submitAttendanceStatus($session->fresh(), 'absent')->assertForbidden();

        $this->assertEquals(5, $this->student->fresh()->points);
    }

    public function test_admin_can_unlock_and_modify_attendance()
    {
        $session = $this->createAttendanceSession();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->submitAttendanceStatus($session, 'present')->assertStatus(302);

        $this->actingAs($admin)->post("/sessions/{$session->id}/attendance/unlock")
            ->assertStatus(302);

        $this->assertFalse($session->fresh()->attendance_locked);

        $this->actingAs($admin)->post("/sessions/{$session->id}/attendance", [
            'attendances' => [[
                'student_id' => $this->student->id,
                'status' => 'late',
            ]],
        ])->assertStatus(302);

        $this->assertEquals(2, $this->student->fresh()->points);
        $this->assertDatabaseHas('attendances', [
            'live_session_id' => $session->id,
            'student_id' => $this->student->id,
            'status' => 'late',
            'xp_awarded' => 2,
        ]);
    }

    public function test_live_session_exposes_end_time_and_computed_status()
    {
        Carbon::setTestNow(Carbon::parse('2026-06-01 10:00:00'));

        $session = LiveSession::create([
            'tutor_id' => $this->tutor->id,
            'course_id' => $this->course->id,
            'topic' => 'Accessor Test',
            'scheduled_at' => Carbon::parse('2026-06-01 10:10:00'),
            'duration_minutes' => 60,
            'platform' => 'google_meet',
            'status' => 'scheduled',
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
        ]);

        $this->assertTrue($session->end_time->equalTo(Carbon::parse('2026-06-01 11:10:00')));
        $this->assertSame('starting_soon', $session->computed_status);

        Carbon::setTestNow();
    }

    public function test_join_allows_admin_session_tutor_assigned_student_and_enrolled_students()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $assignedStudent = User::factory()->create(['role' => 'student']);
        $enrolledStudent = User::factory()->create(['role' => 'student']);

        Enrollment::create([
            'student_id' => $enrolledStudent->id,
            'course_id' => $this->course->id,
            'enrolled_by_admin' => true,
        ]);

        $session = LiveSession::create([
            'tutor_id' => $this->tutor->id,
            'student_id' => $assignedStudent->id,
            'course_id' => $this->course->id,
            'topic' => 'Authorized Join Test',
            'scheduled_at' => now()->addHour(),
            'duration_minutes' => 60,
            'platform' => 'google_meet',
            'status' => 'scheduled',
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
        ]);

        $this->actingAs($admin)->get("/sessions/{$session->id}/join")
            ->assertRedirect('https://meet.google.com/abc-defg-hij');

        $this->actingAs($this->tutor)->get("/sessions/{$session->id}/join")
            ->assertRedirect('https://meet.google.com/abc-defg-hij');

        $this->actingAs($assignedStudent)->get("/sessions/{$session->id}/join")
            ->assertRedirect('https://meet.google.com/abc-defg-hij');

        $this->actingAs($enrolledStudent)->get("/sessions/{$session->id}/join")
            ->assertRedirect('https://meet.google.com/abc-defg-hij');
    }

    public function test_join_blocks_unrelated_tutors_and_students()
    {
        $otherTutor = User::factory()->create(['role' => 'tutor']);
        $otherStudent = User::factory()->create(['role' => 'student']);

        $session = LiveSession::create([
            'tutor_id' => $this->tutor->id,
            'course_id' => $this->course->id,
            'topic' => 'Unauthorized Join Test',
            'scheduled_at' => now()->addHour(),
            'duration_minutes' => 60,
            'platform' => 'google_meet',
            'status' => 'scheduled',
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
        ]);

        $this->actingAs($otherTutor)->get("/sessions/{$session->id}/join")
            ->assertForbidden();

        $this->actingAs($otherStudent)->get("/sessions/{$session->id}/join")
            ->assertForbidden();
    }

    public function test_unrelated_tutor_cannot_update_live_session()
    {
        $otherTutor = User::factory()->create(['role' => 'tutor']);

        $session = LiveSession::create([
            'tutor_id' => $this->tutor->id,
            'topic' => 'Ownership Test',
            'scheduled_at' => now()->addDay(),
            'duration_minutes' => 60,
            'platform' => 'google_meet',
            'status' => 'scheduled',
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
        ]);

        $this->actingAs($otherTutor)->put("/sessions/{$session->id}", [
            'topic' => 'Unauthorized Update',
            'scheduled_at' => now()->addDays(2)->format('Y-m-d\TH:i'),
            'duration_minutes' => 60,
            'status' => 'scheduled',
            'meeting_link' => 'https://meet.google.com/xyz-pqrs-tuv',
        ])->assertForbidden();
    }

    private function createAttendanceSession(): LiveSession
    {
        return LiveSession::create([
            'tutor_id' => $this->tutor->id,
            'topic' => 'Attendance XP Test',
            'scheduled_at' => now()->subDay(),
            'duration_minutes' => 60,
            'platform' => 'google_meet',
            'status' => 'live',
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
        ]);
    }

    private function submitAttendanceStatus(LiveSession $session, string $status)
    {
        return $this->actingAs($this->tutor)->post("/sessions/{$session->id}/attendance", [
            'attendances' => [[
                'student_id' => $this->student->id,
                'status' => $status,
            ]],
        ]);
    }
}
