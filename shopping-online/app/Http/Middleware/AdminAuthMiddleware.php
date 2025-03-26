<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::guard('admin')->check()) {
            return $next($request);
        }

        if ($request->bearerToken()) {
            $guard = Auth::guard('admin');
            $guard->setRequest($request);

            try {
                $admin = $guard->user();
                if ($admin) {
                    Auth::setUser($admin);
                    return $next($request);
                }
            } catch (\Exception $e) {
                report($e);
            }
        }

        return response()->json([
            'message' => 'Unauthorized',
            'redirect_url' => 'http://localhost:3000/admin/auth/login',
        ], 401);
    }
}
