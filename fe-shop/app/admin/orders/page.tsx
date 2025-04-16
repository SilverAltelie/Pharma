'use client'
import React, {useState, useEffect} from "react";
import {
    FaCartShopping,
    FaCircleCheck,
    FaTruckFast,
    FaCircleXmark,
    FaMoneyCheck,
    FaSquarePen,
    FaXmark
} from "react-icons/fa6";
import AdminLayout from "../admin-layout";
import Link from "next/link";

type OrderItem = {
    order_id: number;
    product_name: string;
    product: {
        id: number;
        title: string;
        description: string;
        price: number;
        images: Array<{ image: string }>;
    };
    variant?: {
        name: string;
        price: number;
    };
    quantity: number;
};

type Order = {
    id: number;
    status: number;
    note?: string;
    created_at: string;
    updated_at: string;
    order_items: OrderItem[];
    user?: {
        id: string;
        name: string;
    }
};


const ProductsOrderTable = () => {
    const [groupedOrders, setGroupedOrders] = useState<Order[]>([]);
    const [isEditStatus, setIsEditStatus] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
                    }
                });
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();

                // Nhóm order_items theo order_id
                const orders = data?.data || [];
                const orderItems = data?.data?.order_items || [];

                const grouped = orders.map((order: { id: number; }) => ({
                    ...order,
                    items: orderItems.filter((item: { order_id: number; }) => item.order_id === order.id)
                }));

                setGroupedOrders(grouped);
                setLastPage(data.last_page)
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchData();
    }, [currentPage]);

    const colorStatus = (status: number) => {
        switch (status) {
            case 0:
                return "bg-gray-600"
            case 1:
                return "bg-blue-600"
            case 2:
                return "bg-yellow-600"
            case 3:
                return "bg-green-600"
            case 4:
                return "bg-red-600"
        }
    }

    const handleStatusChange = async (orderId: number, status: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/updateStatus/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    status: status
                })
            })

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();
            console.log(data);
            setIsEditStatus(false);
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const totalAmount = groupedOrders.reduce((acc: number, order: Order) => {
        const orderTotal = order.order_items.reduce((orderAcc: number, item: OrderItem) => {
            const price = item.variant ? item.variant.price : item.product.price;
            return orderAcc + (price * item.quantity);
        }, 0);
        return acc + orderTotal;
    }, 0);

    return (
        <AdminLayout>
            <div className="w-full min-h-screen p-6 bg-white overflow-x-auto">
                <h1 className="text-2xl font-bold">Lịch sử mua hàng</h1>
                <p className=" text-gray-600 mb-6">
                    Kiểm tra các đơn hàng đã mua trước đây
                </p>

                {groupedOrders.length > 0 ?
                    <div className="space-y-6 ml-20 mr-40">
                        {groupedOrders.map((order: Order, index: number) => (
                            <div key={index} className="bg-white p-6 shadow-xl rounded-lg border-2">
                                {/* Order Header */}
                                <div className="grid grid-cols-5 gap-4 border-b pb-4 text-sm text-gray-700">
                                    <div>
                                        <p className="font-semibold">Mã đơn hàng</p>
                                        <p>{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Người đặt hàng</p>
                                        <p>{order.user?.name || 'Người lạ'}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Ngày đặt hàng</p>
                                        <p>{new Date(order.created_at).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: false,
                                            timeZone: 'Asia/Ho_Chi_Minh'
                                        })}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Tổng giá trị đơn hàng</p>
                                        <p className="font-bold text-red-600">{totalAmount} VND</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Ghi chú đơn hàng</p>
                                        <p className="font-bold text-gray-900">{order.note}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mt-4 space-y-4">
                                    {order.order_items.map((item: OrderItem, index: number) => (
                                        <div key={index} className="flex gap-4">
                                            <img src={'data:image/jpeg;base64,' + item.product.images[0]?.image}
                                                 alt={item.product.title}
                                                 className="w-24 h-24 object-cover rounded"/>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <Link href={`/admin/products/${item.product.id}`}
                                                       className="font-semibold no-underline text-green-700">{item.product.title} - {item.variant?.name ?? "Không có phân loại"}</Link>

                                                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                                </div>
                                                <p className="text-gray-600 text-sm">{item.product.description}</p>
                                                <p className="font-bold text-red-600 mt-2">{item.variant ? item.variant.price * item.quantity : item.product.price * item.quantity} VND</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Delivery Status & Actions */}

                                <div className="mt-4 flex justify-between text-sm text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">Trạng thái đơn hàng:</span>
                                        <div className="relative">
                                            {!isEditStatus ?
                                                <div className="mb-4 flex items-center gap-2 text-sm text-gray-700">

                                                    {order.status == 0 && (
                                                        <div className="mt-4 flex items-center text-sm text-gray-700">
                                                            <FaCartShopping
                                                                className="flex items-center gap-1 text-gray-600 font-semibold mr-3"/>
                                                            <p className="flex items-center gap-1 text-gray-600 font-semibold mb-0">
                                                                Đã đặt hàng
                                                                lúc {new Date(order.updated_at).toLocaleDateString('vi-VN', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: false,
                                                                timeZone: 'Asia/Ho_Chi_Minh'
                                                            })}
                                                            </p>
                                                        </div>
                                                    )
                                                    }
                                                    {order.status == 1 && (
                                                        <div className="mt-4 flex items-center text-sm text-gray-700">
                                                            <FaMoneyCheck
                                                                className="flex items-center gap-1 text-indigo-600 font-semibold mr-3"/>
                                                            <p className="flex items-center gap-1 text-indigo-600 font-semibold mb-0">
                                                                Đã trả tiền
                                                                lúc {new Date(order.updated_at).toLocaleDateString('vi-VN', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: false,
                                                                timeZone: 'Asia/Ho_Chi_Minh'
                                                            })}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {order.status == 2 && (
                                                        <div className="mt-4 flex items-center text-sm text-gray-700">
                                                            <FaTruckFast
                                                                className="flex items-center gap-1 text-yellow-600 font-semibold mr-3"/>
                                                            <p className="flex items-center gap-1 text-yellow-600 font-semibold mb-0">
                                                                Đang giao hàng
                                                                lúc {new Date(order.updated_at).toLocaleDateString('vi-VN', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: false,
                                                                timeZone: 'Asia/Ho_Chi_Minh'
                                                            })}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {order.status == 3 && (
                                                        <div className="mt-4 flex items-center text-sm text-gray-700">
                                                            <FaCircleCheck
                                                                className="flex items-center gap-1 text-green-600 font-semibold mr-3"/>
                                                            <p className="flex items-center gap-1 text-green-600 font-semibold mb-0">
                                                                Đã giao hàng
                                                                lúc {new Date(order.updated_at).toLocaleDateString('vi-VN', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: false,
                                                                timeZone: 'Asia/Ho_Chi_Minh'
                                                            })}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {order.status == 4 && (
                                                        <div className="mt-4 flex items-center text-sm text-gray-700">
                                                            <FaCircleXmark
                                                                className="flex items-center gap-1 text-red-600 font-semibold mr-3"/>
                                                            <p className="flex items-center gap-1 text-red-600 font-semibold mb-0">
                                                                Đã hủy
                                                                lúc {new Date(order.updated_at).toLocaleDateString('vi-VN', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: false,
                                                                timeZone: 'Asia/Ho_Chi_Minh'
                                                            })}
                                                            </p>
                                                        </div>

                                                    )}
                                                    <button onClick={() => setIsEditStatus(!isEditStatus)} className="text-blue-600 font-semibold">
                                                        <FaSquarePen className="mr-2 size-4"/>
                                                    </button>
                                                </div>
                                                :
                                                <div className="mb-1 flex items-center gap-2 text-sm text-gray-700">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, (e.target.value))}
                                                    className={`block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${colorStatus(order.status)}`}
                                                >
                                                    <option value={'0'}>Đã đặt hàng</option>
                                                    <option value={'1'}>Đã trả tiền</option>
                                                    <option value={'2'}>Đang giao hàng</option>
                                                    <option value={'3'}>Đã giao hàng</option>
                                                    <option value={'4'}>Đã hủy</option>
                                                </select>

                                                    <button onClick={() => setIsEditStatus(!isEditStatus)} className="text-blue-600 font-semibold">
                                                        <FaXmark className="flex text-red-500 size-6 mb-1 mr-2"/>
                                                    </button>

                                                </div>
                                                    }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    : <div className="ml-80">
                        <p>Chưa có đơn hàng nào được đặt</p>
                    </div>}

                <div className="flex justify-center items-center mt-8 mb-40">
                    <div className="flex space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
                        >
                            Trước
                        </button>

                        {[...Array(lastPage)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-4 py-2 rounded ${
                                    currentPage === index + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === lastPage}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
                        >
                            Tiếp
                        </button>
                    </div>
                </div>
            </div>


        </AdminLayout>
    );
};

export default ProductsOrderTable;
