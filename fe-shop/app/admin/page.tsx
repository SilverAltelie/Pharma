'use client'

import { useEffect, useState } from "react";
import { FaBox, FaChartLine, FaList, FaUsers, FaGift, FaBoxOpen } from "react-icons/fa";
import AdminLayout from "./admin-layout";
import type { Order, Customer, OrderItem } from "../type";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {

    type Data = {
        orders: Order[];
        customers: Customer[];
        order_items: OrderItem[];
        promotions: {
            id: number;
            name: string;
            start_date: string;
            end_date: string;
            items_count: number;
            status: number;
        }[];
        products: {
            id: number;
            title: string;
            status: number;
        }[];
    }

  const [data, setData] = useState<Data>();
  const [monthlyRevenue, setMonthlyRevenue] = useState<{labels: string[], data: number[]}>({
      labels: [],
      data: []
  });
  const [orderStatus, setOrderStatus] = useState<{labels: string[], data: number[]}>({
      labels: [],
      data: []
  });

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

        if (json.orders) {
            // Xử lý dữ liệu doanh thu theo tháng
            const monthlyData = processMonthlyRevenue(json.orders, json.order_items);
            setMonthlyRevenue(monthlyData);

            // Xử lý trạng thái đơn hàng
            const statusData = processOrderStatus(json.orders);
            setOrderStatus(statusData);
        }
      } catch (error) {
        console.error("Lỗi khi gọi api: ", error);
      }
    }

    fetchData();
  }, []);

  function processMonthlyRevenue(orders: Order[], orderItems: OrderItem[]) {
      const monthlyData = new Map<string, number>();
      const last6Months = Array.from({length: 6}, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          return d.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
      }).reverse();

      // Khởi tạo các tháng với giá trị 0
      last6Months.forEach(month => monthlyData.set(month, 0));

      // Tính doanh thu theo tháng
      orders.forEach(order => {
          if (order.status === '3') { // Đơn hàng hoàn thành
              const orderDate = new Date(order.created_at);
              const monthYear = orderDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
              
              const orderRevenue = orderItems
                  .filter(item => item.order_id === order.id)
                  .reduce((total, item) => {
                      const price = item.product?.variants?.find(v => Number(v.id) === Number(item.variant_id))?.price || item.product?.price;
                      return total + (price * item.quantity);
                  }, 0);

              monthlyData.set(monthYear, (monthlyData.get(monthYear) || 0) + orderRevenue);
          }
      });

      return {
          labels: last6Months,
          data: last6Months.map(month => monthlyData.get(month) || 0)
      };
  }

  function processOrderStatus(orders: Order[]) {
      const statusCount = {
          'Đã đặt hàng': 0,
          'Đã trả tiền': 0,
          'Đang giao hàng': 0,
          'Đã giao hàng': 0,
          'Đã hủy': 0
      };

      orders.forEach(order => {
          switch(order.status) {
              case '0': statusCount['Đã đặt hàng']++; break;
              case '1': statusCount['Đã trả tiền']++; break;
              case '2': statusCount['Đang giao hàng']++; break;
              case '3': statusCount['Đã giao hàng']++; break;
              case '4': statusCount['Đã hủy']++; break;
          }
      });

      return {
          labels: Object.keys(statusCount),
          data: Object.values(statusCount)
      };
  }

  if (!data) return <p>Loading...</p>;

  const completedOrdersSet = new Set(
    data.orders?.filter(order => order.status === '3').map(order => order.id)
  );

  const completedOrdersValue = data.order_items.reduce((total, item) => {
      if (!completedOrdersSet.has(item.order_id)) return total;
      const price = item.product?.variants?.find(v => Number(v.id) === Number(item.variant_id))?.price || item.product?.price;
      return total + (price * item.quantity);
  }, 0);

  const recentOrders = data?.orders?.slice(0, 5);

  const activePromotions = data.promotions?.filter(promo => 
    new Date(promo.end_date) >= new Date() 
  ).length || 0;

  const activeProducts = data.products?.length || 0;

  const revenueChartData = {
      labels: monthlyRevenue.labels,
      datasets: [{
          label: 'Doanh thu theo tháng',
          data: monthlyRevenue.data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
      }]
  };

  const orderStatusChartData = {
      labels: orderStatus.labels,
      datasets: [{
          data: orderStatus.data,
          backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF'
          ]
      }]
  };

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

                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 bg-pink-50 rounded-lg">
                            <FaGift className="text-pink-600 text-2xl"/>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Ưu đãi đang hoạt động</p>
                            <p className="text-2xl font-bold text-pink-600">{activePromotions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-lg">
                            <FaBoxOpen className="text-indigo-600 text-2xl"/>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Sản phẩm đang bán</p>
                            <p className="text-2xl font-bold text-indigo-600">{activeProducts}</p>
                        </div>
                    </div>
                </div>
            </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ doanh thu</h3>
                  <div className="h-80">
                      <Line 
                          data={revenueChartData}
                          options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                  y: {
                                      beginAtZero: true,
                                      ticks: {
                                          callback: function(value) {
                                              return value.toLocaleString('vi-VN') + '₫';
                                          }
                                      }
                                  }
                              }
                          }}
                      />
                  </div>
              </div>

              {/* Order Status Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái đơn hàng</h3>
                  <div className="h-80">
                      <Doughnut 
                          data={orderStatusChartData}
                          options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                  legend: {
                                      position: 'right'
                                  }
                              }
                          }}
                      />
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

          {/* Active Promotions */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Ưu đãi đang hoạt động</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Tên ưu đãi</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Số sản phẩm</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Ngày bắt đầu</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Ngày kết thúc</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.promotions
                                ?.map((promotion, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{promotion.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{promotion.items_count}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(promotion.start_date).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(promotion.end_date).toLocaleDateString('vi-VN')}
                                        </td>
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
