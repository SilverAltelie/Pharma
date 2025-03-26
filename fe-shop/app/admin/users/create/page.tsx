'use client'

import AdminLayout from '../../admin-layout'
import {useEffect, useState} from "react";

export default function UserCreate() {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const json = await res.json();
                setRoles(json || []);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        }

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!(e.currentTarget instanceof HTMLFormElement)) {
            console.error("Lỗi: e.currentTarget không phải là form");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const name = formData.get("username");
        const password = formData.get("password");
        const email = formData.get("email");
        const role_id = formData.get("role");
        const phone = formData.get("phone");
        const address = formData.get("address");
        const first_name = formData.get("first-name");
        const last_name = formData.get("last-name");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({name, password, email, role_id, phone, last_name, first_name, address})
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const json = await res.json();
            console.log('User created:', json);

            alert('Tạo người dùng thành công')
            window.location.href = '/admin/users';
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }

    return (
        <AdminLayout>
            <form onSubmit={(e) => handleSubmit(e)} className='bg-white px-20 md:px-60 lg:px-80'>
                <h2 className="font-semibold text-gray-900">Thêm người dùng</h2>

                <div className="space-y-12 px-5 mb-8 border-2 rounded-md">
                    <div className="border-b border-gray-900/10 pb-12">

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                                    Tên người dùng
                                </label>
                                <div className="mt-2">
                                    <div
                                        className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Tên người dùng"
                                            className="block w-full py-1.5 pr-3 pl-1 border-2 rounded-md text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                    Mật khẩu
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="password"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 border-2 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>

                          <div className="col-span-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                              Số điện thoại
                            </label>
                            <div className="mt-2">
                              <input
                                  id="phone"
                                  name="phone"
                                  type="text"
                                  className="block w-full rounded-md bg-white px-3 py-1.5 border-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                              />
                            </div>
                          </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    Địa chỉ email
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 border-2 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-900">
                                    Vai trò
                                </label>
                                <div className="mt-2.5">
                                    <select
                                        id="role"
                                        name="role"
                                        className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600"
                                    >
                                        {roles?.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                        <option value={'0'}>Khách hàng</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold text-gray-900">Thông tin cá nhân</h2>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-900">
                                    Họ
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="first-name"
                                        name="first-name"
                                        type="text"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md bg-white px-3 border-2 py-1.5 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-900">
                                    Tên
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="last-name"
                                        name="last-name"
                                        type="text"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md bg-white px-3 border-2 py-1.5 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>



                            <div className="col-span-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-900">
                                    Địa chỉ đường
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        autoComplete="address"
                                        className="block w-full rounded-md border-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-4 flex gap-4">
                        <button type="button"
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">Hủy
                        </button>
                        <button type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">Lưu
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}
