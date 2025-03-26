<?php

namespace App\Services\Admin\Role;

use App\Models\Role;

class RoleUpdateService
{
    public function handle(Role $role, array $data)
    {
        $role->update($data);

        return $role;
    }
}
