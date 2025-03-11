<?php

namespace App\Services\Admin\Category;

use App\Models\Category;

class CategoryDeleteService
{
    public function handle($id)
    {
        return Category::destroy($id);
    }
}
