<?php

namespace App\Services\Blog\Category;

use App\Models\BlogCategory;

class CategoryCreateService
{
    public function handle($data)
    {
        $category = BlogCategory::create($data);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ]);
    }
}
