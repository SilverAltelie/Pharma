<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        return response()->json([
            'orders' => $orders,
            'customers' => $customers,
            'categories' => $categories,
            'order_items' => $orderItems,
        ]);
    }

    public function layout() {
        return Auth::guard('admin')->user();
    }
}
