<?php

namespace App\Services\Product;

use App\Models\Product;

class ProductShowService {
    public function handle($id) {
        $product = Product::with(['variants', 'reviews.user', 'images'])->findOrFail($id);

        return response()->json($product);
    }
}
