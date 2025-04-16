<?php

namespace App\Services\Admin\Admin;

use App\Models\Admin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginService
{
    public function handle($data)
    {

        if (!isset($data['email']) || !isset($data['password'])) {
            return response()->json(['error' => 'Thiếu email hoặc mật khẩu'], 400);
        }

        $credentials = ['email' => $data['email'], 'password' => $data['password']];
        if (Auth::guard('admin')->getProvider()->retrieveByCredentials($credentials)) {
            $admin = Auth::guard('admin')->getProvider()->retrieveByCredentials($credentials);
            if (Hash::check($data['password'], $admin->password)) {
                Auth::guard('admin')->setUser($admin);
                $token = $admin->createToken('authToken')->plainTextToken;

                return response()->json([
                    'user' => $admin,
                    'token' => $token,
                ]);
            }
        }

        return response()->json(['error' => 'Sai thông tin đăng nhập'], 401);
    }
}
