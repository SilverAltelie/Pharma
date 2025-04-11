<?php

namespace App\Services\Category;

use App\Models\Category;

class CategoryShowService
{
    public function handle($id)
    {
        $category = Category::findOrFail($id);

        $products = $category->products()->with('variants')->paginate(20);

        foreach ($products as $product) {
            $product->image = $product->images->first();
        }

        return response()->json([
            'category' => $category,
            'products' => $products,
        ]);
    }
}
