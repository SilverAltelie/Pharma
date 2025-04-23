<?php

namespace App\Services\Blog;

use App\Models\Blog;
use Illuminate\Support\Facades\Storage;

class BlogCreateService
{
    public function handle($admin, array $data)
    {
        // Kiểm tra xem có hình ảnh trong dữ liệu không
        $thumbnail = null;
        if (!empty($data['thumbnail'])) {
            // Sử dụng trực tiếp chuỗi base64
            $thumbnail = $data['thumbnail'];
        }

        // Tạo bài viết mới với dữ liệu
        $blog = Blog::create([
            'title' => $data['title'],
            'content' => $data['content'],
            'thumbnail' => $thumbnail, // Lưu trực tiếp base64
            'category_id' => $data['category_id'],
            'admin_id' => $admin->id,
        ]);

        return response()->json($blog, 201);
    }
}
