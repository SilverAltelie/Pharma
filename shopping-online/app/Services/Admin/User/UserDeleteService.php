<?php

namespace App\Services\Admin\User;

use App\Models\Admin;
use App\Models\User;

class UserDeleteService
{
    public function handle($id)
    {
        if (User::where('id', $id)->exists()) {
            $user = User::findOrFail($id);

            $user->addresses()->delete();
            $user->delete();

        } else if (Admin::where('id', $id)->exists()) {
            $user = Admin::findOrFail($id);

            $user->userRoles()->delete();
            $user->delete();
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
