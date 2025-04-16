<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use App\Services\Admin\Admin\LoginService;
use App\Services\Admin\Admin\LogoutService;

class AdminController extends Controller
{
    protected $loginService;
    protected $logoutService;
    public function __construct(LoginService $loginService, LogoutService $logoutService) {
        $this->loginService = $loginService;
        $this->logoutService = $logoutService;
    }



    public function login(LoginRequest $request) {
        $validated = $request->validated();
        return $this->loginService->handle($validated);
    }

    public function logout() {
        return $this->logoutService->handle();
    }

    public function forgotPassword() {

    }
}
