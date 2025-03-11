<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Password;

class ForgotPasswordService
{
    public function sendResetLink($request)
    {
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Link đặt lại mật khẩu đã gửi!'])
            : response()->json(['error' => 'Không thể gửi link đặt lại mật khẩu!'], 400);
    }

    public function resetPassword($request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->update(['password' => bcrypt($password)]);
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Mật khẩu đã được đặt lại!'])
            : response()->json(['error' => 'Token không hợp lệ hoặc đã hết hạn!'], 400);
    }
}
