"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import AdminLayout from "../admin-layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "../../type";

export default function UsersTable() {
  type extendedUser = User & {
    role: string;
    address: {
      phone: string;
    };
  }
  const [users, setUsers] = useState<extendedUser[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Đánh dấu rằng component đang chạy trên Client
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
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

        const json = await res.json();
        setUsers(json || []);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    }
    fetchData();
  }, []);

  if (!isClient) {
    return <p className="text-center py-6">Đang tải dữ liệu...</p>;
  }

  const handleDelete = async (id: number) => {

    const confirm = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");

    if (!confirm) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/delete/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem('adminToken')}`,
        },
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
            throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
        }

        await res.json();

        alert('Xóa người dùng thành công');
        setUsers(users.filter((user) => parseInt(user.id) !== id));
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
  }

  return (
    <AdminLayout>
      <div className="flex h-full flex-col bg-white">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-2xl font-bold">Bảng quản lý người dùng</h2>
          <button
            onClick={() => router.push("/admin/users/create")}
            className="bg-green-600 text-white px-2 py-2 rounded-md hover:bg-green-700 transition"
          >
            Thêm người dùng
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {users.length === 0 ? (
            <p className="text-center py-6">Không có người dùng nào.</p>
          ) : (
            <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border text-left">Tên</th>
                  <th className="p-3 border text-left">Số điện thoại</th>
                  <th className="p-3 border text-left">Email</th>
                  <th className="p-3 border text-left">Chức vụ</th>
                  <th className="p-1 border text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user, index) => (
                  <tr key={index} className="border hover:bg-gray-50">
                    <td className="p-3 border">{user.name}</td>
                    <td className="p-3 border">{user.role == 'customer' ? user.address?.phone : user.phone}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border">{user.role}</td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                        className="text-blue-600 hover:text-blue-800 flex text-center items-center gap-1"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button onClick={() => handleDelete(parseInt(user.id))} className="text-red-600 hover:text-red-800 text-center flex items-center gap-1">
                        <FaTrash /> Xóa
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
