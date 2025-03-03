'use client'
import MainLayout from "@/app/_userlayout";
import React, { useState, useEffect } from "react";
import { FaMoneyCheck } from "react-icons/fa";
import { FaCartShopping, FaCircleCheck, FaTruckFast, FaCircleXmark } from "react-icons/fa6";
import AdminLayout from "../admin-layout";

const ProductsOrderTable = () => {
    const [groupedOrders, setGroupedOrders] = useState<any>([]);
    
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/admin-data");
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();
                
                // Nhóm order_items theo order_id
                const orders = data?.orders || [];
                const orderItems = data?.order_items || [];
                
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

    if (!groupedOrders.length) {
        return <div>Loading...</div>;
    }

    return (
        <AdminLayout>
            <div className="w-full min-h-screen p-6 bg-white overflow-x-auto">
            <h1 className="text-2xl font-bold">Lịch sử mua hàng</h1>
            <p className=" text-gray-600 mb-6">
                Kiểm tra các đơn hàng đã mua trước đây
            </p>

            <div className="space-y-6 ml-20 mr-40">
                {groupedOrders.map((order: { id: number; status: number; items: any[], created_at: string, updated_at: string, totalAmount: number }, index: number) => (
                <div key={order.id} className="bg-white p-6 shadow-xl rounded-lg border-2">
                    {/* Order Header */}
                    <div className="grid grid-cols-3 gap-4 border-b pb-4 text-sm text-gray-700">
                    <div>
                        <p className="font-semibold">Mã đơn hàng</p>
                        <p>{order.id}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Ngày đặt hàng</p>
                        <p>{order.created_at}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Tổng giá trị đơn hàng</p>
                        <p className="font-bold">{order.totalAmount}</p>
                    </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-4 space-y-4">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                        <img src={item.image} alt={item.product_name} className="w-24 h-24 object-cover rounded" />
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                            <p className="font-semibold">{item.product_name} - {item.variant_name}</p>

                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                            </div>
                            <p className="text-gray-600 text-sm">{item.product_des}</p>
                            <p className="font-bold mt-2">{item.price}</p>
                        </div>
                        </div>
                    ))}
                    </div>

                    {/* Delivery Status & Actions */}
                    {order.status == 0 && (
                    <div className="mt-4 flex items-center text-sm text-gray-700">
                        <FaCartShopping className="flex items-center gap-1 text-gray-600 font-semibold mr-3" />
                    <p className="flex items-center gap-1 text-gray-600 font-semibold mb-0">
                        Đã đặt hàng lúc {order.updated_at}
                    </p>
                    </div>
                    )} 
                    {order.status == 1 && (
                    <div className="mt-4 flex items-center text-sm text-gray-700">
                        <FaMoneyCheck className="flex items-center gap-1 text-indigo-600 font-semibold mr-3" />
                    <p className="flex items-center gap-1 text-indigo-600 font-semibold mb-0">
                        Đã trả tiền lúc {order.updated_at}
                    </p>
                    </div>
                    )}
                    {order.status == 2 && (
                    <div className="mt-4 flex items-center text-sm text-gray-700">
                        <FaTruckFast className="flex items-center gap-1 text-yellow-600 font-semibold mr-3" />
                    <p className="flex items-center gap-1 text-yellow-600 font-semibold mb-0">
                        Đang giao hàng lúc {order.updated_at}
                    </p>
                    </div>
                    )}
                    {order.status == 3 && (
                    <div className="mt-4 flex items-center text-sm text-gray-700">
                        <FaCircleCheck className="flex items-center gap-1 text-green-600 font-semibold mr-3" />
                    <p className="flex items-center gap-1 text-green-600 font-semibold mb-0">
                        Đã giao hàng lúc {order.updated_at}
                    </p>
                    </div>
                    )}
                    {order.status == 4 && (
                    <div className="mt-4 flex items-center text-sm text-gray-700">
                        <FaCircleXmark className="flex items-center gap-1 text-red-600 font-semibold mr-3" />
                    <p className="flex items-center gap-1 text-red-600 font-semibold mb-0">
                        Đã hủy lúc {order.updated_at}
                    </p>
                    </div>
                    )}
                </div>
                ))}
            </div>
            </div>
            
        </AdminLayout>
    );
};

export default ProductsOrderTable;
