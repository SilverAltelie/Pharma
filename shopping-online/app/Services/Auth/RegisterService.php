<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class RegisterService {
    public function handle($data) {
        $token = Str::random(60);
        \DB::table('password_resets')->insert([
            'email' => $data->email,
            'token' => $token,
            'created_at' => now()
        ]);
        $link = url("/auth/set-pass?token=$token&email=$data->email");

        \Mail::to($data->email)->send(new RegisterMail($link));

        return response()->json(['message' => 'Đăng ký thành công, vui lòng kiểm tra email để xác nhận'], 200);
    }

    
}