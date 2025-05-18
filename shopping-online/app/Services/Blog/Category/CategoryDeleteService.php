<?php

namespace App\Services\Blog\Category;

use App\Models\BlogCategory;

class CategoryDeleteService
{
    public function handle($id)
    {
        $category = BlogCategory::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}
