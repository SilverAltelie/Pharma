<?php

namespace App\Services\Blog;

use App\Models\Blog;

class BlogDeleteService
{
    public function handle($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();

        return response()->json([
            'message' => 'Blog deleted successfully'
        ]);
    }
}
