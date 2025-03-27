<?php

namespace App\Services\Admin\Permission;

use Spatie\Permission\Models\Permission;
class PermissionCreateService
{
    public function handle($data): Permission
    {
        return Permission::create([
            'name' => $data['name'],
            'guard_name' => 'admin',
            'display_name' => $data['display_name'],
            'description' => $data['description'],
        ]);
    }
}
