"use client";

import {FaCheckCircle, FaEdit, FaTrash} from "react-icons/fa";
import AdminLayout from "../admin-layout";
import {useState, useEffect} from "react";
import type {Permission} from "../../type";

type extendedPermission = Permission & {
    roles_count: string;
}

export default function PermissionsTable() {
    const [permissions, setPermissions] = useState<extendedPermission[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newPermissionName, setNewPermissionName] = useState("");
    const [editingPermissionId, setEditingPermissionId] = useState<number | null>(null);
    const [editedPermissionName, setEditedPermissionName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setIsClient(true);

        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/permissions`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('adminToken') || ''}`
                    }
                });

                if (res.status === 401) {
                    alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.")
                    window.location.href = "/admin/auth/login"
                    return
                }

                if (res.status === 403) {
                    alert("Bạn không có quyền truy cập vào trang này.")
                    window.location.href = "/admin/layout"
                    return
                }
                const json = await res.json();
                setPermissions(json || []);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        }

        fetchData();
    }, []);

    const handleAddPermission = async (name: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/permissions/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('adminToken') || ''}`,
                },
                body: JSON.stringify({name, display_name: displayName, description: description || ""}),
            });

            if (res.status === 403) {
                throw new Error("Bạn không có quyền thực hiện thao tác này.");
            }

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            const json = await res.json();

            setPermissions([...permissions, json]);
            setIsAdding(false);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    const handleDeletePermission = async (permissionId: number) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa vai trò này?");

        if (!isConfirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/permissions/delete/${permissionId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('adminToken') || ''}`,
                },
            });

            if (res.status === 403) {
                throw new Error("Bạn không có quyền thực hiện thao tác này.");
            }

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            setPermissions(permissions.filter(permission => permission.id !== permissionId));
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }

    const handleEditPermission = (permissionId: number) => {
        setEditingPermissionId(permissionId);
        const permissonToEdit = permissions.find(permission => permission.id === permissionId);
        setEditedPermissionName(permissonToEdit?.name || "");
        setDisplayName(permissonToEdit?.display_name || "");
        setDescription(permissonToEdit?.description || "");
    };

    const handleSaveEdit = async (permissionId: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/permissions/update/${permissionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('adminToken') || ''}`,
                },
                body: JSON.stringify({name: editedPermissionName, display_name: displayName, description: description}),
            });

            if (res.status === 403) {
                throw new Error("Bạn không có quyền thực hiện thao tác này.");
            }

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            const json = await res.json();

            setPermissions(permissions.map(permission => permission.id === permissionId ? {
                ...permission,
                name: json.name,
                display_name: json.display_name,
                description: json.description
            } : permission));
            setEditingPermissionId(null);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    if (!isClient || !permissions) {
        return <p className="text-center py-6">Đang tải dữ liệu...</p>;
    }

    return (
        <AdminLayout>
            <div className="flex h-full flex-col bg-white">
                <div className="flex justify-between items-center p-6">
                    <h2 className="text-2xl font-bold">Bảng quản lý phân quyền</h2>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-green-600 text-white px-2 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Thêm phân quyền
                    </button>
                </div>

                {isAdding && (
                    <div className="p-6">
                        <input
                            type="text"
                            value={newPermissionName}
                            onChange={(e) => setNewPermissionName(e.target.value)}
                            placeholder="Nhập tên phân quyền"
                            className="border p-2 rounded-md w-full mb-4"
                        />

                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Nhập tên hiển thị"
                            className="border p-2 rounded-md w-full mb-4"
                        />

                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả"
                            className="border p-2 rounded-md w-full mb-4"
                        />

                        <button
                            onClick={() => handleAddPermission(newPermissionName)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Lưu phân quyền
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-auto p-6">
                    {permissions.length === 0 ? (
                        <p className="text-center py-6">Không có phân quyền nào được đưa vào</p>
                    ) : (
                        <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border text-left">Tên vai trò</th>
                                <th className="p-3 border text-left">Tên hiển thị</th>
                                <th className="p-3 border text-left">Mô tả</th>
                                <th className="p-3 border text-left">Số vai trò đang giữ quyền</th>
                                <th className="p-1 border text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {permissions.map((permission, index) => (
                                <tr key={index} className="border hover:bg-gray-50">
                                    <td className="p-3 border">
                                        {editingPermissionId === permission.id ? (
                                            <input
                                                type="text"
                                                value={editedPermissionName}
                                                onChange={(e) => setEditedPermissionName(e.target.value)}
                                                className="border p-2 rounded-md w-full"
                                            />
                                        ) : (
                                            permission.name
                                        )}
                                    </td>
                                    <td className="p-3 border">{editingPermissionId === permission.id ? (
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="border p-2 rounded-md w-full"
                                        />
                                    ) : (
                                        permission.display_name
                                    )}</td>
                                    <td className="p-3 border">{editingPermissionId === permission.id ? (
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="border p-2 rounded-md w-full"
                                        />
                                    ) : (
                                        permission.description
                                    )}</td>
                                    <td className="p-3 border">{permission.roles_count ?? 0}</td>
                                    <td className="p-3 border text-center">
                                        {editingPermissionId === permission.id ? (
                                            <button
                                                onClick={() => handleSaveEdit(permission.id)}
                                                className="text-green-600 hover:text-green-800 flex text-center items-center gap-1"
                                            >
                                                <FaCheckCircle/> Lưu
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEditPermission(permission.id)}
                                                className="text-blue-600 hover:text-blue-800 flex text-center items-center gap-1"
                                            >
                                                <FaEdit/> Sửa
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeletePermission(permission.id)}
                                            className="text-red-600 hover:text-red-800 text-center flex items-center gap-1">
                                            <FaTrash/> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
