'use client'

import {useEffect, useState} from "react";
import AdminLayout from "@/app/admin/admin-layout";
import {FaFloppyDisk} from "react-icons/fa6";

export default function UsersTable() {
    const [permissions, setPermissions] = useState<any[]>([]);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/permissions`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                if (res.status === 429 && retryCount < MAX_RETRIES) {
                    setRetryCount(retryCount + 1);
                    setTimeout(fetchData, 2000); // Retry after 2 seconds
                    return;
                }
                const json = await res.json();
                setPermissions(json || []);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        }

        fetchData();
    }, [retryCount]);

    return (
        <AdminLayout>
            <div className="p-6 bg-white w-full h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Lựa chọn phân quyền</h2>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg"><FaFloppyDisk /></button>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                    A list of all the users in your account including their name, title, email and role.
                </p>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                        <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="py-3 text-center px-4">Select</th>
                            <th className="py-3 px-4">Tên</th>
                            <th className="py-3 px-4">Tên hiển thị</th>
                            <th className="py-3 px-4">Mô tả</th>
                        </tr>
                        </thead>
                        <tbody>
                        {permissions?.map((permission, index) => (
                            <tr key={index} className="border-t">
                                <td className="py-2 px-4 text-center">
                                    <input type="checkbox" className="w-4 h-4"/>
                                </td>
                                <td className="py-2 px-4 font-medium">{permission.name}</td>
                                <td className="py-2 px-4 text-gray-600">{permission.display_name}</td>
                                <td className="py-2 px-4 text-gray-600">{permission.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
