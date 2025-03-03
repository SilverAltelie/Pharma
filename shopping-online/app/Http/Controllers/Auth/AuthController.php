<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Auth\LoginService;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Services\Auth\RegisterService;
use App\Http\Requests\Auth\RegisterRequest;


class AuthController extends Controller
{
    //
    protected $loginService;
    protected $registerService;

    public function __construct(LoginService $loginService, RegisterService $registerService) {
    	$this->registerService = $registerService;
        $this->loginService = $loginService;
    }

    public function login(LoginRequest $data) {

        $token = $this->loginService->handle($data);

        if ($token) {
            $data->session()->regenerate();
            return response()->json(['token' => $token], 200);
        }

        return response()->json(['message' => 'Tài khoản hoặc mật khẩu không đúng'], 401);
    }

    public function register(RegisterRequest $data) {
        $data->validated();
        
        return $this->registerService->handle($data);
    }
}
