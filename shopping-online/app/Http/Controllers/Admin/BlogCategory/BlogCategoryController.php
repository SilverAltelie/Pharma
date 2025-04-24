<?php

namespace App\Http\Controllers\Admin\BlogCategory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\BlogCategoryRequest;
use App\Models\BlogCategory;
use App\Services\Blog\Category\CategoryCreateService;
use App\Services\Blog\Category\CategoryDeleteService;
use App\Services\Blog\Category\CategoryUpdateService;
use Illuminate\Http\Request;

class BlogCategoryController extends Controller
{
    //
    protected $categoryCreateService;
    protected $categoryUpdateService;
    protected $categoryDeleteService;

    public function __construct(
        CategoryCreateService $categoryCreateService,
        CategoryUpdateService $categoryUpdateService,
        CategoryDeleteService $categoryDeleteService
    ) {
        $this->categoryCreateService = $categoryCreateService;
        $this->categoryUpdateService = $categoryUpdateService;
        $this->categoryDeleteService = $categoryDeleteService;

        $permissions = config('permission.blog_category');

        foreach ($permissions as $method => $permission) {
            $this->middleware("permission:$permission")->only($method);
        }
    }

    public function index()
    {
        //
    }

    public function store(BlogCategoryRequest $request)
    {
        $data = $request->validated();

        return $this->categoryCreateService->handle($data);
    }

    public function update($id, BlogCategoryRequest $request)
    {
        $data = $request->validated();

        return $this->categoryUpdateService->handle($id, $data);
    }

    public function destroy($id)
    {
        return $this->categoryDeleteService->handle($id);
    }
}
