<?php

namespace App\Http\Controllers\Admin\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Role\RoleRequest;
use App\Models\Role;
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

    public function __construct(RoleCreateService $roleCreateService, RoleUpdateService $roleUpdateService, RoleDeleteService $roleDeleteService) {
        $this->roleCreateService = $roleCreateService;
        $this->roleDeleteService = $roleDeleteService;
        $this->roleUpdateService = $roleUpdateService;
    }

    public function index() {
        return Role::with('userRoles')->get();
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
}
