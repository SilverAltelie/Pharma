<?php

namespace App\Services\Product;

use App\Models\Product;

class ProductDeleteService
{
    public function handle($id) {
        return Product::destroy($id);
    }
}
