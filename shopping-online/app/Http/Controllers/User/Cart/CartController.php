<?php

namespace App\Http\Controllers\User\Cart;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Services\Cart\AddToCartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    //
    protected $addToCartService;

    public function __construct(AddToCartService $addToCartService) {
        $this->addToCartService = $addToCartService;
    }

    public function index()
    {
        return Cart::all();
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

    public function addProductToCart(Request $request)
    {
        $user = Auth::user();

        $cart = $this->getUserCart($user->id);

        return $this->addToCartService->handle($request, $user, $cart);
    }
}
