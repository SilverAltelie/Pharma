'use client'

import {useEffect, useState} from "react";
import AdminLayout from "@/app/admin/admin-layout";
import {FaFloppyDisk} from "react-icons/fa6";
import {useParams, useRouter} from "next/navigation";
import type {Permission, Role} from "@/app/type";

export default function RolePermissionsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    useEffect(() => {
        async function fetchPermissions() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/permissions`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
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

                const data = await res.json();
                setPermissions(data || []);

                // Fetch current permissions of role
                const roleRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
                    }
                });

                if (roleRes.status === 401) {
                    alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.")
                    window.location.href = "/admin/auth/login"
                    return
                }

                if (roleRes.status === 403) {
                    alert("Bạn không có quyền truy cập vào trang này.")
                    window.location.href = "/admin/layout"
                    return
                }

                const rolesData = await roleRes.json();
                const currentRole = rolesData.find((role: Role) => role.id.toString() === params.id);
                const currentPermissions = currentRole?.permissions.map((perm: Permission) => perm.id.toString()) || [];
                setSelectedPermissions(currentPermissions);
            } catch (error) {
                console.error("Lỗi lấy permissions:", error);
            }
        }

        fetchPermissions();
    }, [params.id]);

    const handleCheckboxChange = (permissionId: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPermissions.length === permissions.length) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(permissions.map(p => p.id.toString()));
        }
    };

    const handleGroupSelectAll = (groupPermissions: Permission[]) => {
        const groupIds = groupPermissions.map(p => p.id.toString());
        const allSelected = groupIds.every(id => selectedPermissions.includes(id));
        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !groupIds.includes(id)));
        } else {
            setSelectedPermissions(prev => Array.from(new Set([...prev, ...groupIds])));
        }
    };

    const handleSubmitPermissions = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles/addPermission/${params.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({permissions: selectedPermissions})
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

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status}`);
            }

            await res.json();
            alert("Đã cập nhật phân quyền thành công!");

            // Optional: redirect or do something
            router.push('/admin/roles');
        } catch (error) {
            console.error("Có lỗi khi cập nhật permissions:", error);
        }
    };

    const groupedPermissions = permissions.reduce((acc, permission) => {
        const group = permission.name.split('.')[0];
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <AdminLayout>
            <div className="p-6 bg-white w-full h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Phân quyền cho vai trò</h2>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center text-sm">
                            <input
                                type="checkbox"
                                className="mr-2"
                                onChange={handleSelectAll}
                                checked={selectedPermissions.length === permissions.length}
                            />
                            Chọn tất cả
                        </label>
                        <button
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                            onClick={handleSubmitPermissions}
                        >
                            <FaFloppyDisk/>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
                        <div key={group} className="mb-6">
                            <h3 className="text-md font-bold mb-2 capitalize">{group}</h3>
                            <label className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={() => handleGroupSelectAll(groupPermissions)}
                                    checked={groupPermissions.every(p => selectedPermissions.includes(p.id.toString()))}
                                />
                                Chọn tất cả trong nhóm
                            </label>
                            <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                                <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="py-3 text-center px-4">Chọn</th>
                                    <th className="py-3 px-4">Tên</th>
                                    <th className="py-3 px-4">Tên hiển thị</th>
                                    <th className="py-3 px-4">Mô tả</th>
                                </tr>
                                </thead>
                                <tbody>
                                {groupPermissions.map((permission) => (
                                    <tr key={permission.id} className="border-t">
                                        <td className="py-2 px-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedPermissions.includes(permission.id.toString())}
                                                onChange={() => handleCheckboxChange(permission.id.toString())}
                                            />
                                        </td>
                                        <td className="py-2 px-4">{permission.name}</td>
                                        <td className="py-2 px-4">{permission.display_name ?? '-'}</td>
                                        <td className="py-2 px-4">{permission.description ?? '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}