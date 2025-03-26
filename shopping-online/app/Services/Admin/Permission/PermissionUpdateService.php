<?php

namespace App\Services\Admin\Permission;

use App\Models\Permission;

class PermissionUpdateService {
    public function handle($id, $data): Permission
    {
        $permission = Permission::findOrFail($id);
        $permission->update($data);

        return $permission;
    }
}
