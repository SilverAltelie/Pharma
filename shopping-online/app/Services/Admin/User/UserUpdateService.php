<?php

namespace App\Services\Admin\User;

use App\Models\Admin;
use App\Models\User;
use Spatie\Permission\Models\Role;

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

            if (!empty($data['address'])) {
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

            $role = Role::findById($data['role_id'], 'admin'); // chỉ rõ guard_name ở đây
            $temp->assignRole($role);

            $user->addresses()->delete();
            $user->delete();

            $user = $temp;
        } else if ($user instanceof Admin && $data['role_id'] != 0) {
            $role = Role::findById($data['role_id'], 'admin'); // chỉ rõ guard_name
            $user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'phone' => $data['phone'],
            ]);

            $user->syncRoles([$role]);
        } else if ($user instanceof Admin && $data['role_id'] == 0) {
            $temp = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
            ]);

            if (!empty($data['address'])) {
                $temp->addresses()->update([
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'address' => $data['address'],
                    'phone' => $data['phone'],
                    'email' => $data['email'],
                ]);
            }

            $user->syncRoles([]);
            $user->delete();

            $user = $temp;
        } else {
            return response()->json(['message' => 'Role not found'], 404);
        }

        return $user;
    }
}
