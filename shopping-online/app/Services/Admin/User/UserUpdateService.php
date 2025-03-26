<?php

namespace App\Services\Admin\User;

use App\Models\Admin;
use App\Models\User;

class UserUpdateService
{
    public function handle(array $data, $id)
    {
        if (User::where('id', $id)->exists()) {
            $user = User::findOrFail($id);
        } else if (Admin::where('id', $id)->exists()) {
            $user = Admin::findOrFail($id);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user instanceof User && $data['role_id'] == 0) {
            $user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
            ]);

            if ($data['address']) {
                $user->addresses()->update([
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'address' => $data['address'],
                    'phone' => $data['phone'],
                    'email' => $data['email'],
                ]);
            }

        } else if ($user instanceof User && $data['role_id'] != 0) {
            $temp = Admin::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'phone' => $data['phone'],
            ]);

            $temp->userRoles()->create([
                'role_id' => $data['role_id'],
            ]);

            $user->addresses()->delete();
            $user->delete();

            $user = $temp;
        } else if ($user instanceof Admin && $data['role_id'] != 0) {
            $user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'phone' => $data['phone'],
            ]);

            if ($user->userRoles()->exists()) {
                $user->userRoles()->update([
                    'role_id' => $data['role_id'],
                ]);
            } else {
                $user->userRoles()->create([
                    'role_id' => $data['role_id'],
                ]);
            }

        } else if ($user instanceof Admin && $data['role_id'] == 0) {
            $temp = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
            ]);

            if ($data['address']) {
                $user->addresses()->update([
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'address' => $data['address'],
                    'phone' => $data['phone'],
                    'email' => $data['email'],
                ]);
            }

            $user->delete();
            $user->userRoles()->delete();

            $user = $temp;
        } else {
            return response()->json(['message' => 'Role not found'], 404);
        }

        return $user;
    }
}
