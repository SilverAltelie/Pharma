<?php

namespace App\Services\Admin\Product;

use App\Models\Product;

class ProductCreateService
{
    public function handle($data) {

        $product = Product::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'content' => $data['content'],
            'category_id' => $data['category_id'],
            'quantity' => $data['quantity'],
            'price' => $data['price'],
            'status' => $data['status'],
            'image' => $data['image'],
        ]);

        /*if (isset($data['images'])) {
            foreach ($data['images'] as $image) {
                $product->images()->create(['image' => $image]);
            }
        }*/

        return $product;

    }
}
