'use client'
import MainLayout from "@/app/_userlayout";
import { useState, useEffect } from "react";

export default function Cart() {
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
      <div className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
    </MainLayout>
  );
}
