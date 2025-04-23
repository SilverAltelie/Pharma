"use client";

import {useEffect, useState, useRef} from "react";
import {FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronRight, FaCheckCircle} from "react-icons/fa";
import AdminLayout from "../admin-layout";
import {useRouter} from "next/navigation";
import Image from 'next/image';
import {FaCircleXmark} from "react-icons/fa6";

interface Blog {
    id: number;
    title: string;
    thumbnail: string;
    updated_at: string;
    admin: {
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
    blogs: Blog[];
}

interface PaginatedResponse {
    current_page: number;
    data: Category[];
    // ... các trường phân trang khác
}

export default function CategoriesTable() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("http://localhost:8000/api/admin/blogs", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem("adminToken")}`,
                    }
                });

                if (!res.ok) {
                    throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
                }

                const json: PaginatedResponse = await res.json();
                console.log("JSON API response:", json);

                if (!json?.data) {
                    throw new Error("Dữ liệu API không hợp lệ");
                }

                setCategories(json.data);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setCategories([]);
            }
        }

        fetchData();
    }, []);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return alert("Vui lòng nhập tên danh mục");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blog-categories/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify({ name: newCategoryName }),
            });

            if (!res.ok) throw new Error(`Lỗi API: ${res.statusText}`);

            const newCat = await res.json();
            setCategories(prev => [...prev, { ...newCat, blogs: [] }]);
            setNewCategoryName("");
            setIsAdding(false);
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error);
        }
    };
    const handleUpdateCategoryName = async (categoryId: number, value: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blog-categories/update/${categoryId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify({name: value}),
            });

            if (!res.ok) throw new Error("Lỗi khi cập nhật danh mục");

            setCategories(prev =>
                prev.map(cat => cat.id === categoryId ? {...cat, name: editingCategoryName} : cat)
            );
            setEditingCategoryId(null);

            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        }
    };


    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleDeleteBlog = async (blogId: number) => {
        const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa bài viết này");

        if (!isConfirm) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blog/delete/${blogId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("adminToken")}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            setCategories((prev) => prev.map(category => ({
                ...category,
                blogs: category.blogs.filter(blog => blog.id !== blogId)
            })));
        } catch (error) {
            console.error("Lỗi khi xóa bài viết:", error);
        }
    }

    const CategoryRow = ({category}: { category: Category }) => {
        const isExpanded = expandedCategories.includes(category.id);
        const [localEditingName, setLocalEditingName] = useState(category.name);

        useEffect(() => {
            if (editingCategoryId === category.id) {
                setLocalEditingName(category.name);
            }
        }, [editingCategoryId, category.name]);

        async function deleteCategory(id: number) {
            const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa mục này");

            if (!isConfirm) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blog-categories/delete/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("adminToken")}`,
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
                <tr className="border hover:bg-blue-50 transition-colors">
                    <td className="p-3 border">{category.id}</td>
                    <td className="p-3 border">
                        {editingCategoryId === category.id ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    value={localEditingName}
                                    onChange={(e) => setLocalEditingName(e.target.value)}
                                    className="border px-2 py-1 rounded"
                                />

                                <button
                                    onClick={() => handleUpdateCategoryName(category.id, localEditingName)}
                                    className="text-green-600 hover:text-green-800"
                                >
                                    <FaCheckCircle />
                                </button>

                                <button
                                    onClick={() => setEditingCategoryId(null)}
                                    className="text-gray-600 hover:text-gray-800"
                                    title="Hủy"
                                >
                                    <FaCircleXmark className={'text-red-700'}/>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="flex items-center gap-2 w-full hover:text-blue-600"
                            >
                                {isExpanded ? <FaChevronDown/> : <FaChevronRight/>}
                                {category.name}
                                <span className="text-gray-500 text-sm ml-2">
                                    ({category.blogs?.length || 0} bài viết)
                                </span>
                            </button>
                        )}
                    </td>

                    <td className="p-3 border text-center">
                        <button
                            onClick={() => {
                                setEditingCategoryId(category.id);
                                setEditingCategoryName(category.name)
                            }}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
                        >
                            <FaEdit /> Sửa
                        </button>

                        <button
                            onClick={() => deleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                            <FaTrash/> Xóa
                        </button>
                    </td>
                </tr>
                {isExpanded && category.blogs && category.blogs.length > 0 && (
                    <tr>
                        <td colSpan={3} className="p-0">
                            <div className="bg-gray-50 p-4">
                                <div className="flex flex-col space-y-4 ml-4">
                                    {category.blogs.map(blog => (
                                        <div
                                            key={blog.id}
                                            className="flex items-center justify-between gap-4 bg-white p-3 rounded-lg hover:shadow-md transition-shadow border"
                                        >
                                            <div
                                                className="flex items-center gap-4 flex-1 cursor-pointer"
                                                onClick={() => router.push(`/admin/blog/edit/${blog.id}`)}
                                            >
                                                <div
                                                    className="w-24 h-24 relative flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                                                    {blog.thumbnail ? (
                                                        <Image
                                                            src={`data:image/jpeg;base64,${blog.thumbnail}`}
                                                            alt={blog.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-400">No image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div
                                                        className="text-lg text-gray-600 group-hover:text-blue-600 truncate">
                                                        {blog.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Cập
                                                        nhật lần cuối vào: {new Date(blog.updated_at).toLocaleString('vi-VN')} bởi {blog.admin.name}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0 flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/blog/edit/${blog.id}`)}
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded-md border border-blue-200 text-sm"
                                                >
                                                    <FaEdit/> Sửa
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Ngăn click vào div cha
                                                        handleDeleteBlog(blog.id);
                                                    }}
                                                    className="text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 rounded-md border border-red-200 text-sm"
                                                >
                                                    <FaTrash/> Xóa
                                                </button>
                                            </div>
                                        </div>

                                    ))}
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </>
        );
    };

    return (
        <AdminLayout>
            <div className="flex h-full flex-col bg-white">
                <div className="flex justify-between items-center p-6">
                    <h2 className="text-2xl font-bold">Quản lý danh mục bài viết</h2>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
                    >
                        <FaPlus/> Thêm danh mục
                    </button>
                </div>

                {isAdding && (<div className="flex items-center space-x-2 mb-6 ml-6">
                    <input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Nhập tên danh mục mới..."
                        className="border px-3 py-2 rounded w-1/3"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Thêm danh mục
                    </button>
                </div>)}


                <div className="flex-1 overflow-auto p-6">
                    {categories.length === 0 ? (
                        <p className="text-center py-6">Không có danh mục nào.</p>
                    ) : (
                        <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border text-left w-20">ID</th>
                                <th className="p-3 border text-left">Tên danh mục</th>
                                <th className="p-3 border text-center w-32">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {categories.map(category => (
                                <CategoryRow key={category.id} category={category} />
                            ))}

                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}