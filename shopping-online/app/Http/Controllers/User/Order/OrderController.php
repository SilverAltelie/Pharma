<?php

namespace App\Http\Controllers\User\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\OrderRequest;
use App\Models\Address;
use App\Models\Payment;
use App\Services\Cart\CartGetItemsService;
use App\Services\Order\OrderCreateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    //
    protected $cartGetItemsService;

    protected $orderCreateService;

    public function __construct(CartGetItemsService $cartGetItemsService, OrderCreateService $orderCreateService) {
        $this->cartGetItemsService = $cartGetItemsService;
        $this->orderCreateService = $orderCreateService;
    }

    public function checkout() {
        $user = Auth::user();

        $payment_methods = Payment::all();

        $cartItems = $this->cartGetItemsService->getProductCart($user->id);

        foreach ($cartItems as $item) {
            $product = $item->product;
            if ($product && $product->images->isNotEmpty()) {
                $item->image = $product->images->first()->image;
            } else {
                $item->image = '';
            }
        }

        $addresses = $user->addresses()->get();

        return response()->json([
            'cartItems' => $cartItems,
            'addresses' => $addresses,
            'paymentMethods' => $payment_methods,
        ]);
    }

    public function index() {
        $user = Auth::user();

        return $user->orders()->with('orderItems.product.images')->with('orderItems.variant')->paginate(10);
    }

    public function store(OrderRequest $request) {
        $user = Auth::user();

        return $this->orderCreateService->handle($request, $user);
    }
}
