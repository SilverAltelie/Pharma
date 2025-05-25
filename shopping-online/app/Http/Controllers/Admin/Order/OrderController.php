<?php

namespace App\Http\Controllers\Admin\Order;

use App\Http\Controllers\Controller;
use App\Services\Order\OrderUpdateService;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    //
    protected $orderUpdateService;
    public function __construct(OrderUpdateService $orderUpdateService) {
        $this->orderUpdateService = $orderUpdateService;

        $permissions = config('permission.order');

        foreach ($permissions as $method => $permission) {
            $this->middleware("permission:$permission")->only($method);
        }
    }
    public function index()
    {
        return Order::with('user')->with('orderItems')->with('orderItems.product.images')->with('orderItems.variant')->orderBy('updated_at', 'desc')->paginate(10);
    }

    public function updateOrderStatus($id, Request $request) {
        return $this->orderUpdateService->updateStatus($id, $request->input('status'));
    }
}
