<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CBT Performance Certificate</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #1a202c;
            margin: 0;
            padding: 0;
        }
        .certificate-container {
            border: 8px double #1A3C5E;
            padding: 40px;
            text-align: center;
            max-width: 700px;
            margin: auto;
            position: relative;
            background: #fafafa;
        }
        .header {
            margin-bottom: 30px;
        }
        .header h1 {
            font-family: 'Georgia', serif;
            color: #1A3C5E;
            font-size: 34px;
            margin: 0 0 5px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .header p {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: #F4A623;
            margin: 0;
            font-weight: bold;
        }
        .certificate-title {
            font-size: 20px;
            font-style: italic;
            margin-top: 25px;
            color: #4a5568;
        }
        .student-name {
            font-size: 28px;
            font-weight: bold;
            color: #1A3C5E;
            margin: 20px 0;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
            display: inline-block;
            min-width: 300px;
        }
        .achievement-text {
            font-size: 14px;
            line-height: 1.6;
            color: #4a5568;
            max-width: 500px;
            margin: 0 auto 30px auto;
        }
        .stats-grid {
            width: 100%;
            margin: 30px 0;
            border-collapse: collapse;
        }
        .stats-grid td {
            width: 33%;
            padding: 15px;
            border: 1px solid #e2e8f0;
            background: #ffffff;
        }
        .stat-value {
            font-size: 22px;
            font-weight: bold;
            color: #1A3C5E;
        }
        .stat-value.score {
            color: #2ECC8C;
        }
        .stat-value.fail {
            color: #e53e3e;
        }
        .stat-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #718096;
            margin-top: 5px;
            letter-spacing: 1px;
        }
        .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
        }
        .seal {
            width: 80px;
            height: 80px;
            background: #F4A623;
            border-radius: 50%;
            margin: 0 auto 15px auto;
            position: relative;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .seal-inner {
            border: 2px dashed #ffffff;
            border-radius: 50%;
            position: absolute;
            top: 4px;
            left: 4px;
            right: 4px;
            bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #ffffff;
            font-weight: bold;
            text-transform: uppercase;
            padding-top: 18px;
        }
        .signature-table {
            width: 100%;
            margin-top: 30px;
        }
        .signature-line {
            border-top: 1px solid #718096;
            width: 150px;
            margin: auto;
            padding-top: 5px;
            font-size: 10px;
            color: #718096;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div className="certificate-container">
        <div className="header">
            <h1>MyTutorPlus</h1>
            <p>E-Learning Performance Excellence</p>
        </div>

        <div className="seal">
            <div className="seal-inner">LMS</div>
        </div>

        <div className="certificate-title">Certificate of CBT Performance</div>

        <div className="student-name">{{ $student_name }}</div>

        <div className="achievement-text">
            This certificate verifies the successful completion and digital grading of the timed online CBT mock examination under direct platform simulation parameters.
        </div>

        <table className="stats-grid">
            <tr>
                <td>
                    <div className="stat-value">{{ $subject_name }}</div>
                    <div className="stat-label">Subject Category</div>
                </td>
                <td>
                    <div className="stat-value {{ $score >= 50 ? 'score' : 'fail' }}">{{ $score }}%</div>
                    <div className="stat-label">Graded Score</div>
                </td>
                <td>
                    <div className="stat-value">{{ $duration_mins }} min</div>
                    <div className="stat-label">Time Elapsed</div>
                </td>
            </tr>
        </table>

        <div className="footer">
            <table className="signature-table">
                <tr>
                    <td align="center">
                        <div className="signature-line">Course Administrator</div>
                    </td>
                    <td align="center" style="font-size: 11px; color: #718096; vertical-align: middle;">
                        Date Graded: {{ $date }}
                    </td>
                    <td align="center">
                        <div className="signature-line">Lead Tutor Coordinator</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
