<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\LiveSession;
use App\Mail\LiveSessionReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendSessionReminders extends Command
{
    /**
     * The name and signature of the console command.
     * This is what you run manually: php artisan sessions:remind
     */
    protected $signature = 'sessions:remind';

    /**
     * The console command description.
     */
    protected $description = 'Send email reminders to students for live sessions starting in ~1 hour';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();

        // Find all sessions scheduled between 55 and 65 minutes from now (1-hour window)
        $sessions = LiveSession::with(['student', 'tutor'])
            ->where('status', 'scheduled')
            ->whereBetween('scheduled_at', [
                $now->copy()->addMinutes(55),
                $now->copy()->addMinutes(65),
            ])
            ->get();

        if ($sessions->isEmpty()) {
            $this->info('No upcoming sessions found in the 1-hour window.');
            return;
        }

        foreach ($sessions as $session) {
            if ($session->student && $session->student->email) {
                Mail::to($session->student->email)
                    ->send(new LiveSessionReminderMail($session));

                $this->info("Reminder sent to: {$session->student->email} for session: {$session->topic}");
            }
        }

        $this->info("Done. {$sessions->count()} reminder(s) sent.");
    }
}
