<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Access Denied - MyTutorPlus</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&family=Fraunces:wght@700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'DM Sans', sans-serif; background-color: #0D1B2A; color: white; }
        .font-serif { font-family: 'Fraunces', serif; }
        .glass { background: rgba(26, 60, 94, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); }
    </style>
</head>
<body class="antialiased min-h-screen flex items-center justify-center p-6 overflow-hidden relative">
    <!-- Background Accents -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#F4A623]/5 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#2ECC8C]/5 rounded-full blur-[120px]"></div>
    </div>

    <div class="max-w-md w-full glass p-12 rounded-[40px] text-center space-y-8 relative z-10 shadow-2xl">
        <div class="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        </div>

        <div class="space-y-3">
            <h1 class="text-4xl font-serif font-black uppercase tracking-widest text-white">403</h1>
            <h2 class="text-xl font-bold text-red-400 uppercase tracking-tighter">Access Forbidden</h2>
            <p class="text-gray-400 leading-relaxed text-sm">
                You do not have the necessary clearance to access this department. If you believe this is an error, please contact the Academic Board.
            </p>
        </div>

        <div class="pt-4">
            <a href="/" class="inline-block px-8 py-4 bg-[#F4A623] text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-amber-400 transition shadow-lg shadow-amber-500/10">
                Return to Campus
            </a>
        </div>

        <p class="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] mt-8">MyTutorPlus Security Protocol</p>
    </div>
</body>
</html>
