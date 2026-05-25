<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Live Class Reminder</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; color: #333; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0D1B2A 0%, #1A3C5E 100%); padding: 30px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; }
        .header span { color: #F4A623; }
        .badge { display: inline-block; background: #F4A623; color: #111; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 50px; margin-bottom: 16px; }
        .content { padding: 40px 30px; line-height: 1.7; }
        .content h2 { color: #1A3C5E; margin-top: 0; }
        .session-card { background: #f0f8ff; border: 2px solid #1A3C5E; border-radius: 10px; padding: 24px; margin: 24px 0; }
        .session-topic { font-size: 22px; font-weight: 800; color: #0D1B2A; margin: 0 0 16px 0; }
        .detail-row { display: flex; align-items: center; font-size: 14px; color: #444; margin-bottom: 10px; }
        .detail-label { font-weight: bold; color: #1A3C5E; width: 120px; flex-shrink: 0; }
        .join-btn { display: inline-block; padding: 16px 36px; background: #2ECC8C; color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
        .countdown { text-align: center; font-size: 28px; font-weight: 900; color: #F4A623; padding: 12px; background: #0D1B2A; border-radius: 8px; margin: 20px 0; letter-spacing: 2px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MyTutor<span>Plus</span></h1>
        </div>

        <div class="content">
            <center><div class="badge">⏰ Class Reminder</div></center>

            <div class="countdown">Starting in ~1 Hour</div>

            <h2>Don't forget, {{ $session->student->name }}! 📚</h2>
            <p>Your upcoming live session is scheduled to begin in approximately <strong>one hour</strong>. Get ready, find a quiet space, and make sure your internet connection is stable.</p>

            <div class="session-card">
                <p class="session-topic">{{ $session->topic }}</p>

                <div class="detail-row">
                    <span class="detail-label">📅 Date & Time:</span>
                    <span>{{ $session->scheduled_at->format('l, F j, Y \a\t g:i A') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">⏱️ Duration:</span>
                    <span>{{ $session->duration_minutes ?? 60 }} minutes</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🎓 Tutor:</span>
                    <span>{{ $session->tutor->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📡 Platform:</span>
                    <span>{{ ucfirst(str_replace('_', ' ', $session->platform)) }}</span>
                </div>
            </div>

            @if($session->meeting_link)
            <center>
                <a href="{{ $session->meeting_link }}" class="join-btn">🚀 Join Live Class Now</a>
            </center>
            @else
            <center>
                <a href="{{ route('sessions.index') }}" class="join-btn">🚀 Go To Sessions Page</a>
            </center>
            @endif

            <p style="margin-top: 24px; color: #555; font-size: 14px;">
                <strong>Tips for a great session:</strong><br>
                ✅ Have your notebook and pen ready.<br>
                ✅ Log in 5 minutes early to test your connection.<br>
                ✅ Write down questions you want to ask your tutor.
            </p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} MyTutorPlus. All rights reserved.<br>
            You are receiving this email because you have a scheduled session on our platform.
        </div>
    </div>
</body>
</html>
