"use client";

import {FaCheckCircle, FaEdit, FaTrash} from "react-icons/fa";
import AdminLayout from "../admin-layout";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {FaWebAwesome} from "react-icons/fa6";

export default function UsersTable() {
    const [roles, setRoles] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
    const [editedRoleName, setEditedRoleName] = useState("");

    const router = useRouter();

    useEffect(() => {
        setIsClient(true); // Đánh dấu rằng component đang chạy trên Client
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                if (res.status == 403) {
                    window.location.href = `/admin/permissions/cannotaccess`;
                }

                const json = await res.json();
                setRoles(json || []);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        }

        fetchData();
    }, []);

    const handleAddRole = async (name: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                },
                body: JSON.stringify({name}),
            });

            if (res.status == 403) {
                window.location.href = `/admin/permissions/cannotaccess`;
            }

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            const json = await res.json();

            setRoles([...roles, json]);
            setIsAdding(false);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    const handleDeleteRole = async (roleId: number) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa vai trò này?");

        if (!isConfirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles/delete/${roleId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('adminToken')}`,
                },
            });

            if (res.status == 403) {
                window.location.href = `/admin/permissions/cannotaccess`;
            }

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            setRoles(roles.filter(role => role.id !== roleId));
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }

    const handleEditRole = (roleId: number) => {
        setEditingRoleId(roleId);
        const roleToEdit = roles.find(role => role.id === roleId);
        setEditedRoleName(roleToEdit?.name || "");
    };

    const handleSaveEdit = async (roleId: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles/update/${roleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                },
                body: JSON.stringify({name: editedRoleName}),
            });

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            const json = await res.json();

            setRoles(roles?.map(role => role.id === roleId ? {...role, name: editedRoleName} : role));
            setEditingRoleId(null);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    if (!isClient || !roles) {
        return <p className="text-center py-6">Đang tải dữ liệu...</p>;
    }

    return (
        <AdminLayout>
            <div className="flex h-full flex-col bg-white">
                <div className="flex justify-between items-center p-6">
                    <h2 className="text-2xl font-bold">Bảng quản lý vai trò</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-green-600 text-white px-2 py-2 rounded-md hover:bg-green-700 transition"
                        >
                            Thêm vai trò
                        </button>


                    </div>
                </div>

                {isAdding && (
                    <div className="p-6">
                        <input
                            type="text"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="Nhập tên vai trò"
                            className="border p-2 rounded-md w-full mb-4"
                        />
                        <button
                            onClick={() => handleAddRole(newRoleName)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Lưu vai trò
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-auto p-6">
                    {roles?.length === 0 ? (
                        <p className="text-center py-6">Không có phân quyền nào được đưa vào</p>
                    ) : (
                        <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border text-left">Tên vai trò</th>
                                <th className="p-3 border text-left">Số người dùng</th>
                                <th className="p-3 border text-left">Số quyền sở hữu</th>
                                <th className="p-1 border text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {roles?.map((role, index) => (
                                <tr key={index} className="border hover:bg-gray-50">
                                    <td className="p-3 border">
                                        {editingRoleId === role.id ? (
                                            <input
                                                type="text"
                                                value={editedRoleName}
                                                onChange={(e) => setEditedRoleName(e.target.value)}
                                                className="border p-2 rounded-md w-full"
                                            />
                                        ) : (
                                            role.name
                                        )}
                                    </td>
                                    <td className="p-3 border">{role.admins_count ?? 0}</td>
                                    <td className="p-3 border">{role.permissions_count ?? 0}</td>
                                    <td className="p-3 border text-center">
                                        {editingRoleId === role.id ? (
                                            <button
                                                onClick={() => handleSaveEdit(role.id)}
                                                className="text-green-600 hover:text-green-800 flex text-center items-center gap-1"
                                            >
                                                <FaCheckCircle /> Lưu
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEditRole(role.id)}
                                                className="text-blue-600 hover:text-blue-800 flex text-center items-center gap-1"
                                            >
                                                <FaEdit/> Sửa
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteRole(role.id)}
                                            className="text-red-600 hover:text-red-800 text-center flex items-center gap-1">
                                            <FaTrash/> Xóa
                                        </button>
                                        <button
                                            onClick={() => router.push(`/admin/roles/${role.id}`)}
                                            className="text-yellow-600 hover:text-yellow-800 text-center flex items-center gap-1n"
                                        >
                                            <FaWebAwesome /> Chỉnh sửa quyền
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
