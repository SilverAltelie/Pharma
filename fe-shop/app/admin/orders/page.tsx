'use client'
import MainLayout from "@/app/_userlayout";
import React, {useState, useEffect} from "react";
import {
    FaCartShopping,
    FaCircleCheck,
    FaTruckFast,
    FaCircleXmark,
    FaMoneyCheck,
    FaSquarePen,
    FaCrossedSquares,
    FaXmark
} from "react-icons/fa6";
import AdminLayout from "../admin-layout";

const ProductsOrderTable = () => {
    const [groupedOrders, setGroupedOrders] = useState<any>([]);
    const [isEditStatus, setIsEditStatus] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/`);
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();

                // Nhóm order_items theo order_id
                const orders = data?.data || [];
                const orderItems = data?.data?.order_items || [];

                const grouped = orders.map((order: { id: any; }) => ({
                    ...order,
                    items: orderItems.filter((item: { order_id: any; }) => item.order_id === order.id)
                }));

                setGroupedOrders(grouped);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchData();
    }, []);

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

    const handleStatusChange = async (orderId: number, status: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/updateStatus/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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

    const totalAmount = groupedOrders.reduce((acc: number, order: any) => {
        const orderTotal = order.order_items.reduce((orderAcc: number, item: any) => {
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
                        {groupedOrders.map((order: {
                            id: number;
                            status: number;
                            items: any[],
                            created_at: string,
                            updated_at: string,
                            totalAmount: number
                        }, index: number) => (
                            <div key={order.id} className="bg-white p-6 shadow-xl rounded-lg border-2">
                                {/* Order Header */}
                                <div className="grid grid-cols-3 gap-4 border-b pb-4 text-sm text-gray-700">
                                    <div>
                                        <p className="font-semibold">Mã đơn hàng</p>
                                        <p>{order.id}</p>
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
                                </div>

                                {/* Order Items */}
                                <div className="mt-4 space-y-4">
                                    {order.order_items.map((item: any, index: number) => (
                                        <div key={index} className="flex gap-4">
                                            <img src={'data:image/jpeg;base64,' + item.product.images[0].image}
                                                 alt={item.product_name}
                                                 className="w-24 h-24 object-cover rounded"/>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <a href={`/admin/products/${item.product.id}`}
                                                       className="font-semibold no-underline text-green-700">{item.product.title} - {item.variant?.name ?? "Không có phân loại"}</a>

                                                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                                </div>
                                                <p className="text-gray-600 text-sm">{item.product.desciption}</p>
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
                                                    onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                                                    className={`block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${colorStatus(order.status)}`}
                                                >
                                                    <option value={0}>Đã đặt hàng</option>
                                                    <option value={1}>Đã trả tiền</option>
                                                    <option value={2}>Đang giao hàng</option>
                                                    <option value={3}>Đã giao hàng</option>
                                                    <option value={4}>Đã hủy</option>
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
            </div>


        </AdminLayout>
    );
};

export default ProductsOrderTable;
