'use client'

import { useEffect, useState } from "react";
import {
    FaBox,
    FaChartLine,
    FaUsers,
    FaBars,
    FaChevronDown,
    FaComment,
    FaList,
    FaInbox,
    FaUser,
    FaFlag,
    FaArrowRightFromBracket,
    FaWebAwesome
} from "react-icons/fa6";
import type {User, Order, OrderItem, Customer} from "@/app/type";
import Link from "next/link";
import {FaBlog, FaPercent} from "react-icons/fa";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    type Data = {
        name: string;
        user: User;
        orders: Order[];
        customers: Customer[];
        order_items: OrderItem[];
    }

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Data>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/home`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
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

                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                } else {
                    console.error("Lỗi khi gọi api: HTTP status", res.status);
                }
            } catch (error) {
                console.error("Lỗi khi gọi api: ", error);
            }
        }

        fetchData();
    }, []);

    async function handleLogout() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
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

            await res.json();
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/auth/login';

        } catch (error) {
            console.error("Lỗi khi gọi api: ", error);
        }
    }

    if (!data) {
        return <p>Đang tải dữ liệu...</p>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-white p-6 shadow-lg flex flex-col fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out
            ${isCollapsed ? "w-20" : "w-64"}`}>

                {/* Logo */}
                <a href="/admin" className="flex items-center gap-3 mb-8">
                    <img src="/favicon.ico" width={30} height={30} alt="" className="rounded shadow-sm"/>
                    {!isCollapsed && <span className="font-bold text-xl text-gray-800">Admin</span>}
                </a>

                {/* Sidebar Menu */}
                <nav className="flex flex-col flex-grow gap-2">
                    <a href="/admin/"
                       className="flex items-center font-medium gap-3 p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-all duration-200">
                        <FaChartLine className="text-lg"/>
                        {!isCollapsed && <span>Bảng điều khiển</span>}
                    </a>

                    <div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center font-medium gap-3 p-3 w-full text-left hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-all duration-200"
                        >
                            <FaUsers className="text-lg"/>
                            {!isCollapsed && (
                                <>
                                    <span>Người dùng</span>
                                    <FaChevronDown
                                        className={`ml-auto transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                                    />
                                </>
                            )}
                        </button>

                        {/* Submenu */}
                        {isMenuOpen && !isCollapsed && (
                            <div className="pl-4 mt-2 space-y-2">
                                <Link href="/admin/permissions"
                                   className="flex items-center gap-3 p-2 text-gray-600 hover:text-green-600 rounded-lg transition-colors duration-200 group">
                                    <FaFlag className="text-base group-hover:scale-110 transition-transform duration-200"/>
                                    <span className="text-sm">Quản lý phân quyền</span>
                                </Link>

                                    <Link href="/admin/roles"
                                   className="flex items-center gap-3 p-2 text-gray-600 hover:text-green-600 rounded-lg transition-colors duration-200 group">
                                    <FaWebAwesome className="text-base group-hover:scale-110 transition-transform duration-200"/>
                                    <span className="text-sm">Quản lý vai trò</span>
                                </Link>

                                <Link href="/admin/users"
                                   className="flex items-center gap-3 p-2 text-gray-600 hover:text-green-600 rounded-lg transition-colors duration-200 group">
                                    <FaUser className="text-base group-hover:scale-110 transition-transform duration-200"/>
                                    <span className="text-sm">Quản lý người dùng</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link href="/admin/categories"
                       className="flex items-center font-medium gap-3 p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-all duration-200">
                        <FaList className="text-lg"/>
                        {!isCollapsed && <span>Danh mục</span>}
                    </Link>

                    <Link href="/admin/products"
                       className="flex items-center font-medium gap-3 p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-all duration-200">
                        <FaBox className="text-lg"/>
                        {!isCollapsed && <span>Sản phẩm</span>}
                    </Link>

                    <Link href="/admin/orders"
                       className="flex items-center font-medium gap-3 p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-all duration-200">
                        <FaInbox className="text-lg"/>
                        {!isCollapsed && <span>Đơn hàng</span>}
                    </Link>

                    <Link href="#"
                       className="flex items-center font-medium gap-3 p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-all duration-200">
                        <FaComment className="text-lg"/>
                        {!isCollapsed && <span>Chat</span>}
                    </Link>

                    <Link href="/admin/blog"
                       className="flex items-center font-medium gap-3 p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-all duration-200">
                        <FaBlog className="text-lg"/>
                        {!isCollapsed && <span>Blogs</span>}
                    </Link>

                    <Link href="/admin/promotions"
                       className="flex items-center font-medium gap-3 p-3 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-all duration-200">
                        <FaPercent className="text-lg"/>
                        {!isCollapsed && <span>Khuyến mãi</span>}
                    </Link>
                </nav>

                {/* Logout Button */}
                <button onClick={handleLogout}
                        className="mt-auto flex items-center font-medium gap-3 p-3 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-all duration-200">
                    <FaArrowRightFromBracket className="text-lg"/>
                    {!isCollapsed && <span>Đăng xuất</span>}
                </button>

            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
                {/* Navbar */}
                <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            <FaBars className="text-gray-600"/>
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                        <div className="relative">
                            <button
                                className="text-gray-700 font-medium hover:text-green-600 transition-colors duration-200 focus:outline-none"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                Liên hệ
                            </button>

                            {isOpen && (
                                <div className="absolute left-0 z-50 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 transform transition-all duration-200 ease-out opacity-0 scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100">
                                    <a href="#"
                                       className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                        Liên hệ: 0123456789
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <a className="flex items-center gap-3 group" href="#">
                            <img
                                alt="User"
                                src="/UserCircle.svg"
                                className="size-8 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-green-200 transition-all duration-200"
                            />
                            <span className="font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-200">
                                {data?.name ?? "Người lạ"}
                            </span>
                        </a>
                    </div>
                </header>

                <div className="flex-1 p-6 bg-gray-50">
                    {children}
                </div>
            </div>
        </div>
    );
}
