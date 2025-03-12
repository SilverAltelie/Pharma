<?php

namespace App\Services\Category;

use App\Models\Category;

class CategoryDeleteService
{
    public function handle($id)
    {
        return Category::destroy($id);
    }
}
