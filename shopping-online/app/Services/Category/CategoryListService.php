<?php

namespace App\Services\Category;

use App\Models\Category;

class CategoryListService
{
    public function handle()
    {
        return Category::with('children')->where('parent_id', null)->get();
    }
}
