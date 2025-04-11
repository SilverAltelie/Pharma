<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginService {
    public function handle($data) {
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            throw new \Exception('Email không tồn tại', 404);
        }

        if (!Hash::check($data['password'], $user->password)) {
            throw new \Exception('Mật khẩu không đúng', 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['token' => $token];
    }
}
