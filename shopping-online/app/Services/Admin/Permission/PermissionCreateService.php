<?php

namespace App\Services\Admin\Permission;

use App\Models\Permission;

class PermissionCreateService
{
    public function handle($data): Permission
    {
        return Permission::create($data);
    }
}
