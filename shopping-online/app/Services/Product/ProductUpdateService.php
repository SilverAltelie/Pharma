<?php

namespace App\Services\Product;

use App\Models\Product;

class ProductUpdateService
{
    public function handle($data, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return false;
        }

        $product->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'content' => $data['content'],
            'category_id' => $data['category_id'],
            'quantity' => $data['quantity'],
            'price' => $data['price'],
            'status' => $data['status'],
            'image' => $data['image'],
        ]);

        return $product;
    }
}
