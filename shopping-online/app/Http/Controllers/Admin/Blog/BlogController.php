<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\BlogRequest;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Services\Blog\BlogCreateService;
use App\Services\Blog\BlogDeleteService;
use App\Services\Blog\BlogUpdateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    protected $blogCreateService;
    protected $blogUpdateService;
    protected $blogDeleteService;

    public function __construct(BlogCreateService $blogCreateService, BlogUpdateService $blogUpdateService, BlogDeleteService $blogDeleteService)
    {
        $this->blogCreateService = $blogCreateService;
        $this->blogUpdateService = $blogUpdateService;
        $this->blogDeleteService = $blogDeleteService;

        $permissions = config('permission.blog');

        foreach ($permissions as $method => $permission) {
            $this->middleware("permission:$permission")->only($method);
        }
    }

    public function index()
    {
        return BlogCategory::with(['blogs' => function($query) {
            $query->with('admin');
        }])->get();
    }

    public function store(BlogRequest $request)
    {
        $admin = Auth::guard('admin')->user();
        $data = $request->validated();
        return $this->blogCreateService->handle($admin, $data);
    }

    public function edit($id)
    {
        $blog = Blog::findOrFail($id);
        $categories = BlogCategory::all();

        return response()->json([
            'blog' => $blog,
            'categories' => $categories
        ]);
    }

    public function update(BlogRequest $request, $id)
    {
        $data = $request->validated();
        $admin = Auth::guard('admin')->user();
        return $this->blogUpdateService->handle($admin, $id, $data);
    }

    public function destroy($id)
    {
        return $this->blogDeleteService->handle($id);
    }

    public function show($id)
    {
        $blog = Blog::with(['admin', 'category'])->findOrFail($id);
        
        // Get related blogs from same category
        $relatedBlogs = Blog::where('category_id', $blog->category_id)
            ->where('id', '!=', $blog->id)
            ->with(['admin', 'category'])
            ->latest()
            ->take(3)
            ->get();

        return response()->json([
            'blog' => $blog,
            'related_blogs' => $relatedBlogs
        ]);
    }
}
