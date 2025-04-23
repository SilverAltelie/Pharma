<?php

namespace App\Services\Blog\Category;

use App\Models\BlogCategory;

class CategoryUpdateService
{
    public function handle($id, $data)
    {
        $category = BlogCategory::findOrFail($id);
        $category->update($data);

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category
        ]);
    }
}
