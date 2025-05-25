<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // Thuốc giảm đau (category_id: 1)
        $products = [
            [
                'name' => 'Paracetamol 500mg',
                'description' => 'Thuốc giảm đau, hạ sốt thông dụng',
                'content' => 'Công dụng: Giảm đau nhức, hạ sốt...',
                'category_id' => 1,
                'quantity' => 100,
                'price' => 15000,
                'status' => '1',
                'image' => 'paracetamol.jpg'
            ],
            [
                'name' => 'Ibuprofen 400mg',
                'description' => 'Thuốc kháng viêm không steroid',
                'content' => 'Công dụng: Giảm đau, kháng viêm...',
                'category_id' => 1,
                'quantity' => 80,
                'price' => 25000,
                'status' => '1',
                'image' => 'ibuprofen.jpg'
            ],
            [
                'name' => 'Aspirin 81mg',
                'description' => 'Thuốc giảm đau, chống đông máu',
                'content' => 'Công dụng: Giảm đau, phòng ngừa đột quỵ...',
                'category_id' => 1,
                'quantity' => 120,
                'price' => 20000,
                'status' => '1',
                'image' => 'aspirin.jpg'
            ]
        ];

        foreach ($products as $productData) {
            $image = $productData['image'];
            unset($productData['image']);
            
            $product = Product::create($productData);

            // Create product image
            ProductImage::create([
                'product_id' => $product->id,
                'image' => $image
            ]);
        }
    }
} 