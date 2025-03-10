<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Tạo 10 user giả lập
        // User::factory(10)->create();

        // Tạo dữ liệu cho bảng categories
        Category::insert([
            ['id' => 1, 'name' => 'Thuốc giảm đau', 'description' => 'Morphine các loại', 'status' => '1'],
            ['id' => 2, 'name' => 'Kháng sinh', 'description' => 'Phòng ngừa các loại bệnh', 'status' => '1'],
            ['id' => 11, 'name' => 'Paracetamol', 'description' => 'Thuốc đau đầu', 'status' => '1', 'parent_id' => 1], 
            ['id' => 12, 'name' => 'Ibuprofen', 'description' => 'Thuốc giảm đau', 'status' => '0', 'parent_id' => 1],
            ['id' => 21, 'name' => 'Amoxicillin', 'description' => 'Kháng sinh loại A', 'status' => '0', 'parent_id' => 2],
            ['id' => 22, 'name' => 'Azithromycin', 'description' => 'Kháng sinh loại B', 'status' => '1', 'parent_id' => 2],
        ]);
    }
}
