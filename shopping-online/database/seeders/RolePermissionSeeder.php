<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Khai báo một danh sách permissions chuẩn
        $permissions = [
            // Products
            ['name' => 'product.view', 'display_name' => 'Xem sản phẩm', 'description' => 'Cho phép xem chi tiết sản phẩm'],
            ['name' => 'product.create', 'display_name' => 'Tạo mới sản phẩm', 'description' => 'Tạo mới sản phẩm'],
            ['name' => 'product.edit', 'display_name' => 'Chỉnh sửa sản phẩm', 'description' => 'Cập nhật sản phẩm'],
            ['name' => 'product.delete', 'display_name' => 'Xóa sản phẩm', 'description' => 'Xóa sản phẩm'],

            // Orders
            ['name' => 'order.view', 'display_name' => 'Xem đơn hàng', 'description' => 'Xem thông tin đơn hàng'],
            ['name' => 'order.update_status', 'display_name' => 'Cập nhật trạng thái đơn hàng', 'description' => 'Cho phép cập nhật trạng thái đơn hàng'],

            // Categories
            ['name' => 'category.view', 'display_name' => 'Xem danh mục', 'description' => 'Xem danh sách danh mục'],
            ['name' => 'category.create', 'display_name' => 'Tạo danh mục', 'description' => 'Tạo danh mục mới'],
            ['name' => 'category.edit', 'display_name' => 'Sửa danh mục', 'description' => 'Chỉnh sửa danh mục'],
            ['name' => 'category.delete', 'display_name' => 'Xóa danh mục', 'description' => 'Xóa danh mục'],

            // Promotions
            ['name' => 'promotion.view', 'display_name' => 'Xem khuyến mãi', 'description' => 'Xem danh sách khuyến mãi'],
            ['name' => 'promotion.create', 'display_name' => 'Tạo khuyến mãi', 'description' => 'Thêm mới chương trình khuyến mãi'],
            ['name' => 'promotion.edit', 'display_name' => 'Sửa khuyến mãi', 'description' => 'Chỉnh sửa chương trình khuyến mãi'],
            ['name' => 'promotion.delete', 'display_name' => 'Xóa khuyến mãi', 'description' => 'Xóa chương trình khuyến mãi'],

            // Administrators/roles
            ['name' => 'admin.view', 'display_name' => 'Xem quản trị viên', 'description' => 'Xem danh sách quản trị viên'],
            ['name' => 'admin.create', 'display_name' => 'Tạo quản trị viên', 'description' => 'Tạo mới quản trị viên'],
            ['name' => 'admin.edit', 'display_name' => 'Chỉnh sửa quản trị viên', 'description' => 'Chỉnh sửa quản trị viên'],
            ['name' => 'admin.delete', 'display_name' => 'Xóa quản trị viên', 'description' => 'Xóa quản trị viên'],

            // Users
            ['name' => 'user.view', 'display_name' => 'Xem người dùng', 'description' => 'Xem danh sách người dùng'],
            ['name' => 'user.create', 'display_name' => 'Tạo mới người dùng', 'description' => 'Thêm mới người dùng vào hệ thống'],
            ['name' => 'user.edit', 'display_name' => 'Chỉnh sửa người dùng', 'description' => 'Chỉnh sửa thông tin người dùng'],
            ['name' => 'user.delete', 'display_name' => 'Xóa người dùng', 'description' => 'Xóa tài khoản người dùng'],

            // Reviews (Đánh giá)
            ['name' => 'review.view', 'display_name' => 'Xem đánh giá', 'description' => 'Xem các đánh giá từ người dùng'],
            ['name' => 'review.manage', 'display_name' => 'Quản lý đánh giá', 'description' => 'Có quyền quản lý (duyệt, xóa) các đánh giá'],

            // Payments (Thanh toán)
            ['name' => 'payment.view', 'display_name' => 'Xem thanh toán', 'description' => 'Xem danh sách thanh toán'],
            ['name' => 'payment.manage', 'display_name' => 'Quản lý thanh toán', 'description' => 'Có quyền cập nhật tình trạng các thanh toán'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate([
                'name' => $permission['name'],
                'guard_name' => 'admin'
            ], [
                'display_name' => $permission['display_name'],
                'description' => $permission['description'],
            ]);
        }



        // tạo roles
        $adminRole = Role::updateOrCreate(['name' => 'Super Admin', 'guard_name' => 'admin']);

        $allPermissions = Permission::where('guard_name', 'admin')->pluck('id')->toArray();

        // gắn permissions vào roles
        $adminRole->syncPermissions($allPermissions);
    }
}
