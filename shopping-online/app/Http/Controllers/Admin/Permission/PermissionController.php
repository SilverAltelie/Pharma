<?php

namespace App\Http\Controllers\Admin\Permission;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Permission\PermissionRequest;
use Spatie\Permission\Models\Permission;
use App\Services\Admin\Permission\PermissionCreateService;
use App\Services\Admin\Permission\PermissionDeleteService;
use App\Services\Admin\Permission\PermissionUpdateService;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    //
    protected $permissionCreateService;

    protected $permissionUpdateService;

    protected $permissionDeleteService;

    public function __construct(PermissionCreateService $permissionCreateService, PermissionUpdateService $permissionUpdateService, PermissionDeleteService $permissionDeleteService) {
        $this->permissionCreateService = $permissionCreateService;
        $this->permissionUpdateService = $permissionUpdateService;
        $this->permissionDeleteService = $permissionDeleteService;

        $permissions = config('permission.permission');

        foreach ($permissions as $method => $permission) {
            $this->middleware("permission:$permission")->only($method);
        }
    }

    public function index() {
        return Permission::withCount('roles')->get();
    }

    public function store(PermissionRequest $request)
    {
        return $this->permissionCreateService->handle($request->validated());
    }

    public function edit($id)
    {
        return Permission::findOrFail($id);
    }

    public function update(PermissionRequest $request, $id)
    {
        return $this->permissionUpdateService->handle($id, $request->validated());
    }

    public function destroy($id)
    {
        return $this->permissionDeleteService->handle($id);
    }
}
