<?php

namespace App\Http\Controllers\Admin\Category;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Category\CategoryRequest;
use App\Models\Category;
use App\Services\Category\CategoryCreateService;
use App\Services\Category\CategoryDeleteService;
use App\Services\Category\CategoryListService;
use App\Services\Category\CategoryUpdateService;

class CategoryController extends Controller
{
    protected $categoryCreateService;
    protected $categoryUpdateService;
    protected $categoryDeleteService;
    protected $categoryListService;

    public function __construct(CategoryListService $categoryListService ,CategoryCreateService $categoryCreateService, CategoryUpdateService $categoryUpdateService, CategoryDeleteService $categoryDeleteService) {
        $this->categoryListService = $categoryListService;
        $this->categoryCreateService = $categoryCreateService;
        $this->categoryUpdateService = $categoryUpdateService;
        $this->categoryDeleteService = $categoryDeleteService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return $this->categoryListService->handle();

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
    public function store(CategoryRequest $request)
    {
        try {
            $validated = $request->validated();
            $category = $this->categoryCreateService->handle($validated);

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
    public function update(CategoryRequest $request, $id)
    {
        try {
            $validated = $request->validated();
            $category = $this->categoryUpdateService->handle($validated, $id);

            return response()->json([
                'message' => 'Category updated successfully',
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        try {
            $category = $this->categoryDeleteService->handle($id);
            return response()->json([
                'message' => 'Category deleted successfully',
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
