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
use App\Models\Order;

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
            if ($product) {
                // Get product images
                if ($product->images->isNotEmpty()) {
                    $item->image = $product->images->first()->image;
                } else {
                    $item->image = '';
                }
                
                // Get active promotions for the product
                $activePromotions = $product->promotion()
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now())
                    ->get()
                    ->map(function ($promotion) use ($product) {
                        return [
                            'id' => $promotion->id,
                            'name' => $promotion->name,
                            'type' => $promotion->type,
                            'discount' => $promotion->discount,
                            'discounted_price' => $promotion->type === 'percent' 
                                ? $product->price * (1 - $promotion->discount / 100)
                                : max($product->price - $promotion->discount, 0)
                        ];
                    });
                
                $item->promotions = $activePromotions;
                $item->product->promotions = $activePromotions;
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

        return $user->orders()->with('orderItems.product.images')->with('orderItems.variant')->orderBy('updated_at', 'desc')->paginate(10);
    }

    public function store(OrderRequest $request) {
        $user = Auth::user();

        return $this->orderCreateService->handle($request, $user);
    }

    public function show($id) {
        return Order::findOrFail($id);
    }
}
