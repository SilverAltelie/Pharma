'use client'

import { useEffect, useState } from "react";
import { FaBox, FaChartLine, FaList, FaUsers } from "react-icons/fa";
import AdminLayout from "./admin-layout";

export default function Dashboard() {
  interface Order {
    id: number;
    status: number;
  }

  interface OrderItem {
    price: number;
    order_id: number;
    product_name: string;
    quantity: number;
  }

  interface AdminData {
    recentCustomers: any;
    orders: Order[];
    order_items: OrderItem[];
  }

  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    async function fetchData() {
        try {
          const res = await fetch("/api/admin-data");
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
    data.orders.filter(order => order.status === 3).map(order => order.id)
  );
  
  const completedOrdersValue = data.order_items.reduce((total, item) => {
    if (!completedOrdersSet.has(item.order_id)) return total; // Bỏ qua order chưa hoàn thành
    return total + item.price * item.quantity;
  }, 0);
  
  
//   const totalCompletedOrderValue = completedOrders.reduce((total, order) => {
//     const orderItems = data.order_items.filter(item => item.order_id === order.id);
    
//     const orderTotal = orderItems.reduce((sum, item) => {
//       const product = productMap[item.product_id];
//       const variant = variantMap[item.variant_id];
  
//       const price = variant ? variant.price : product?.price || 0;
//       return sum + price * item.quantity;
//     }, 0);
  
//     return total + orderTotal;
//   }, 0);  
  const recentOrders = data?.orders?.slice(0, 5);

  return (
    <AdminLayout>

        <main className="p-6">
          {/* Statistics */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4">
              <FaChartLine className="text-blue-600 text-4xl" />
              <div>
                <p className="text-lg font-semibold">Tổng lợi nhuận</p>
                <p className="text-2xl font-bold text-blue-600">{completedOrdersValue}</p>
              </div>
            </div>
            <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4">
              <FaBox className="text-green-600 text-4xl" />
              <div>
                <p className="text-lg font-semibold">Đơn hàng</p>
                <p className="text-2xl font-bold text-green-600">{data.orders.length}</p>
              </div>
            </div>
            <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4">
              <FaUsers className="text-purple-600 text-4xl" />
              <div>
                <p className="text-lg font-semibold">Khách hàng gần đây</p>
                <p className="text-2xl font-bold text-purple-600">{data.recentCustomers.length}</p>
              </div>
            </div>
            <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4">
              <FaList className="text-purple-600 text-4xl" />
              <div>
                <p className="text-lg font-semibold">Danh mục đã tạo</p>
                <p className="text-2xl font-bold text-purple-600">{data.recentCustomers.length}</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Đơn hàng gần nhất</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Mã đơn</th>
                  <th className="p-2">Sản phẩm</th>
                  <th className="p-2">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{data.order_items.find((item) => item.order_id === order.id)?.product_name}</td>
                    <td className="p-2">{data.order_items.find((item) => item.order_id === order.id)?.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Customers */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-4">10 khách hàng gần nhất</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">STT</th>
                  <th className="p-2">Khách hàng</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Số điện thoại</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentCustomers?.map((customer: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{customer.id}</td>
                    <td className="p-2">{customer.name}</td>
                    <td className="p-2">{customer.email}</td>
                    <td className="p-2">{customer.number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </AdminLayout>
  );
}
