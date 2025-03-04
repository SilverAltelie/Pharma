<?php

namespace App\Services\Admin\Category;

use App\Models\Category;

class CategoryUpdateService
{
    public function handle($data, $id) {
        $category = Category::find($id);

        if (!$category) {
            throw new \Exception('Category not found');
        }

        $category->update($data);
        return $category;
    }
}
