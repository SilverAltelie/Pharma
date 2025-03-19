'use client'

import MainLayout from '@/app/_userlayout'
import {BuildingStorefrontIcon} from '@heroicons/react/24/outline'
import {useState, useEffect} from 'react'

export default function Address() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();
                setData(data);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchData();
    }, []);

    async function handleDeleteAddress(id: number) {

        const confirm = window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?");

        if (!confirm) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/delete/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();
            console.log(data);
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        }

    }

    async function handleSetDefaultAddress(id: number) {

        const confirm = window.confirm("Bạn có chắc chắn muốn đặt địa chỉ này làm mặc định không?");

        if (!confirm) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/setDefault/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();
            console.log(data);
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <MainLayout>
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base/7 font-semibold text-green-600">Vận chuyển nhanh hơn</h2>
                        <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
                            Địa chỉ nhận hàng
                        </p>
                        <p className="mt-6 text-lg/8 text-gray-600">
                            Giao hàng siêu tốc, chỉ trong vòng 24h đối với khách hàng tại Hà Nội và trong vòng 7 ngày
                            đối với các tỉnh thành khác. Đảm bảo hàng hóa chất lượng, đúng mẫu mã, đúng giá.
                        </p>
                    </div>
                    <div className="mx-auto mt-20 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            {data?.addresses?.map((address: any) => (
                                <div key={address.id} className="relative pl-16">
                                    <div className="absolute top-0 right-0 flex space-x-2">
                                        {!(address.is_default == 1) && (
                                            <button
                                                className="flex-none rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
                                                onClick={() => handleSetDefaultAddress(address.id)}
                                            >
                                                Đặt mặc định
                                            </button>
                                        )}
                                    </div>
                                    <dt className="text-base/7 font-semibold text-gray-900">
                                        <div
                                            className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-green-600">
                                            <BuildingStorefrontIcon aria-hidden="true" className="size-6 text-white"/>
                                        </div>
                                        {address.address} {address.is_default == 1 &&
                                        <span className="text-green-600 font-semibold">(Mặc định)</span>}
                                    </dt>
                                    <dd className="mt-2 text-base/7 text-gray-600">{address?.first_name}</dd>
                                    <dd className="mt-2 text-base/7 text-gray-600">{address?.phone}</dd>
                                    <dd className="mt-2 text-base/7 text-gray-600">{address?.email}</dd>
                                    <dd className="mt-2 text-base/7 text-gray-600">{address?.number}</dd>
                                    <dd className="mt-3 text-base/7 text-gray-600">
                                        <div className="flex space-x-2">
                                            <a
                                                href={`/user/addresses/edit/${address.id}`}
                                                className="flex-none rounded-md bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-green-800"
                                            >
                                                Sửa địa chỉ
                                            </a>
                                            <button
                                                className="flex-none rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-red-700"
                                                onClick={() => handleDeleteAddress(address.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </dd>
                                </div>
                            ))}

                            {/* Hiển thị nút Thêm Địa Chỉ nếu có ít hơn 2 địa chỉ */}
                            {data?.addresses?.length < 2 && (
                                <div className="relative pl-16">
                                    <dt className="text-base/7 font-semibold text-gray-900">
                                        <div
                                            className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-gray-400">
                                            <BuildingStorefrontIcon aria-hidden="true" className="size-6 text-white"/>
                                        </div>
                                        <span className="text-gray-600">Chưa có địa chỉ</span>
                                    </dt>
                                    <dd className="mt-3 text-base/7 text-gray-600">
                                        <a
                                            href="/user/addresses/create"
                                            className="flex-none rounded-md bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-green-800"
                                        >
                                            Thêm địa chỉ mới
                                        </a>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                </div>
            </div>
        </MainLayout>
    )
}
