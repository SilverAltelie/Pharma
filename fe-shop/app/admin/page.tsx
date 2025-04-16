'use client'

import { useEffect, useState } from "react";
import { FaBox, FaChartLine, FaList, FaUsers } from "react-icons/fa";
import AdminLayout from "./admin-layout";
import type { Order, Customer, OrderItem } from "../type";

export default function Dashboard() {

  /*type Order = {
    id: number;
    status: number;
  };

    type Customer = {
        id: number;
        name: string;
        email: string;
        addresses: {
        phone: string;
        }[];
    };

    type Variant = {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }

    type Product = {
        id: number;
        title: string;
        href: string;
        image: string;
        price: number;
        color: string;
        variants: Variant[];
    }

    type OrderItem = {
        id: number;
        order_id: number;
        product_id: number;
        variant_id: number;
        quantity: number;
        price: number;
        product?: Product;
    }*/

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
                <p className="text-2xl font-bold text-purple-600">{data.customers.length}</p>
              </div>
            </div>
            <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4">
              <FaList className="text-purple-600 text-4xl" />
              <div>
                <p className="text-lg font-semibold">Danh mục đã tạo</p>
                <p className="text-2xl font-bold text-purple-600">{data.customers.length}</p>
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
              {recentOrders.map((order) => {
                const orderItems = data.order_items.filter((item) => item.order_id === order.id);
                return orderItems.map((item) => (
                    <tr key={`${order.id}-${item.id}`} className="border-t">
                      <td className="p-2">{order.id}</td>
                      <td className="p-2">{item.product?.title}</td>
                      <td className="p-2">{item.quantity}</td>
                    </tr>
                ));
              })}
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
                {data?.customers?.map((customer: Customer, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{index}</td>
                    <td className="p-2">{customer.name}</td>
                    <td className="p-2">{customer.email}</td>
                    <td className="p-2">{customer.addresses[0]?.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </AdminLayout>
  );
}
