<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRolePermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        $admin = Auth::guard('admin')->user();

        if (!$admin || !$admin->hasPermission($permission)) {
            return response()->json([
                'message' => 'Forbidden',
                'redirect_url' => 'http://localhost:3000/admin/auth/login',
            ], 403);
        }

        return $next($request);
    }
}
