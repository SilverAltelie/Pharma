<?php

namespace App\Services\Promotion;

use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;

class PromotionShowService
{
    public function handle($id)
    {
        $promotion = Promotion::with('items')->findOrFail($id);

        $allProducts = Category::with('products.images')->get();

        return response()->json([
            'promotion' => $promotion,
            'categories' => $allProducts,
        ]);
    }
}
