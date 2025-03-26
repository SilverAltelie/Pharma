<?php

namespace App\Services\Admin\Role;

use App\Models\Role;

class RoleDeleteService
{
    public function handle(Role $role)
    {
        $role->delete();

        return response()->json([
            'message' => 'Role deleted successfully'
        ]);
    }
}
