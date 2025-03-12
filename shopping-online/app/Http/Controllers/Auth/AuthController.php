<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Auth\ForgotPasswordService;
use Illuminate\Http\Request;
use App\Services\Auth\LoginService;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Services\Auth\RegisterService;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\Auth\ForgotPasswordRequest;


class AuthController extends Controller
{
    //
    protected $loginService;
    protected $registerService;
    protected $forgotPasswordService;

    public function __construct(LoginService $loginService, RegisterService $registerService, ForgotPasswordService $forgotPasswordService) {
    	$this->registerService = $registerService;
        $this->loginService = $loginService;
        $this->forgotPasswordService = $forgotPasswordService;
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

        return redirect('http://localhost:3000/auth/login?message=email-verified-successfully');
    }

    public function sendResetLink(ForgotPasswordRequest $request)
    {
        return $this->forgotPasswordService->sendResetLink($request);
    }

    public function resetPassword(ForgotPasswordRequest $request)
    {
        return $this->forgotPasswordService->resetPassword($request);
    }

    public function logout() {
        Auth::logout();
        return response()->json(['message' => 'Đăng xuất thành công!']);
    }

    public function user() {
        $user = Auth::user(); // Lấy đối tượng người dùng hiện đang xác thực

        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }

        // Lấy danh sách addresses thông qua quan hệ trong model User
        $user->addresses = $user->addresses()->get();

        return response()->json($user);
    }
}
