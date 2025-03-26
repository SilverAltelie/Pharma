"use client";

import {useEffect, useState} from "react";
import {FaEdit, FaTrash, FaPlus} from "react-icons/fa";
import AdminLayout from "../admin-layout";
import {useRouter} from "next/navigation";

export default function CategoriesTable() {
    const [categories, setCategories] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
                }

                const json = await res.json();
                console.log("JSON API response:", json);

                if (!json || typeof json !== "object" || !Array.isArray(json)) {
                    throw new Error("Dữ liệu API không hợp lệ (sai định dạng)");
                }

                const rootCategories = json.filter((cat) => cat.parent_id === null);
                setCategories(rootCategories);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setCategories([]);
            }
        }

        fetchData();
    }, []);

    const CategoryRow = ({category, router, level}: any) => {
        async function deleteCategory(id: number) {
            const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa mục này");

            if (!isConfirm) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category/delete/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
                }

                setCategories((prev) => prev.filter((category) => category.id !== id));
            } catch (error) {
                console.error("Lỗi khi xóa danh mục:", error);
            }
        }

        return (
            <>
                <tr className="border hover:bg-gray-50">
                    <td className="p-3 border">{category.id}</td>
                    <td className="p-3 border pl-{level * 10}">
                        {level > 0 && <span className="text-gray-500">{"— ".repeat(level)}</span>}
                        {category.name}
                    </td>
                    <td className="p-3 border">{category.status == 1 ? "Hoạt động" : "Ẩn"}</td>
                    <td className="p-3 border">{category.totalProducts ? category.totalProducts : 0}</td>
                    <td className="p-3 border text-center">
                        <button
                            onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <FaEdit/> Sửa
                        </button>
                        <button onClick={() => deleteCategory(category.id)}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1">
                            <FaTrash/> Xóa
                        </button>
                    </td>
                </tr>

                {/* Hiển thị danh mục con (nếu có) */}
                {category.children?.length > 0 &&
                    category.children?.map((child: any) => (
                        <CategoryRow key={child.id} category={child} router={router} level={level + 1}/>
                    ))
                }
            </>
        );
    };


    return (
        <AdminLayout>
            <div className="flex h-full flex-col bg-white">
                <div className="flex justify-between items-center p-6">
                    <h2 className="text-2xl font-bold">Bảng quản lý danh mục</h2>
                    <button
                        onClick={() => router.push("/admin/categories/create")}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
                    >
                        <FaPlus/> Thêm danh mục
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {categories.length === 0 ? (
                        <p className="text-center py-6">Không có danh mục.</p>
                    ) : (
                        <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border text-left">ID</th>
                                <th className="p-3 border text-left">Danh mục</th>
                                <th className="p-3 border text-left">Trạng thái</th>
                                <th className="p-3 border text-left">Số sản phẩm</th>
                                <th className="p-3 border text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {categories.map((category) => (
                                <CategoryRow key={category.id} category={category} router={router} level={0}/>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

