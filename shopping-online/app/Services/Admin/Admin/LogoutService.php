<?php

namespace App\Services\Admin\Admin;

use App\Models\Admin;

class LogoutService
{
    public function handle() {
        auth()->logout();
        return response()->json(['message' => 'Logout successfully']);
    }
}
