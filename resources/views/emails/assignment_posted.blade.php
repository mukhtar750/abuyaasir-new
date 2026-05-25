<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Assignment Posted</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; color: #333333; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #0D1B2A; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .header span { color: #F4A623; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .content h2 { color: #1A3C5E; margin-top: 0; }
        .assignment-box { background-color: #f9f9f9; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .assignment-title { font-size: 20px; font-weight: bold; color: #1A3C5E; margin-top: 0; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .button { display: inline-block; padding: 14px 30px; background-color: #F4A623; color: #111111 !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; text-transform: uppercase; font-size: 14px; }
        .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MyTutor<span>Plus</span></h1>
        </div>
        
        <div class="content">
            <h2>Hello, {{ $student->name }}!</h2>
            
            <p>A new assignment has been posted in your enrolled course: <strong>{{ $assignment->course->title }}</strong>.</p>
            
            <div class="assignment-box">
                <h3 class="assignment-title">{{ $assignment->title }}</h3>
                <p style="color: #666; font-size: 14px;">{{ \Illuminate\Support\Str::limit($assignment->description, 100) }}</p>
                
                <div class="detail-row" style="margin-top: 20px;">
                    <strong style="color: #555;">Max Score:</strong>
                    <span style="color: #2ECC8C; font-weight: bold;">{{ $assignment->max_score }} Points</span>
                </div>
                <div class="detail-row">
                    <strong style="color: #555;">Due Date:</strong>
                    <span style="color: #d9534f; font-weight: bold;">{{ $assignment->due_date ? \Carbon\Carbon::parse($assignment->due_date)->format('M d, Y') : 'No strict deadline' }}</span>
                </div>
            </div>

            <p>Please log in to your dashboard to view the full instructions and upload your submission.</p>

            <center>
                <a href="{{ route('student.assignments.show', $assignment->id) }}" class="button">View Assignment</a>
            </center>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} MyTutorPlus. All rights reserved.
        </div>
    </div>
</body>
</html>
