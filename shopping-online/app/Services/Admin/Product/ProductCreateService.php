<?php

namespace App\Services\Admin\Product;

use App\Models\Product;

class ProductCreateService
{
    public function handle($data) {

        $images = isset($data['images']) ? array_map(fn($image) => base64_encode(file_get_contents($image)), $data['images']) : [];

        return Product::create((array) $data);
    }
}
