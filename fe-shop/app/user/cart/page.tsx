'use client'
import MainLayout from "@/app/_userlayout";
import { useState, useEffect } from "react";

export default function Cart() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
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
    };
    fetchData();
  }, []);

  async function handleAddToCart($product_id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/addProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({product_id: $product_id, quantity: 1}),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      console.log(data);
      alert('Thêm sản phẩm vào giỏ hàng thành công');
      setData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (!data) {
    return <div>Loading... </div>;
  }

  return (
    <MainLayout>
      <div className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">Giỏ hàng</h2>
        <div className="flow-root">
          <ul role="list" className="-my-6 divide-y divide-gray-200">
            {data.map((item: any) => (
              <li key={item.id} className="flex py-6 items-center">
                <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200">
                  <img alt={item.product.title} src={`data:image/jpeg;base64,${item['product'].image}`} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div className="flex justify-between items-center text-base font-medium text-gray-900">
                    <h3>
                      <a href={`/product/${item.product_id}`} className="hover:underline">{item['product'].title}</a>
                    </h3>
                    <p className="ml-4 text-lg font-semibold">{item['variant']? item['variant'].price : item['product'].price}đ</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.variant_name}</p>
                  <div className="flex flex-1 items-end justify-between text-sm mt-2">
                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
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
