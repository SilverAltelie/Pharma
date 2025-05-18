<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\BlogCategory;

class BlogCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Tin tức',
            'Khuyến mãi',
            'Hướng dẫn sử dụng',
            'Tin tức thị trường',
        ];

        foreach ($categories as $category) {
            BlogCategory::create([
                'name' => $category,
            ]);
        }
    }
}
