<?php

namespace App\Mail;

use App\Models\Assignment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AssignmentPostedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $assignment;
    public $student;

    /**
     * Create a new message instance.
     */
    public function __construct(Assignment $assignment, User $student)
    {
        $this->assignment = $assignment;
        $this->student = $student;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Assignment Posted: ' . $this->assignment->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.assignment_posted',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
