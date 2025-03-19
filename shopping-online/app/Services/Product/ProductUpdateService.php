<?php

namespace App\Services\Product;

use App\Models\Product;

class ProductUpdateService
{
    public function handle($data, $id)
    {
        // Lấy sản phẩm từ ID
        $product = Product::find($id);

        if (!$product) {
            return false; // Trả về false nếu sản phẩm không tồn tại
        }

        // Cập nhật thông tin cơ bản của sản phẩm
        $product->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'content' => $data['content'],
            'category_id' => $data['category_id'],
            'quantity' => $data['quantity'],
            'price' => $data['price'],
            'status' => $data['status'],
        ]);

        // Xử lý danh sách ảnh (nếu có)
        if (isset($data['images']) && is_array($data['images'])) {
            // Xóa toàn bộ ảnh cũ để thêm ảnh mới
            $product->images()->delete();

            // Tạo ảnh mới trong bảng `product_images`
            $newImages = array_map(function ($imageBase64) {
                return ['image' => $imageBase64];
            }, $data['images']);

            $product->images()->createMany($newImages);
        }

        return $product;
    }
}
