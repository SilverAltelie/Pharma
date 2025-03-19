<?php

namespace App\Http\Controllers\User\Cart;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\CartRequest;
use App\Models\Cart;
use App\Services\Cart\AddToCartService;
use App\Services\Cart\CartGetItemsService;
use App\Services\Cart\DeleteProductFromCartService;
use App\Services\Category\CategoryListService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    //
    protected $addToCartService;
    protected $deleteFromCartService;
    private $categoryListService;
    private $cartGetItemsService;

    public function __construct(AddToCartService $addToCartService, DeleteProductFromCartService $deleteFromCartService, CategoryListService $categoryListService, CartGetItemsService $cartGetItemsService)
    {
        $this->addToCartService = $addToCartService;
        $this->deleteFromCartService = $deleteFromCartService;
        $this->categoryListService = $categoryListService;
        $this->cartGetItemsService = $cartGetItemsService;
    }

    public function index()
    {
        $user = Auth::user();

        $cartItems = [];
        if ($user) {
            $cartItems = $this->cartGetItemsService->getProductCart($user->id);
        }

        return response()->json([
            $cartItems
        ]);
    }

    public function getUserCart($userId)
    {
        $cart = Cart::where('user_id', $userId)->first();

        if ($cart) {
            return $cart;
        }

        return Cart::create([
            'user_id' => $userId
        ]);
    }

    public function getProductCart($userId)
    {
        $cart = $this->getUserCart($userId);

        $cartItems = Cart::find($cart->id)->cartItems;

        if (!$cartItems) {
            return [];
        }

        return $cartItems;
    }

    public function addProductToCart(CartRequest $request)
    {
        $user = Auth::user();

        $cart = $this->getUserCart($user->id);

        return $this->addToCartService->handle($request, $user, $cart);
    }

    public function deleteProductFromCart(CartRequest $data)
    {
        $user = Auth::user();

        $cart = $this->getUserCart($user->id);

        return $this->deleteFromCartService->handle($data, $cart);
    }
}
