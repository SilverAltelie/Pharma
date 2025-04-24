'use client'

import AdminLayout from '@/app/admin/admin-layout'
import { use, useEffect, useState } from 'react';
import type { User, Role } from '@/app/type';

export default function UserCreate( { params}: {params: Promise<{id: string}>} ) {

    type ExtendedUser = User & {
        address: {
            first_name: string;
            last_name: string;
            address: string;
            phone: string;
        };
        role_id: number;
    };

    type Data = {
        user : ExtendedUser;
        roles: Role[];
    }



    const {id} = use(params);
    const [data, setData] = useState<Data>();

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/edit/${id}`, {
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

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const json = await res.json();
                setData(json || []);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        }

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        const first_name = formData.get("first-name");
        const last_name = formData.get("last-name");
        const address = formData.get("address");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/update/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    name, password, email, role_id, phone, first_name, last_name, address
                }),
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

            const json = await res.json();
            console.log("API response:", json);

            alert('Cập nhật người dùng thành công');
            window.location.href = '/admin/users';
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <AdminLayout>
            <form onSubmit={(e) => handleSubmit(e)} className='bg-white px-80'>
                <h2 className="font-semibold text-gray-900">Cập nhật người dùng</h2>

                <div className="space-y-12 px-5 mb-8 border-2 rounded-md">
                    <div className="border-b border-gray-900/10 pb-12">

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                    Tên người dùng
                                </label>
                                <div className="mt-2">
                                    <div
                                        className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <div
                                            className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                        <input
                                            defaultValue={data?.user?.name}
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Tên người dùng"
                                            className="block min-w-0 grow py-1.5 pr-3 border-2 rounded-md pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                        Mật khẩu
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            defaultValue={data?.user?.password}
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
                                            defaultValue={data?.user?.phone}
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
                                            defaultValue={data?.user?.email}
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
                                            defaultValue={data?.user?.role_id ?? '0'}
                                            id="role"
                                            name="role"
                                            className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600"
                                        >
                                            {data?.roles?.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                            <option value={'0'}>Khách hàng</option>
                                        </select>
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-gray-900">Thông tin cá nhân</h2>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                                    Họ
                                </label>
                                <div className="mt-2">
                                    <input
                                        defaultValue={data?.user?.address?.first_name}
                                        id="first-name"
                                        name="first-name"
                                        type="text"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md bg-white px-3 border-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                                    Tên
                                </label>
                                <div className="mt-2">
                                    <input
                                        defaultValue={data?.user?.address?.last_name}
                                        id="last-name"
                                        name="last-name"
                                        type="text"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md bg-white px-3 border-2 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                                    Địa chỉ đường
                                </label>
                                <div className="mt-2">
                                    <input
                                        defaultValue={data?.user?.address?.address}
                                        id="address"
                                        name="address"
                                        type="text"
                                        autoComplete="address"
                                        className="block w-full rounded-md border-2 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="my-4 flex justify-end gap-4">
                        <button type="button"
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">Hủy
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
