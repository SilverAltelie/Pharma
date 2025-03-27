<?php

namespace App\Services\Admin\Permission;

use Spatie\Permission\Models\Permission;
class PermissionDeleteService
{
    public function handle($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return response()->json(['message' => 'Permission deleted successfully'], 200);
    }
}
