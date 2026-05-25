<?php

namespace App\Mail;

use App\Models\LiveSession;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LiveSessionReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $session;

    public function __construct(LiveSession $session)
    {
        $this->session = $session;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '⏰ Reminder: Your Live Class Starts in 1 Hour – ' . $this->session->topic,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.live_session_reminder',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
