<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLiveSessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && ($user->role === 'admin' || $user->role === 'tutor');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'tutor_id' => 'nullable|exists:users,id',
            'topic' => 'required|string|max:255',
            'scheduled_at' => 'required|date',
            'duration_minutes' => 'integer|min:15',
            'platform' => 'nullable|in:google_meet',
            'status' => 'nullable|in:scheduled,live,completed,cancelled',
            'meeting_link' => [
                function ($attribute, $value, $fail) {
                    $status = $this->input('status', 'scheduled') ?: 'scheduled';
                    if ($status === 'scheduled' && (is_null($value) || $value === '')) {
                        $fail('Please provide a valid Google Meet link.');
                        return;
                    }
                    if (!is_null($value) && $value !== '') {
                        if (!str_starts_with($value, 'https://meet.google.com/')) {
                            $fail('Please provide a valid Google Meet link.');
                        }
                    }
                }
            ],
        ];
    }
}
