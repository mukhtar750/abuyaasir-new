<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tutor Application Approved - MyTutorPlus</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .header {
            background-color: #0D1B2A;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
        }
        .header span {
            color: #F4A623;
        }
        .content {
            padding: 40px 30px;
            line-height: 1.6;
        }
        .content h2 {
            color: #1A3C5E;
            margin-top: 0;
        }
        .button {
            display: inline-block;
            padding: 14px 30px;
            background-color: #F4A623;
            color: #000000 !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 20px;
            text-transform: uppercase;
            font-size: 14px;
            letter-spacing: 1px;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #eeeeee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MyTutor<span>Plus</span></h1>
        </div>
        
        <div class="content">
            <h2>Congratulations, {{ $user->name }}! 🎉</h2>
            
            <p>Your tutor application for MyTutorPlus has been reviewed and <strong>approved</strong> by our academic board.</p>
            
            <p>You can now access your Tutor Workspace to:</p>
            <ul style="color: #555;">
                <li><strong>Create Courses:</strong> Design and publish courses in your assigned subjects.</li>
                <li><strong>Schedule Live Classes:</strong> Connect with students in real-time.</li>
                <li><strong>Manage CBTs:</strong> Create and assign assessments to track student progress.</li>
            </ul>

            <center>
                <a href="{{ route('tutor.dashboard') }}" class="button">Access Tutor Workspace</a>
            </center>

            <p>We are excited to have you as part of our elite teaching team. Let's make a difference in our students' learning journey!</p>
            
            <p>Best regards,<br>
            <strong>The MyTutorPlus Academic Board</strong></p>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} MyTutorPlus. All rights reserved.<br>
            You are receiving this email because your tutor application was approved.
        </div>
    </div>
</body>
</html>
