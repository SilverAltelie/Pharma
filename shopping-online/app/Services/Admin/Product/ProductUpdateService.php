<?php

namespace App\Services\Admin\Product;

use App\Models\Product;

class ProductUpdateService
{
    public function handle($data, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return false;
        }

        $images = isset($data['images']) ? array_map(fn($image) => base64_encode(file_get_contents($image)), $data['images']) : [];

        $product->update((array) $data);

        return $product;
    }
}
