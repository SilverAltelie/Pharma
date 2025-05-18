<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Category\CategoryListService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MainController extends Controller
{
    //
    protected $categoriesListService;

    public function __construct(CategoryListService $categoryListService) {
        $this->categoriesListService = $categoryListService;
    }
    public function index() {
        $products = Product::with('variants', 'images')->paginate(12);

        $bestSelling = Product::with('images', 'variants')
            ->bestSelling()
            ->get();

        $categories = $this->categoriesListService->handle();

        $user = Auth::user();

        $mostDiscounted = Product::with('images', 'variants', 'promotion')
            ->get()
            ->sortByDesc(function ($product) {
                $promotions = $product->promotion;
        
                $maxDiscount = 0;
        
                foreach ($promotions as $item) {
                    if ($item->type === 'percent') {
                        $discount = $product->price * $item->discount / 100;
                    } else {
                        $discount = $item->discount;
                    }
        
                    $maxDiscount = max($maxDiscount, $discount);
                }
        
                return $maxDiscount;
            })
            ->take(12)
            ->values();
    
        return response()->json([
            'products' => $products,
            'categories' => $categories,
            'user' => $user,
            'bestSelling' => $bestSelling,
            'mostDiscounted' => $mostDiscounted
        ]);
    }
}
