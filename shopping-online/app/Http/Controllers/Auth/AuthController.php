<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
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

        return $this->loginService->handle($data);

    }

    public function register(RegisterRequest $data) {
        $data->validated();

        return $this->registerService->handle($data);
    }

    public function verifyEmail(Request $request, $uuid)
    {
        // Kiểm tra chữ ký URL hợp lệ
        if (!$request->hasValidSignature()) {
            abort(403, 'Đường dẫn không hợp lệ hoặc đã hết hạn.');
        }

        // Tìm người dùng bằng UUID
        $user = User::where('id', $uuid)->first();

        if (!$user) {
            abort(404, 'Người dùng không tồn tại.');
        }

        // Xác minh email
        $user->email_verified_at = now();
        $user->save();

        return redirect('http://localhost:3000/auth/login?message=email-verified-successfully
');
    }

}
