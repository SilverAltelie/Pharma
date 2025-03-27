<?php

namespace App\Http\Controllers\Admin\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Role\RoleRequest;
use Spatie\Permission\Models\Role;
use App\Services\Admin\Role\RoleAddPermissionService;
use App\Services\Admin\Role\RoleCreateService;
use App\Services\Admin\Role\RoleDeleteService;
use App\Services\Admin\Role\RoleUpdateService;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    //
    protected $roleCreateService;
    protected $roleDeleteService;

    protected $roleUpdateService;
    protected $roleAddPermissionService;

    public function __construct(RoleCreateService $roleCreateService, RoleUpdateService $roleUpdateService, RoleDeleteService $roleDeleteService, RoleAddPermissionService $roleAddPermissionService) {
        $this->roleCreateService = $roleCreateService;
        $this->roleDeleteService = $roleDeleteService;
        $this->roleUpdateService = $roleUpdateService;
        $this->roleAddPermissionService = $roleAddPermissionService;

        $permissions = config('permission.role');

        foreach ($permissions as $method => $permission) {
            $this->middleware("permission:$permission")->only($method);
        }
    }

    public function index()
    {
        $roles = Role::with('permissions')->get();

        foreach ($roles as $role) {
            $role->admins_count = $role->users->count();
            $role->permissions_count = $role->permissions->count();
        }

        return $roles;
    }

    public function store(RoleRequest $request) {
        return $this->roleCreateService->handle($request->validated());
    }

    public function update(RoleRequest $request, $id) {
        $role = Role::find($id);

        return $this->roleUpdateService->handle($role, $request->validated());
    }

    public function destroy($id) {
        $role = Role::find($id);
        return $this->roleDeleteService->handle($role);
    }

    public function addPermission(Request $request, $id) {
        $role = Role::findOrFail($id);
        return $this->roleAddPermissionService->handle($role, $request);
    }
}
