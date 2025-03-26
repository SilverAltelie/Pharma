<?php

namespace App\Services\Admin\Role;

use App\Models\Role;

class RoleCreateService
{
    public function handle(array $data): Role
    {
        return Role::create($data);
    }
}
