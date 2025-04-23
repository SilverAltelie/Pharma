<?php

namespace App\Services\Blog;

use App\Models\Blog;

class BlogUpdateService
{
    public function handle($admin, $id, array $data)
    {
        $blog = Blog::findOrFail($id);

        // Kiểm tra xem có thumbnail mới hay không
        if (!empty($data['thumbnail']) && str_starts_with($data['thumbnail'], '/9j/')) {
            // Decode dữ liệu base64 nếu có hình ảnh mới
            $imageData = base64_decode($data['thumbnail']);
            $blog->thumbnail = $imageData;
        } elseif (!array_key_exists('thumbnail', $data)) {
            // Nếu không có trường 'thumbnail', giữ nguyên giá trị cũ
            $data['thumbnail'] = $blog->thumbnail;
        }

        // Cập nhật dữ liệu
        $blog->update([
            'title' => $data['title'],
            'content' => $data['content'],
            'thumbnail' => $data['thumbnail'], // Dùng thumbnail đã xử lý
            'category_id' => $data['category_id'] ?? $blog->category_id,
            'admin_id' => $admin->id,
        ]);

        return response()->json($blog, 200);
    }
}
