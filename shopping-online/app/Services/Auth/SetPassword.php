<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SetPassword {
    public function handle($data) {
        $record = \DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

        if (!$record || !\Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Token không hợp lệ'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            $user = User::create([
                'email' => $request->email,
                'password' => \Hash::make($request->password)
            ]);
        } else {
            $user->update(['password' => \Hash::make($request->password)]);
        }

        \DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mật khẩu đã được đặt thành công'], 200);
    }
}