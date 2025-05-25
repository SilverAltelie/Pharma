<?php

namespace App\Http\Controllers\User\Blog;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogCategory;

class BlogController extends Controller
{
    public function index()
    {
        return BlogCategory::with(['blogs' => function($query) {
            $query->with(['admin', 'category'])->orderBy('created_at', 'desc');
        }])->get();
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