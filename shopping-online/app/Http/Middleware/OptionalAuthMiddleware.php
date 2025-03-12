<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class OptionalAuthMiddleware
{
    public function handle($request, Closure $next)
    {
        // Kiểm tra nếu có Authorization header (token được gửi)
        if ($request->bearerToken()) {
            // Sử dụng guard để xác thực user với Sanctum
            $guard = Auth::guard('sanctum');

            // Đặt request cho guard hiện tại
            $guard->setRequest($request);

            // Xác thực bằng token
            try {
                $user = $guard->user(); // Xác thực user từ token
                if ($user) {
                    // Nếu xác thực thành công, đăng nhập user
                    Auth::setUser($user);
                }
            } catch (\Exception $e) {
                // Nếu có lỗi khi xác thực, user sẽ là null
                report($e);
            }
        }

        return $next($request);
    }
}
