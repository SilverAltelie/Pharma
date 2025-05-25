<?php

namespace App\Http\Controllers\User\Category;

use App\Http\Controllers\Controller;
use App\Services\Category\CategoryShowService;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    protected $categoryShowService;

    public function __construct(CategoryShowService $categoryShowService){
        $this->categoryShowService = $categoryShowService;
    }

    public function index()
    {
        // Get all parent categories with their children
        $categories = Category::with(['children' => function($query) {
            $query->where('status', '1'); // Only active children
        }])
        ->whereNull('parent_id') // Get only parent categories
        ->where('status', '1') // Only active parents
        ->get()
        ->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'children' => $category->children->map(function ($child) {
                    return [
                        'id' => $child->id,
                        'name' => $child->name,
                        'parent_id' => $child->parent_id
                    ];
                })
            ];
        });

        return response()->json($categories);
    }

    public function show($id)
    {
        return $this->categoryShowService->handle($id);
    }
}
