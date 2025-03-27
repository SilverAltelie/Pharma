<?php

namespace App\Services\Admin\Role;

use Spatie\Permission\Models\Role;

class RoleCreateService
{
    public function handle(array $data): Role
    {
        return Role::create([
            'name' => $data['name'],
            'guard_name' => 'admin',
            ]);
    }
}
