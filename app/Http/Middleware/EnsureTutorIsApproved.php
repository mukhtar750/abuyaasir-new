<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class EnsureTutorIsApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'tutor' && !$user->is_approved) {
            // If it's the dashboard, we let it through because the controller handles the redirect to the pending page
            if ($request->routeIs('tutor.dashboard')) {
                return $next($request);
            }

            // For other tutor routes, redirect to dashboard which will then show the pending page
            return redirect()->route('tutor.dashboard');
        }

        return $next($request);
    }
}
