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
            <aside className={`bg-white p-4 shadow-md flex flex-col fixed top-0 left-0 h-screen transition-all duration-300
            ${isCollapsed ? "w-20" : "w-64"}`}>


                {/* Toggle Button */}
                <a href="/admin">
                    <img src="/favicon.ico" width={30} height={30} alt=""/>
                </a>

                {/* Sidebar Menu */}
                <nav className="flex flex-col flex-grow gap-4 mt-5">
                    <a href="/admin/"
                       className="flex items-center font-semibold gap-3 p-2 hover:bg-green-100 rounded text-black text-base no-underline">
                        <FaChartLine className="text-lg"/>
                        {!isCollapsed && <span>Bảng điều khiển</span>}
                    </a>

                    <div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center font-semibold gap-3 p-2 w-full text-left hover:bg-green-100 rounded text-black text-base no-underline"
                        >
                            <FaUsers className="text-lg"/>
                            {!isCollapsed && <span>Người dùng</span>}
                            {!isCollapsed && <FaChevronDown
                                className={`ml-auto transition-transform ${isMenuOpen ? "rotate-180" : ""}`}/>}
                        </button>

                        {/* Danh sách con */}
                        {isMenuOpen && !isCollapsed && (
                            <div className="pl-7 mt-1 flex flex-col gap-2">
                                <div className="flex items-center gap-3 mt-4">
                                    <FaFlag className="text-base"/>
                                    <a href="/admin/permissions"
                                       className="text-black no-underline text-sm font-medium hover:text-green-600">Quản
                                        lý phân quyền</a>
                                </div>

                                <div className="flex items-center gap-3 mt-4">
                                    <FaWebAwesome className="text-base"/>
                                    <Link href="/admin/roles"
                                       className="text-black no-underline text-sm font-medium hover:text-green-600">Quản
                                        lý vai trò</Link>
                                </div>

                                <div className="flex items-center gap-3 mt-4">
                                    <FaUser className="text-base"/>
                                    <a href="/admin/users"
                                       className="text-black no-underline text-sm font-medium hover:text-green-600">Quản
                                        lý người dùng</a>
                                </div>
                            </div>
                        )}
                    </div>

                    <a href="/admin/categories"
                       className="flex items-center font-semibold gap-3 p-2 hover:bg-green-100 rounded text-black text-base no-underline">
                        <FaList className="text-lg"/>
                        {!isCollapsed && <span>Danh mục</span>}
                    </a>
                    <Link href="/admin/products"
                       className="flex items-center font-semibold gap-3 p-2 hover:bg-green-100 rounded text-black text-base no-underline">
                        <FaBox className="text-lg"/>
                        {!isCollapsed && <span>Sản phẩm</span>}
                    </Link>
                    <a href="/admin/orders"
                       className="flex items-center font-semibold gap-3 p-2 hover:bg-green-100 rounded text-black text-base no-underline">
                        <FaInbox className="text-lg"/>
                        {!isCollapsed && <span>Đơn hàng</span>}
                    </a>
                    <a href="#"
                       className="flex items-center font-semibold gap-3 p-2 hover:bg-green-100 rounded text-black text-base no-underline">
                        <FaComment className="text-lg"/>
                        {!isCollapsed && <span>Chat</span>}
                    </a>
                </nav>

                {/* Đăng xuất */}
                <button onClick={handleLogout}
                        className="mt-auto flex items-center font-semibold gap-3 p-2 hover:bg-red-100 rounded text-red-500 text-base no-underline">
                    <FaArrowRightFromBracket className="text-lg"/>
                    {!isCollapsed && <span>Đăng xuất</span>}
                </button>

            </aside>


            {/* Main Content */}
            <div className={`flex-1 flex flex-col ${isCollapsed ? "ml-20" : "ml-64"}`}>
                {/* Navbar */}

                <header className="bg-white shadow-md p-3 flex justify-between items-center w-full overflow-hidden">
                    {/* Phần bên trái (Nút Sidebar) */}
                    <div className="flex items-center">
                        <button
                            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-all"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            <FaBars/>
                        </button>
                        <h2 className="relative mb-0 ml-4 text-lg font-semibold">Dashboard</h2>
                        <div className="relative ml-4">
                            <button
                                className="text-black font-bold hover:text-gray-700 focus:outline-none"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                Liên hệ
                            </button>

                            {/* Dropdown menu */}
                            {isOpen && (
                                <div
                                    className="absolute left-0 z-50 mt-2 w-[250px] bg-white shadow-lg rounded-lg border border-gray-200">
                                    <a
                                        href="#"
                                        className="block no-underline px-4 py-2 text-center text-gray-500 hover:bg-gray-100"
                                    >
                                        Contact us: 0123456789
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 pr-4 flex-shrink-0">
                        <a className="flex flex-col items-center justify-center no-underline" href="#">
                            <img
                                alt="User"
                                src="/UserCircle.svg"
                                className="size-7 rounded-full object-cover"
                            />
                            <p className="text-black font-semibold no-underline mb-0">
                                {data?.name ?? "Người lạ"}
                            </p>
                        </a>
                    </div>

                </header>

                <div className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden`}>

                    {children}
                </div>
            </div>
        </div>
    );
}
