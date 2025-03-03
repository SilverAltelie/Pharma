'use client'

import MainLayout from '@/app/_userlayout'
import {BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

export default function CreateAddress() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/data");
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
            Giao hàng siêu tốc, chỉ trong vòng 24h đối với khách hàng tại Hà Nội và trong vòng 7 ngày đối với các tỉnh thành khác. Đảm bảo hàng hóa chất lượng, đúng mẫu mã, đúng giá.
          </p>
        </div>
        <div className="mx-auto mt-20 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
  <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
    {data?.addresses?.map((address: any) => (
      <div key={address.id} className="relative pl-16">
        <dt className="text-base/7 font-semibold text-gray-900">
          <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-green-600">
            <BuildingStorefrontIcon aria-hidden="true" className="size-6 text-white" />
          </div>
          {address.address}
        </dt>
        <dd className="mt-2 text-base/7 text-gray-600">{data?.user?.name}</dd>
        <dd className="mt-2 text-base/7 text-gray-600">{data?.user?.email}</dd>
        <dd className="mt-2 text-base/7 text-gray-600">{data?.user?.number}</dd>
        <dd className="mt-3 text-base/7 text-gray-600">
          <a
            href={`/user/addresses/edit/${address.id}`}
            className="flex-none rounded-md bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-green-800"
          >
            Sửa địa chỉ
          </a>
        </dd>
      </div>
    ))}
    
    {/* Hiển thị nút Thêm Địa Chỉ nếu có ít hơn 2 địa chỉ */}
    {data?.addresses?.length < 2 && (
      <div className="relative pl-16">
        <dt className="text-base/7 font-semibold text-gray-900">
          <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-gray-400">
            <BuildingStorefrontIcon aria-hidden="true" className="size-6 text-white" />
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
