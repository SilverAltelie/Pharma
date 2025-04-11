<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\Category\CategoryListService;
use App\Services\Cart\CartGetItemsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

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
        $user = Auth::user();

        if (!$user && !Session::has('user')) {
            $user = [
              'id' => 'guest_' . Str::uuid(10),
                'name' => 'Khách hàng',
            ];
            $guest = Session::put('user', $user);
        }

        $categories = $this->categoryListService->handle();

        if (!Session::has('user')) {
            $cartItems = $this->cartGetItemsService->getProductCart($user->id);

            foreach ($cartItems as $item) {
                $product = $item->product;
                if ($product && $product->images->isNotEmpty()) {
                    $item->image = $product->images->first()->image;
                } else {
                    $item->image = '';
                }
            }
        } else {

            if (!Session::has('cart')) {
                Session::put('cart', []);
            }

            $cartItems = Session::get('cart');
        }

        return response()->json([
            'user' => $user,
            'categories' => $categories,
            'cartItems' => $cartItems
        ]);
    }
}
