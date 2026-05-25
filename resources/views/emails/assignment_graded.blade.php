<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Assignment Graded</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; color: #333333; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #0D1B2A; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .header span { color: #F4A623; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .content h2 { color: #1A3C5E; margin-top: 0; }
        .score-box { background-color: #f9fcfb; border: 2px solid #2ECC8C; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .score { font-size: 32px; font-weight: bold; color: #2ECC8C; margin: 0; }
        .max-score { font-size: 16px; color: #666; }
        .feedback { background-color: #f5f5f5; padding: 15px; border-left: 4px solid #F4A623; font-style: italic; color: #555; }
        .button { display: inline-block; padding: 14px 30px; background-color: #1A3C5E; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; text-transform: uppercase; font-size: 14px; }
        .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MyTutor<span>Plus</span></h1>
        </div>
        
        <div class="content">
            <h2>Hello, {{ $submission->student->name }}!</h2>
            
            <p>Your assignment for <strong>{{ $submission->assignment->course->title }}</strong> has just been graded by your tutor.</p>
            
            <div class="score-box">
                <p style="margin:0; text-transform: uppercase; font-size:12px; letter-spacing: 1px; color: #777; font-weight: bold;">Your Score</p>
                <p class="score">{{ $submission->score }} <span class="max-score">/ {{ $submission->assignment->max_score }}</span></p>
            </div>

            @if($submission->feedback)
            <p style="margin-bottom: 5px; font-weight: bold;">Tutor's Feedback:</p>
            <div class="feedback">
                "{{ $submission->feedback }}"
            </div>
            @endif

            <center>
                <a href="{{ route('student.assignments.show', $submission->assignment_id) }}" class="button">View Submission</a>
            </center>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} MyTutorPlus. All rights reserved.
        </div>
    </div>
</body>
</html>
