<?php

namespace App\Http\Controllers\User\Cart;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\CartRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Services\Cart\AddToCartService;
use App\Services\Cart\CartGetItemsService;
use App\Services\Cart\CartUpdateService;
use App\Services\Cart\DeleteProductFromCartService;
use App\Services\Category\CategoryListService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use function Sodium\add;

class CartController extends Controller
{
    //
    protected $addToCartService;
    protected $deleteFromCartService;
    private $categoryListService;
    private $cartGetItemsService;

    private $cartUpdateService;

    public function __construct(AddToCartService $addToCartService, DeleteProductFromCartService $deleteFromCartService, CategoryListService $categoryListService, CartGetItemsService $cartGetItemsService, CartUpdateService $cartUpdateService)
    {
        $this->addToCartService = $addToCartService;
        $this->deleteFromCartService = $deleteFromCartService;
        $this->categoryListService = $categoryListService;
        $this->cartGetItemsService = $cartGetItemsService;
        $this->cartUpdateService = $cartUpdateService;
    }

    public function index()
    {
        $user = Auth::user();

        $cartItems = [];

        if ($user) {
            $cartItems = $this->cartGetItemsService->getProductCart($user->id);
        }

        foreach ($cartItems as $item) {
            $product = $item->product;
            if ($product && $product->images->isNotEmpty()) {
                $item->image = $product->images->first()->image;
            } else {
                $item->image = '';
            }
        }

        return response()->json(
            $cartItems
        );
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

    public function updateQuantity(Request $request) {

        $itemId = $request->input('itemId');
        $quantity = $request->input('quantity');

        $item = CartItem::findOrFail($itemId);

        return $this->cartUpdateService->updateQuantity($item, $quantity);
    }

    public function updateAllQuantity(Request $request) {

        $cartItems = [];

        foreach ($request->input('itemIds') as $itemId) {
            $item = CartItem::findOrFail($itemId);

            $this->cartUpdateService->updateQuantity($item, $request->input('quantities')[$itemId] ?? $request->input('quantity'));

            $cartItems[] = $item;
        }

        return response()->json([
            'message' => 'success',
            'cartItems' => $cartItems,
        ]);

    }

}
