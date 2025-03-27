<?php

namespace App\Services\Admin\Role;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAddPermissionService
{
    public function handle(Role $role, $data)
    {
        $permissions = collect($data)
            ->flatten()
            ->map(fn($data) => (int)$data)
            ->filter()
            ->values()
            ->toArray();

        $permissionModels = Permission::whereIn('id', $permissions)->get();

        $role->syncPermissions($permissionModels);

        return $role->load('permissions');

    }
}
