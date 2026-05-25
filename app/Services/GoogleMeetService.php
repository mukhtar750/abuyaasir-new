<?php

namespace App\Services;

use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventDateTime;
use Google\Service\Calendar\ConferenceData;
use Google\Service\Calendar\CreateConferenceRequest;
use Google\Service\Calendar\ConferenceSolutionKey;
use Illuminate\Support\Facades\Log;

class GoogleMeetService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setAuthConfig(storage_path('app/google-calendar-credentials.json'));
        $this->client->addScope(Calendar::CALENDAR);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');
    }

    /**
     * Create a Google Meet event and return the meeting link.
     */
    public function createMeeting($topic, $startTime, $durationMinutes = 60)
    {
        try {
            $service = new Calendar($this->client);

            $endTime = (clone $startTime)->addMinutes($durationMinutes);

            $event = new Event([
                'summary' => $topic,
                'description' => 'Live Session on MyTutorPlus',
                'start' => new EventDateTime([
                    'dateTime' => $startTime->format(\DateTime::RFC3339),
                    'timeZone' => config('app.timezone'),
                ]),
                'end' => new EventDateTime([
                    'dateTime' => $endTime->format(\DateTime::RFC3339),
                    'timeZone' => config('app.timezone'),
                ]),
                'conferenceData' => new ConferenceData([
                    'createRequest' => new CreateConferenceRequest([
                        'requestId' => uniqid(),
                        'conferenceSolutionKey' => new ConferenceSolutionKey([
                            'type' => 'hangoutsMeet'
                        ])
                    ])
                ])
            ]);

            $calendarId = 'primary';
            $event = $service->events->insert($calendarId, $event, ['conferenceDataVersion' => 1]);

            return $event->getHangoutLink();
        } catch (\Exception $e) {
            Log::error('Google Meet Creation Failed: ' . $e->getMessage());
            return null;
        }
    }
}
