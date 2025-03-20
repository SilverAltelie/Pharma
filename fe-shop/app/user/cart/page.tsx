'use client'
import MainLayout from "@/app/_userlayout";
import {useState, useEffect} from "react";
import {FaTrash} from "react-icons/fa";
import {FaSort} from "react-icons/fa6";

export default function Cart() {
    const [data, setData] = useState<any>(null);

    const updateQuantityLocally = (itemId: number, newQuantity: number) => {
        setData((prevData: any) => {
            if (!Array.isArray(prevData)) return prevData; // Handle case where data is not an array
            return prevData.map((item: any) =>
                item.id === itemId ? {...item, quantity: newQuantity} : item
            );
        });
    };

    const updateQuantity = async (itemId: number) => {
        const item = data.find((item: any) => item.id === itemId);
        if (!item) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/updateQuantity`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({itemId, quantity: item.quantity}),
            });
            if (!res.ok) {
                throw new Error("Failed to update quantity");
            }
            await res.json();

            window.location.reload();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

  const checkout = async (itemIds: number[], quantity: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/updateAllQuantity`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
        body: JSON.stringify({itemIds, quantity}),
      });
      if (!res.ok) {
        throw new Error("Failed to update quantities");
      }
      await res.json();

      window.location.href = '/checkout';
    } catch (error) {
      console.error("Error updating quantities:", error);
    }
  };


    useEffect(() => {
        const fetchData = async () => {
            if (typeof window === 'undefined') return; // Ensure code runs only on the client-side
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

    if (!data || !Array.isArray(data)) {
        return <div>Loading... </div>;
    }

    return (
        <MainLayout>
            <div className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">Giỏ hàng</h2>
                <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {data.map((item: any, index: number) => (
                            <li key={index} className="flex py-6 items-center">
                                <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200">
                                    <img alt={item.product?.title} src={`data:image/jpeg;base64,${item.image}`}
                                         className="w-full h-full object-cover"/>
                                </div>
                                <div className="ml-4 flex flex-1 flex-col">
                                    <div
                                        className="flex justify-between items-center text-base font-medium text-gray-900">
                                        <h3>
                                            <a href={`/product/${item.product_id}`}
                                               className="hover:underline">{item['product']?.title}</a>
                                        </h3>
                                        <p className="ml-4 text-lg font-semibold">{((item['variant'] ? item['variant']?.price : item['product']?.price) * item.quantity).toLocaleString()}đ</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{item['variant']?.name}</p>
                                    <div className="flex flex-1 items-end justify-between text-sm mt-2">
                                        <div className="flex items-center">
                                            <p className="text-gray-500 mr-2">Số lượng:</p>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantityLocally(item.id, parseInt(e.target.value))}
                                                className="w-16 mb-3 border border-gray-300 rounded-md text-center"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id)}
                                                className="text-blue-500 ml-2 mb-3 hover:text-blue-700 font-medium"
                                            >
                                                <FaSort/>
                                            </button>
                                        </div>

                                        <button type="button" className="text-red-500 hover:text-red-700 font-medium">
                                            <FaTrash/>
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
                        <p>{data.reduce((total: number, item: any) => total + ((item['variant'] ? item['variant']?.price : item['product']?.price) * item.quantity), 0).toLocaleString()}đ</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Phí ship và thuế sẽ được tính ở bước thanh toán.</p>
                    <button
                        onClick={() => data.forEach((item: any) => checkout([item.id], item.quantity))}
                        className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-all">
                        Tiến hành thanh toán
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
