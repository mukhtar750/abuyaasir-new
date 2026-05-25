<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to MyTutorPlus</title>
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
            background-color: #2ECC8C;
            color: #ffffff !important;
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
            <h2>Hello, {{ $user->name }}! 👋</h2>
            
            <p>Welcome to MyTutorPlus! We are absolutely thrilled to have you join our community of high-achieving students.</p>
            
            <p>You have just taken the first massive step towards mastering your core sciences and dominating your upcoming JAMB and WAEC exams.</p>
            
            <p>Here is what you can do right now to get started:</p>
            <ul style="color: #555;">
                <li><strong>Explore Courses:</strong> Browse our premium catalog of Mathematics, Physics, and Chemistry classes.</li>
                <li><strong>Earn XP:</strong> Start taking mock CBT tests and completing lessons to build your daily streak.</li>
            </ul>

            <center>
                <a href="{{ route('dashboard') }}" class="button">Go To Your Dashboard</a>
            </center>

            <p>If you ever have any questions, our support team and expert tutors are here for you.</p>
            
            <p>Let's get to work!<br>
            <strong>The MyTutorPlus Team</strong></p>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} MyTutorPlus. All rights reserved.<br>
            You are receiving this email because you registered on our platform.
        </div>
    </div>
</body>
</html>
