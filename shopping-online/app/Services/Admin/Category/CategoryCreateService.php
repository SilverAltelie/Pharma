<?php

namespace App\Services\Admin\Category;

use App\Models\Category;

class CategoryCreateService
{
    public function handle($data)
    {
        return Category::create((array) $data);
    }


}
