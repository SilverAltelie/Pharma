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
    }
    public function index()
    {

        $users = User::paginate(10)->each(function ($user) {
            $user->type = 'user';
        })->merge(Admin::paginate(10)->each(function ($admin) {
            $admin->type = 'admin';
        }));

        $defaultAddresses = Address::whereIn('user_id', $users->pluck('id'))
            ->where('is_default', 1)
            ->get()
            ->keyBy('user_id');

        foreach ($users as $user) {

            if ($user instanceof User) {
                $user->address = $defaultAddresses->get($user->id);
            }


        }

        foreach ($users as $user) {
            if ($user instanceof User) {
                $user->role = 'customer';
            } elseif ($user instanceof Admin) {
                $user->role = $user->userRoles()->with('role')->get()->pluck('role.name')->first();
            }
        }

        return $users;
    }

    public function store(UserRequest $request) {
        return $this->userCreateService->handle($request->validated());
    }

    public function edit ($id) {

        $roles = Role::all();

        if (User::where('id', $id)->exists()) {
            $user = User::findOrFail($id);

            $user->address = Address::where('user_id', $id)->where('is_default', 1)->first();

            $user->phone = $user->address->phone ?? null;

            $user->role = '0';
        } else if (Admin::where('id', $id)->exists()) {
            $user = Admin::findOrFail($id);

            $user->address = null;

            $user->role = $user->userRoles()->with('role')->get()->pluck('role.id')->first();
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'user' => $user,
            'roles' => $roles],
            200);
    }
    public function update(UserRequest $request, $id) {
        return $this->userUpdateService->handle($request->validated(), $id);
    }

    public function destroy($id) {
        return $this->userDeleteService->handle($id);
    }
}
