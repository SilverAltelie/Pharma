'use client'
import MainLayout from "@/app/_userlayout";
import React, { useState, useEffect } from "react";
import { FaMoneyCheck } from "react-icons/fa";
import { FaCartShopping, FaCircleCheck, FaTruckFast, FaCircleXmark } from "react-icons/fa6";
import OrderPaymentButton from "@/app/components/OrderPaymentButton";

const ProductsOrderTable = () => {

    type OrderItem = {
        id: number;
        order_id: number;
        product_name: string;
        product: {
            id: number;
            title: string;
            description: string;
            images: { image: string }[];
            price: number;
        };
        variant?: {
            id: number;
            name: string;
            price: number;
        };
        quantity: number;
    }

    type Order = {
        id: number;
        status: number;
        payment_id: number;
        order_items: OrderItem[];
        created_at: string;
        updated_at: string;
    }

    const [groupedOrders, setGroupedOrders] = useState<Order[]>([]);
    const [searchOrderId, setSearchOrderId] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const orders = await res.json();
                
                // Nhóm order_items theo order_id
                const orderItems = orders?.data?.order_items || [];
                
                const grouped = orders.data.map((order: { id: number; }) => ({
                    ...order,
                    items: orderItems.filter((item: { order_id: number; }) => item.order_id === order.id)
                }));
                
                setGroupedOrders(grouped);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fetchData();
    }, []);

    const totalAmount = groupedOrders.reduce((acc: number, order: Order) => {
        const orderTotal = order.order_items.reduce((orderAcc: number, item: OrderItem) => {
            const price = item.variant ? item.variant.price : item.product.price;
            return orderAcc + (price * item.quantity);
        }, 0);
        return acc + orderTotal;
    }, 0);

    const filteredOrders = groupedOrders.filter(order => {
        const matchesOrderId = searchOrderId === '' || order.id.toString().includes(searchOrderId);
        const matchesStatus = searchStatus === '' || order.status.toString() === searchStatus;

        return matchesOrderId && matchesStatus;
    });

    return (
        <MainLayout>
            <div className="w-screen min-h-screen p-6 bg-white">
            <h1 className="ml-80 text-2xl font-bold">Lịch sử mua hàng</h1>
            <p className="ml-80 text-gray-600 mb-6">
                Kiểm tra các đơn hàng đã mua trước đây
            </p>

                <div className="mx-80 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Tìm mã đơn hàng..."
                        className="border p-2 rounded"
                        value={searchOrderId}
                        onChange={(e) => setSearchOrderId(e.target.value)}
                    />
                    <select
                        className="border p-2 rounded bg-white"
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="0">Đã đặt hàng</option>
                        <option value="1">Đã thanh toán</option>
                        <option value="2">Đang giao</option>
                        <option value="3">Đã giao</option>
                        <option value="4">Hủy đơn</option>
                    </select>
                </div>

                {filteredOrders.length >= 0 ?
                    <div className="space-y-6 mx-80">
                    {filteredOrders.map((order: Order) => (
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
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-sm">Tổng giá trị đơn hàng</p>
                                        <p className="font-bold text-red-500">{totalAmount} VND</p>
                                    </div>
                                    <OrderPaymentButton 
                                        orderId={order.id} 
                                        paymentId={order.payment_id} 
                                        status={order.status.toString()} 
                                    />
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mt-4 space-y-4">
                                {order.order_items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <img src={'data:image/jpeg;base64,' + item.product.images[0]?.image}
                                             alt={item.product_name} className="w-24 h-24 object-cover rounded"/>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <a href={`/product/${item.product.id}`}
                                                   className="font-semibold hover:underline hover:text-green-950 text-green-800">{item.product.title} - {item.variant?.name ?? 'Không có phân loại'}</a>

                                                <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                            </div>
                                            <p className="text-gre-600 text-sm">{item.product.description}</p>
                                            <p className="font-bold text-red-500 mt-2">{item.variant ? item.variant.price * item.quantity : item.product.price * item.quantity} VND</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Delivery Status & Actions */}
                            {order.status == 0 && (
                                <div className="mt-4 flex items-center text-sm text-gray-700">
                                    <FaCartShopping
                                        className="flex items-center gap-1 text-gray-600 font-semibold mr-3"/>
                                    <p className="flex items-center gap-1 text-gray-600 font-semibold mb-0">
                                        Đã đặt hàng lúc {new Date(order.updated_at).toLocaleDateString('vi-VN', {
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
                            {order.status == 1 && (
                                <div className="mt-4 flex items-center text-sm text-gray-700">
                                    <FaMoneyCheck
                                        className="flex items-center gap-1 text-indigo-600 font-semibold mr-3"/>
                                    <p className="flex items-center gap-1 text-indigo-600 font-semibold mb-0">
                                        Đã trả tiền lúc {new Date(order.updated_at).toLocaleDateString('vi-VN', {
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
                                        Đang giao hàng lúc {new Date(order.updated_at).toLocaleDateString('vi-VN', {
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
                                        Đã giao hàng lúc {new Date(order.updated_at).toLocaleDateString('vi-VN', {
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
                                    <FaCircleXmark className="flex items-center gap-1 text-red-600 font-semibold mr-3"/>
                                    <p className="flex items-center gap-1 text-red-600 font-semibold mb-0">
                                        Đã hủy lúc {new Date(order.updated_at).toLocaleDateString('vi-VN', {
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
                        </div>
                    ))}
                </div>
                : <div className="ml-80">Không có đơn hàng nào, hãy đặt đơn đầu tiên của bạn</div>}
            </div>
            
        </MainLayout>
    );
};

export default ProductsOrderTable;
