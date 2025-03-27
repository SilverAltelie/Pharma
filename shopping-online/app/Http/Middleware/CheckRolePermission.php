<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class CheckRolePermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        /** @var \App\Models\Admin $user */
        $user = auth('admin')->user();

        if (!$user || !$user->can($permission)) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập',
                'redirect_url' => 'http://localhost:3000/admin/auth/login',
            ], 403);
        }

        return $next($request);
    }

}
