<?php

namespace App\Http\Controllers\User\Order;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Services\Cart\CartGetItemsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    //
    protected $cartGetItemsService;

    public function __construct(CartGetItemsService $cartGetItemsService) {
        $this->cartGetItemsService = $cartGetItemsService;
    }

    public function index() {
        $user = Auth::user();

        $cartItems = $this->cartGetItemsService->getProductCart($user->id);

        foreach ($cartItems as $item) {
            $product = $item->product;
            if ($product && $product->images->isNotEmpty()) {
                $item->image = $product->images->first()->image;
            } else {
                $item->image = '';
            }
        }

        $address = $user->addresses();

        return response()->json([
            'cartItems' => $cartItems,
            'address' => $address,
        ]);
    }
}
