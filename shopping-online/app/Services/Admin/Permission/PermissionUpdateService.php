<?php

namespace App\Services\Admin\Permission;

use Spatie\Permission\Models\Permission;
class PermissionUpdateService {
    public function handle($id, $data): Permission
    {
        $permission = Permission::findOrFail($id);
        $permission->update([
            'name' => $data['name'],
            'guard_name' => 'admin',
            'display_name' => $data['display_name'],
            'description' => $data['description'],
        ]);

        return $permission;
    }
}
