<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //
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
            $user->address = $defaultAddresses->get($user->id);
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
}
