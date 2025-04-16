'use client'

import MainLayout from '@/app/_userlayout'
import {useEffect, useState} from 'react'
import {MapIcon} from '@heroicons/react/20/solid'
import type {User, Address} from "@/app/type";

export default function Profile() {

    /*type Address = {
        id: string;
        first_name: string;
        last_name: string;
        address: string;
        phone: string;
        is_default: string;
    }

    type User = {
        id: string;
        name: string;
        email: string;
        addresses: Address[];
    }*/

    const [user, setUser] = useState<User>();

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`http://localhost:8000/api/user/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();
                setUser(data);

            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchData();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    const defaultAddress = user?.addresses?.find((address: Address) => address.is_default == 1);

    return (
        <MainLayout>
            <div className="mt-[160px] px-4 sm:px-0">
                <h1 className="text-center mt-6 font-semibold text-gray-900">Thông tin cá nhân</h1>
            </div>
            <div className="mt-10 ml-[200px] border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Tên đầy đủ</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{user.name}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/10 font-medium text-gray-900">Email</dt>
                        <dd className="mt-1 text-sm/10 text-gray-700 sm:col-span-2 sm:mt-0">{user.email}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/10 font-medium text-gray-900">Số điện thoại</dt>
                        <dd className="mt-1 text-sm/10 text-gray-700 sm:col-span-2 sm:mt-0">{defaultAddress?.phone}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">Địa chỉ</dt>
                        <dd className="sm:col-span-2">
                            {user?.addresses?.length > 0 ? (
                                <ul className="space-y-2">
                                    {user?.addresses?.map((address: Address, index: number) => (
                                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                                            <MapIcon className="size-5 text-green-500"/>
                                            <span>{`${address.first_name} ${address.last_name}, ${address.address}`}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-sm text-gray-700">Chưa có</span>
                            )}
                        </dd>
                    </div>
                </dl>
            </div>
        </MainLayout>
    )
}
