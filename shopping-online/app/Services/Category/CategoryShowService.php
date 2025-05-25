<?php

namespace App\Services\Category;

use App\Models\Category;

class CategoryShowService
{
    public function handle($id)
    {
        $category = Category::findOrFail($id);

        // Get products for this category
        $products = $category->products()
            ->with(['images'])
            ->paginate(12);

        // Transform products data
        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'discounted_price' => $product->price, // For now, same as price
                'image' => $product->images->first() ? $product->images->first()->image : null,
                'status' => $product->status,
                'category_id' => $product->category_id,
            ];
        });

        return response()->json([
            'category' => $category,
            'products' => $products,
        ]);
    }
}
