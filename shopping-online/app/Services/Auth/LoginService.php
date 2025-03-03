<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class LoginService {
    public function handle($data) {
        $user = User::where('email',$data->email)->first();

        if (!$user||!Hash::check($data->password, $user->password))
            return null;

        return $user->createToken('MyApp')->plainTextToken;    }
}