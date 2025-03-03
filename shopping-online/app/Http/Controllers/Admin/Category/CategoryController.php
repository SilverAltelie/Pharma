<?php

namespace App\Http\Controllers\Admin\Category;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Category\CategoryCreateService;
use App\Http\Requests\Category\CategoryCreateRequest;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryCreateService $categoryService) {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryCreateRequest $request)
    {
        try {
            $validated = $request->validated();
            $category = $this->categoryService->handle($validated);

            return response()->json([
                'message' => 'Category created successfully',
                'data' => $category
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }




    /**
     * Display the specified resource.
     */
    public function show(CategoryController $categoryController)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CategoryController $categoryController)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CategoryController $categoryController)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CategoryController $categoryController)
    {
        //
    }
}
