<?php

namespace App\Services\Product;

use App\Models\Product;

class ProductCreateService
{
    public function handle($data) {

        // Tạo sản phẩm
        $product = Product::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'content' => $data['content'],
            'category_id' => $data['category_id'],
            'quantity' => $data['quantity'],
            'price' => $data['price'],
            'status' => $data['status'],
        ]);

        // Kiểm tra và lưu nhiều ảnh liên quan
        if (isset($data['images']) && is_array($data['images'])) {
            $images = array_map(function ($imageBase64) {
                return ['image' => $imageBase64];
            }, $data['images']);

            $product->images()->createMany($images);
        }

        return $product;
    }
}
