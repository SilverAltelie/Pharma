'use client'

import { useEffect, useState } from "react";
import { FaBox, FaChartLine, FaList, FaUsers } from "react-icons/fa";
import AdminLayout from "./admin-layout";
import type { Order, Customer, OrderItem } from "../type";

export default function Dashboard() {

    type Data = {
        orders: Order[];
        customers: Customer[];
        order_items: OrderItem[];
    }

  const [data, setData] = useState<Data>();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = sessionStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Token không tồn tại');
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.")
          window.location.href = "/admin/auth/login"
          return
        }

        if (res.status === 403) {
          alert("Bạn không có quyền truy cập vào trang này.")
          window.location.href = "/admin/layout"
          return
        }

        if (!res.ok) {
          throw new Error('Lỗi khi gọi API');
        }

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Lỗi khi gọi api: ", error);
      }
    }

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  const completedOrdersSet = new Set(
    data.orders?.filter(order => order.status === 3).map(order => order.id)
  );

  const completedOrdersValue = data.order_items.reduce((total, item) => {
      if (!completedOrdersSet.has(item.order_id)) return total; // Bỏ qua order chưa hoàn thành
      const price = item.product?.variants?.find(variant => parseInt(variant.id) === item.variant_id)?.price || item.product?.price;
      return total + price * item.quantity;
  }, 0);

  const recentOrders = data?.orders?.slice(0, 5);

  return (
    <AdminLayout>
        <main className="p-6 space-y-8">
          {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                            <FaChartLine className="text-blue-600 text-2xl"/>
                        </div>
              <div>
                            <p className="text-sm font-medium text-gray-600">Tổng lợi nhuận</p>
                            <p className="text-2xl font-bold text-blue-600">{completedOrdersValue.toLocaleString()}₫</p>
                        </div>
              </div>
            </div>

                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 bg-green-50 rounded-lg">
                            <FaBox className="text-green-600 text-2xl"/>
                        </div>
              <div>
                            <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
                <p className="text-2xl font-bold text-green-600">{data.orders.length}</p>
              </div>
            </div>
              </div>

                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 bg-purple-50 rounded-lg">
                            <FaUsers className="text-purple-600 text-2xl"/>
            </div>
              <div>
                            <p className="text-sm font-medium text-gray-600">Khách hàng gần đây</p>
                <p className="text-2xl font-bold text-purple-600">{data.customers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 bg-orange-50 rounded-lg">
                            <FaList className="text-orange-600 text-2xl"/>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Danh mục đã tạo</p>
                            <p className="text-2xl font-bold text-orange-600">{data.customers.length}</p>
                        </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần nhất</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
              <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Mã đơn</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Sản phẩm</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Số lượng</th>
                </tr>
              </thead>
                        <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => {
                const orderItems = data.order_items.filter((item) => item.order_id === order.id);
                return orderItems.map((item) => (
                                    <tr key={`${order.id}-${item.id}`} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.product?.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                    </tr>
                ));
              })}
              </tbody>
            </table>
                </div>
          </div>

          {/* Recent Customers */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">10 khách hàng gần nhất</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
              <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">STT</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Khách hàng</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Số điện thoại</th>
                </tr>
              </thead>
                        <tbody className="divide-y divide-gray-100">
                {data?.customers?.map((customer: Customer, index: number) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{customer.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{customer.addresses[0]?.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
                </div>
          </div>
        </main>
      </AdminLayout>
  );
}
