<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ClassNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $messageTitle;
    public $messageBody;
    public $actionUrl;

    /**
     * Create a new notification instance.
     */
    public function __construct($title, $body, $actionUrl = null)
    {
        $this->messageTitle = $title;
        $this->messageBody = $body;
        $this->actionUrl = $actionUrl;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
                    ->subject($this->messageTitle)
                    ->line($this->messageBody);
                    
        if ($this->actionUrl) {
            $mail->action('View Session', $this->actionUrl);
        }

        return $mail->line('Thank you for using MyTutorPlus!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->messageTitle,
            'body' => $this->messageBody,
            'action_url' => $this->actionUrl,
        ];
    }
}
