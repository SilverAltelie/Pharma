<?php

namespace App\Services\Admin\Admin;

use App\Models\Admin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginService
{
    public function handle($data) {

        if (!isset($data['email']) || !isset($data['password'])) {
            return response()->json(['error' => 'Thiếu email hoặc mật khẩu'], 400);
        }

        if (Auth::guard('admin')->attempt($data)) {
            $user = Auth::guard('admin')->user();
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        }


        return response()->json(['error' => 'Sai thông tin đăng nhập'], 401);
    }
}
