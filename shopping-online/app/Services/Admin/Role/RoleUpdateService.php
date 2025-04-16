<?php

namespace App\Services\Admin\Role;

use Spatie\Permission\Models\Role;

class RoleUpdateService
{
    public function handle(Role $role, array $data)
    {
        $role->update([
            'name' => $data['name'],
            'guard_name' => 'admin',
        ]);

        return $role;
    }
}
