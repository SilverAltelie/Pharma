<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use App\Services\Admin\Admin\LoginService;

class AdminController extends Controller
{
    protected $loginService;
    public function __construct(LoginService $loginService) {
        $this->loginService = $loginService;

    }



    public function login(LoginRequest $request) {
        $validated = $request->validated();
        return $this->loginService->handle($validated);
    }

    public function logout() {

    }

    public function register() {

    }

    public function forgotPassword() {

    }
}
