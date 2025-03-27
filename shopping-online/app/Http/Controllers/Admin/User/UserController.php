<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\UserRequest;
use App\Models\Address;
use App\Models\Admin;
use App\Models\Role;
use App\Models\User;
use App\Services\Admin\User\UserCreateService;
use App\Services\Admin\User\UserDeleteService;
use App\Services\Admin\User\UserUpdateService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //
    protected $userCreateService;
    protected $userUpdateService;
    protected $userDeleteService;

    public function __construct(UserCreateService $userCreateService, UserUpdateService $userUpdateService, UserDeleteService $userDeleteService) {
        $this->userCreateService = $userCreateService;
        $this->userUpdateService = $userUpdateService;
        $this->userDeleteService = $userDeleteService;

        $permissions = config('permission.user');

        foreach ($permissions as $method => $permission) {
            $this->middleware("permission:$permission")->only($method);
        }
    }
    public function index()
    {

        $users = User::paginate(10)->each(fn ($user) => $user->type = 'user')
            ->merge(Admin::paginate(10)->each(fn ($admin) => $admin->type = 'admin'));

        foreach ($users as $user) {
            if ($user instanceof User) {
                $user->address = Address::where('user_id', $user->id)->where('is_default', 1)->first();
                $user->role = 'customer';
            } else {
                $user->address = null;
                $user->role = $user->roles->pluck('name')->first();
            }
        }

        return $users;
    }

    public function store(UserRequest $request) {
        return $this->userCreateService->handle($request->validated());
    }

    public function edit ($id) {

        $roles = Role::all();

        if ($user = User::find($id)) {
            $user->address = Address::where('user_id', $id)->where('is_default', 1)->first();
            $user->phone = $user->address->phone ?? null;
            $user->role = '0';
        } else if ($user = Admin::find($id)) {
            $user->address = null;
            $user->role = $user->roles->pluck('id')->first();
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['user' => $user, 'roles' => $roles], 200);
    }
    public function update(UserRequest $request, $id) {
        return $this->userUpdateService->handle($request->validated(), $id);
    }

    public function destroy($id) {
        return $this->userDeleteService->handle($id);
    }
}
