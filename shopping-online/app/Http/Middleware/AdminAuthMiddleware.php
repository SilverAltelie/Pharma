<?php

// AdminAuthMiddleware.php
namespace App\Http\Middleware;

use App\Models\Admin;
use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Auth;

class AdminAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json([
                'message' => 'Unauthorized',
                'redirect_url' => 'http://localhost:3000/admin/auth/login',
            ], 401);
        }

        $accessToken = PersonalAccessToken::findToken($token);

        if (!$accessToken || !$accessToken->tokenable instanceof Admin) {
            return response()->json([
                'message' => 'Unauthorized',
                'redirect_url' => 'http://localhost:3000/admin/auth/login',
            ], 401);
        }

        // Đặt đúng user vào auth guard
       Auth::guard('admin')->setUser($accessToken->tokenable);

        return $next($request);
    }
}
