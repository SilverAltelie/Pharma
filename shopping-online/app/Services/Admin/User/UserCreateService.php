<?php

namespace App\Services\Admin\User;

use App\Models\Admin;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserCreateService
{
    public function handle(array $data)
    {
        if ($data['role_id'] == 0) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
            ]);

            if (!empty($data['address'])) {
                $user->addresses()->create([
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'address' => $data['address'],
                    'phone' => $data['phone'],
                    'is_default' => 1,
                    'email' => $data['email'],
                ]);
            }
        } else {
            $user = Admin::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'phone' => $data['phone'],
            ]);

            $role = Role::findById($data['role_id'], 'admin'); // chỉ rõ guard 'admin' ở đây
            $user->assignRole($role);
        }

        return $user;
    }

}
