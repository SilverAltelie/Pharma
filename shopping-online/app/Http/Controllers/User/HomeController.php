<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\Category\CategoryListService;
use App\Services\Cart\CartGetItemsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    //
    protected $categoryListService;
    protected $cartGetItemsService;

    public function __construct(CategoryListService $categoryListService, CartGetItemsService $cartGetItemsService) {
        $this->categoryListService = $categoryListService;
        $this->cartGetItemsService = $cartGetItemsService;
    }

    public function index()
    {
        // Lấy user từ Auth nếu có
        $user = Auth::user();

        // Lấy danh mục (luôn công khai)
        $categories = $this->categoryListService->handle();

        // Nếu user đã đăng nhập, lấy thêm giỏ hàng
        $cartItems = [];
        if ($user) {
            $cartItems = $this->cartGetItemsService->getProductCart($user->id);
        }

        return response()->json([
            'user' => $user,
            'categories' => $categories,
            'cartItems' => $cartItems
        ]);
    }
}
