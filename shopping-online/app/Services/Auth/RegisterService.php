<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class RegisterService {
    public function handle($data) {

        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);

        // Gửi email xác nhận
        $user->notify(new VerifyEmailNotification($user));

        return response()->json(['message' => 'Đăng ký thành công', 'user' => $user], 201);
    }

}
