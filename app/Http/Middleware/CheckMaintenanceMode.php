<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Setting;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Allow access to the bypass route itself so developers can unlock the site
        if ($request->is('dev-bypass') || $request->is('login') || $request->is('logout')) {
            return $next($request);
        }

        // 2. Check if maintenance mode is active in settings
        $isMaintenance = Setting::get('maintenance_mode', 'false') === 'true';

        if ($isMaintenance) {
            // 3. Check if user has bypass permissions (Admin role, or dev session bypass)
            $hasBypass = (auth()->check() && auth()->user()->isAdmin()) || session('dev_bypass') === true;

            if (!$hasBypass) {
                // If the request expects JSON (like API calls), return 503
                if ($request->expectsJson()) {
                    return response()->json(['message' => 'System is undergoing maintenance.'], 503);
                }

                // Render the premium React-based Maintenance screen via Inertia
                return Inertia::render('Maintenance')->toResponse($request)->setStatusCode(503);
            }
        }

        return $next($request);
    }
}
