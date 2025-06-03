<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\Promotion;

class HomeController extends Controller
{
    //
    public function __construct()
    {
        $permissions = config('permission.home');

        foreach ($permissions as $method => $permission) {
            $this->middleware("permission:$permission")->only($method);
        }
    }
    public function dashboard()
    {
        $orders = Order::with('user')->get();

        $orderItems = $orders->pluck('orderItems')->flatten()->each(function ($orderItem) {
            $orderItem->load('product', 'variant');
        });

        $customers = User::whereIn('id', $orders->pluck('user_id'))
            ->with(['addresses' => function ($query) {
                $query->where('is_default', 1)->first();
            }])->get();

        $categories = Category::all();
        $products = Product::all();
        $promotions = Promotion::where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->with('products')
            ->get();
        foreach ($promotions as $promotion) {
            $promotion->items_count = $promotion->products->count();
        }

        return response()->json([
            'orders' => $orders,
            'customers' => $customers,
            'categories' => $categories,
            'order_items' => $orderItems,
            'products' => $products,
            'promotions' => $promotions,
        ]);
    }

    public function layout() {
        return Auth::guard('admin')->user();
    }
}
