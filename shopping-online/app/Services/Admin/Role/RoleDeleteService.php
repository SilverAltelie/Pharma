<?php

namespace App\Services\Admin\Role;

use Spatie\Permission\Models\Role;

class RoleDeleteService
{
    public function handle(Role $role)
    {
        $role->delete();

        return response()->json(['message' => 'Role deleted successfully'], 200);
    }
}
