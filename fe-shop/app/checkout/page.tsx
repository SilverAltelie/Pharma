'use client'

import { ChevronDownIcon } from '@heroicons/react/16/solid';
import MainLayout from '@/app/_userlayout';
import { useState, useEffect } from "react";

export default function CheckOut() {

  const [data, setData] = useState<any>(null);
  
    useEffect(() => {
      async function fetchData() {
        try {
          const res = await fetch("/api/data");
          const json = await res.json();
          setData(json);
        } catch (error) {
          console.error("Lỗi khi gọi API: ", error);
        }
      }
      fetchData();
    }, []);

    return (
      <MainLayout>
        <div className='ml-9 mr-9 mt-8 mb-8'>
        <div className="flex justify-center gap-8 mt-[200px]">
          {/* Form nhập địa chỉ */}
          <div className="mr-8 w-1/2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900">Thêm địa chỉ</h2>
            <p className="mt-1 text-sm text-gray-600">Nhập thông tin địa chỉ để chúng tôi có thể phục vụ bạn tốt hơn.</p>
    
            <form className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ</label>
                  <input type="text" className={inputField} placeholder="Nhập họ của bạn" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên</label>
                  <input type="text" className={inputField} placeholder="Nhập tên của bạn" />
                </div>
              </div>
    
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className={inputField} placeholder="example@gmail.com" />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input type="text" className={inputField} placeholder="Số nhà, tên đường..." />
              </div>
    
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thành phố</label>
                  <input type="text" className={inputField} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tỉnh / Bang</label>
                  <input type="text" className={inputField} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã bưu điện</label>
                  <input type="text" className={inputField} />
                </div>
              </div>
    
              <div className="flex justify-end gap-4">
                <button type="button" className={btnCancel}>Hủy</button>
                <button type="submit" className={btnSubmit}>Lưu</button>
              </div>
            </form>
          </div>
    
          {/* Giỏ hàng */}
          <div className="ml-8 w-1/2 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">Giỏ hàng</h2>
            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {data?.cartItems?.map((product: any) => (
                  <li key={product.id} className="flex py-6 items-center">
                    <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200">
                      <img alt={product.imageAlt} src={product.imageSrc} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between items-center text-base font-medium text-gray-900">
                        <h3>
                          <a href={product.href} className="hover:underline">{product.product_name}</a>
                        </h3>
                        <p className="ml-4 text-lg font-semibold">{product.price}đ</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{product.variant_name}</p>
                      <div className="flex flex-1 items-end justify-between text-sm mt-2">
                        <p className="text-gray-500">Số lượng: {product.quantity}</p>
                        <button type="button" className="text-red-500 hover:text-red-700 font-medium">
                          Xóa
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-gray-200 mt-6 pt-4">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <p>Tổng cộng</p>
                <p>{data?.cartTotal || "0"}đ</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">Phí ship và thuế sẽ được tính ở bước thanh toán.</p>
              <button className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-all">
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
        </div>
      </MainLayout>
    );
    
}

// CSS Utility Classes (Tailwind)
const inputField = "w-full mt-2 p-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none";
const btnCancel = "px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100 transition";
const btnSubmit = "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition";
