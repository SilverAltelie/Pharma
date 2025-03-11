<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class LoginService {
    public function handle($data)
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return response()->json(['error' => 'Email không tồn tại'], 404);
        }

        if (!Hash::check($data['password'], $user->password)) {
            return response()->json(['error' => 'Mật khẩu không đúng'], 401);
        }


        $token = $user->createToken('auth_token')->plainTextToken;

        // Trả về token ở dạng JSON
        return response()->json([
            'token' => $token,
        ]);
    }

}
