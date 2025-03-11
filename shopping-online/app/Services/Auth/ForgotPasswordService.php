<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Password;

class ForgotPasswordService
{
    public function sendResetLink($request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'Email không tồn tại!'], 404);
        }

        try {
            $user->notify(new ResetPasswordNotification($user));

            return response()->json(['message' => 'Link đặt lại mật khẩu đã được gửi đến email của bạn!']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể gửi email. Vui lòng thử lại sau!'], 500);
        }
    }

    public function resetPassword($request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'Email không tồn tại!'], 404);
        }

        $status = $user->update(['password' => bcrypt($request->password)]);

        if (!$status) {
            return response()->json(['error' => 'Không thể đặt lại mật khẩu!'], 500);
        }

        return response()->json(['message' => 'Mật khẩu đã được đặt lại thành công!']);
    }
}
