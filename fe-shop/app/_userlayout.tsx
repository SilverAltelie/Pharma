'use client'

import Image from 'next/image';
import {useState, useEffect} from 'react';
import "../public/customer/css/core-style.css";
import "../public/customer/style.css"
import "../public/customer/css/image.css"
import "../public/css/user/homeContent.css"
import "../public/css/user/productSale.css"
import {Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    Menu,
    Transition
} from '@headlessui/react'

import {
    ChevronDownIcon,
    UserIcon,
    MapIcon,
    ShoppingBagIcon,
    ArrowLeftStartOnRectangleIcon,
    ArrowRightEndOnRectangleIcon,
    PencilSquareIcon
} from '@heroicons/react/20/solid'
import {useRouter} from "next/navigation";
import Link from "next/link";
import FloatingMenu from "@/app/floatingMenu";
import type {User, CartItem, Category} from "./type"
import {string} from "postcss-selector-parser";
import {Fragment} from "react";

type Data = {
    name: string;
    user: User;
    cartItems: CartItem[];
    categories: Category[];
}

const MainLayout = ({children}: { children: React.ReactNode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<Data>();
    const router = useRouter();
    const [subtotal, setSubtotal] = useState(0);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                let headers: Record<string, string> = {
                    'Content-Type': 'application/json'
                };

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home`, {
                    headers: headers
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Lỗi tải dữ liệu");
                setData(data);
            } catch (err) {
                console.error("Lỗi API trả về:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [token]);


    async function handleLogout() {
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Logout failed");
        }

        sessionStorage.removeItem('token');
        router.push('/auth/login');
    }


    if (isLoading && token) {
        return (
            <div className="loading-screen">
                <p>Loading...</p>
            </div>
        );
    }


    async function handleRemoveFromCart(product_id: string, variant_id: string | null, quantity: number) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/removeProduct/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id,
                    variant_id,
                    quantity,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Xóa sản phẩm không thành công');
            }

            const data = await res.json();

            console.log(data);
            alert('Xóa sản phẩm thành công');
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <style jsx global>{`
                a {
                    text-decoration: none;
                }
            `}</style>
            <div className="wrapper">
                <header className="header_area">
                    <div className="classy-nav-container breakpoint-off d-flex align-items-center justify-content-between bg-white shadow-sm">
                        <nav className="classy-navbar" id="essenceNav">
                            <Link className="nav-brand ml-0 hover:opacity-75 transition-opacity duration-200" href="/">
                                <Image src="/favicon.ico" width={40} height={40} alt="" className="rounded-lg shadow-sm"/>
                            </Link>
                            <div className="classy-navbar-toggler">
                                <span className="navbarToggler"><span></span><span></span><span></span></span>
                            </div>
                            <div className="classy-menu">
                                <div className="classynav">
                                    <ul style={{margin: 0, display: 'flex', gap: '24px'}}>
                                        <li>
                                            <Menu as="div" className="relative">
                                                {({ open }) => (
                                                    <>
                                                        <Menu.Button className="flex items-center gap-x-1 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200">
                                                            Sản phẩm
                                                            <ChevronDownIcon
                                                                className={`${open ? 'rotate-180 transform' : ''} size-5 flex-none text-gray-400 transition-transform duration-200`}
                                                                aria-hidden="true"
                                                            />
                                                        </Menu.Button>

                                                        <Transition
                                                            show={open}
                                                            as={Fragment}
                                                            enter="transition ease-out duration-200"
                                                            enterFrom="opacity-0 translate-y-1"
                                                            enterTo="opacity-100 translate-y-0"
                                                            leave="transition ease-in duration-150"
                                                            leaveFrom="opacity-100 translate-y-0"
                                                            leaveTo="opacity-0 translate-y-1"
                                                        >
                                                            <Menu.Items
                                                                static
                                                                className="absolute left-0 z-10 mt-3 w-screen max-w-md rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                                            >
                                                                <div className="p-4">
                                                                    {data?.categories ? (
                                                                        data.categories.map((category) => (
                                                                            <Menu.Item key={category.id}>
                                                                                {({ active }) => (
                                                                                    <div className="mb-4 last:mb-0">
                                                                                        <Link
                                                                                            href={`/category/${category.id}`}
                                                                                            className={`block font-semibold ${
                                                                                                active ? 'text-green-600' : 'text-gray-900'
                                                                                            } transition-colors duration-200`}
                                                                                        >
                                                                                            {category.name}
                                                                                        </Link>
                                                                                        {category.children && category.children.length > 0 && (
                                                                                            <div className="mt-2 ml-4 space-y-2">
                                                                                                {category.children.map((child) => (
                                                                                                    <Menu.Item key={child.id}>
                                                                                                        {({ active }) => (
                                                                                                            <Link
                                                                                                                href={`/category/${child.id}`}
                                                                                                                className={`block text-sm ${
                                                                                                                    active ? 'text-green-600' : 'text-gray-500'
                                                                                                                } transition-colors duration-200`}
                                                                                                            >
                                                                                                                {child.name}
                                                                                                            </Link>
                                                                                                        )}
                                                                                                    </Menu.Item>
                                                                                                ))}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </Menu.Item>
                                                                        ))
                                                                    ) : (
                                                                        <p className="text-gray-500 text-center py-4">
                                                                            Không có danh mục nào
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </Menu.Items>
                                                        </Transition>
                                                    </>
                                                )}
                                            </Menu>
                                        </li>

                                        <button
                                            className="text-black font-bold hover:text-gray-700 focus:outline-none"
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        >
                                            Liên hệ
                                        </button>

                                        <Link 
                                            href="/blogs"
                                            className="text-black font-bold hover:text-gray-700 transition-colors duration-200"
                                        >
                                            Tin tức
                                        </Link>

                                        {/* Dropdown menu */}
                                        {isMenuOpen && (
                                            <div
                                                className="relative left-0 mt-2 w-[250px] bg-white shadow-lg rounded-lg border border-gray-200">
                                                <Link
                                                    href="#"
                                                    className="relative no-underline px-4 py-2 text-center text-gray-500 hover:bg-gray-100"
                                                >
                                                    Contact us: 0123456789
                                                </Link>
                                            </div>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </nav>

                        <div className="header-meta d-flex clearfix justify-content-end">
                            <div className="search-area">
                                <form action="#" method="GET">
                                    <input type="search" name="search" id="headerSearch" placeholder="Tìm kiếm"/>
                                    <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                                </form>
                            </div>


                            <Popover className="relative">
                                <PopoverButton
                                    className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                                    <div className="order-area flex justify-center -space-x-2 overflow-hidden">
                                        <a className=' !flex !flex-col !items-center !w-fit' href="#">
                                            <img
                                                alt=""
                                                src="/UserCircle.svg"
                                                className="mt-2 inline-block !max-w-10 size-10 rounded-full ring-2 ring-white"
                                            />
                                            <div className="flex justify-center items-center min-w-[100px]">
                                                <p className="whitespace-nowrap pl-1 pr-1 text-sm">{data?.user?.name ?? "Người lạ"}</p>
                                            </div>
                                        </a>
                                    </div>
                                </PopoverButton>
                                {token ? (
                                    <PopoverPanel
                                        transition
                                        className="absolute left-1/2 z-10 mt-2 flex w-screen max-w-fit -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                                    >
                                        <div
                                            className="w-screen max-w-fit flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 shadow-lg ring-gray-900/5">
                                            <div className="p-4">

                                                <div
                                                    className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                    <div
                                                        className="mt-1 flex size-fit flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <UserIcon
                                                            className="size-4 text-gray-600 group-hover:text-green-600"/>
                                                    </div>
                                                    <div>
                                                        <Link href='/user/profile' className="font-semibold text-gray-900">
                                                            Thông tin
                                                            <span className="absolute inset-0"/>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div
                                                    className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                    <div
                                                        className="mt-1 flex size-fit flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <MapIcon
                                                            className="size-6 text-gray-600 group-hover:text-green-600"/>
                                                    </div>
                                                    <div>
                                                        <Link href='/user/addresses'
                                                              className="font-semibold text-gray-900">
                                                            Địa chỉ
                                                            <span className="absolute inset-0"/>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div
                                                    className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                    <div
                                                        className="mt-1 flex size-fit flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <ShoppingBagIcon
                                                            className="size-6 text-gray-600 group-hover:text-green-600"/>
                                                    </div>
                                                    <div>
                                                        <Link href='/user/orders' className="font-semibold text-gray-900">
                                                            Đơn hàng
                                                            <span className="absolute inset-0"/>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div
                                                    className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                    <div
                                                        className="mt-1 flex size-fit flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <ArrowLeftStartOnRectangleIcon
                                                            className="size-6 text-gray-600 group-hover:text-green-600"/>
                                                    </div>
                                                    <div>
                                                        <button onClick={handleLogout}
                                                                className="font-semibold text-gray-900">
                                                            Đăng xuất
                                                            <span className="absolute inset-0"/>
                                                        </button>

                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </PopoverPanel>) : (
                                    <PopoverPanel
                                        transition
                                        className="absolute left-1/2 z-10 mt-2 flex w-screen max-w-fit -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                                    >
                                        <div
                                            className="w-screen max-w-fit flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 shadow-lg ring-gray-900/5">
                                            <div className="p-4">

                                                <div
                                                    className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                    <div
                                                        className="mt-1 flex size-fit flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <ArrowRightEndOnRectangleIcon
                                                            className="size-6 text-gray-600 group-hover:text-green-600"/>
                                                    </div>
                                                    <div>
                                                        <Link href='/auth/login' className="font-semibold text-gray-900">
                                                            Đăng nhập
                                                            <span className="absolute inset-0"/>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div
                                                    className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                    <div
                                                        className="mt-1 flex size-fit flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <PencilSquareIcon
                                                            className="size-6 text-gray-600 group-hover:text-green-600"/>
                                                    </div>
                                                    <div>
                                                        <a href='/auth/register' className="font-semibold text-gray-900">
                                                            Đăng ký
                                                            <span className="absolute inset-0"/>
                                                        </a>
                                                    </div>
                                                </div>


                                            </div>

                                        </div>
                                    </PopoverPanel>
                                )
                                }

                            </Popover>


                            <div className="cart-area d-flex align-items-center justify-content-center ml-4 mr-4">
                                <button onClick={() => setIsOpen(!isOpen)} className="relative group">
                                    <Image src="/customer/img/core-img/bag.svg" alt="" width={40} height={40} className="transition-transform duration-200 group-hover:scale-110"/>
                                    <span className="absolute -top-2 -right-2 size-6 flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold">{data?.cartItems?.length}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <Dialog open={isOpen} onClose={setIsOpen} className="relative z-10">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out data-closed:opacity-0"
                    />

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute top-[80px] inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <DialogPanel
                                    transition
                                    className="pointer-events-auto w-screen max-w-md transform transition duration-300 ease-in-out data-closed:translate-x-full bg-white shadow-2xl"
                                >
                                    <div className="absolute top-[70px] min-w-full min-h-full flex-col max-h-[92vh] overflow-y-scroll bg-white">
                                        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
                                            <div className="flex items-start justify-between mb-8">
                                                <h2 className="text-lg font-semibold text-gray-900">Giỏ hàng</h2>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsOpen(false)}
                                                    className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200"
                                                >
                                                    <span className="absolute -inset-0.5"/>
                                                    <span className="sr-only">Close panel</span>
                                                    <XMarkIcon aria-hidden="true" className="size-6"/>
                                                </button>
                                            </div>

                                            <div className="mt-8">
                                                <div className="flow-root">
                                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                        {data?.cartItems?.map((item: CartItem, index: number) => (
                                                            <li key={index} className="flex py-6 gap-4 hover:bg-gray-50 transition-colors duration-200 p-4 rounded-lg">
                                                                <div className="size-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                                                    <img
                                                                        alt={"Product Image"}
                                                                        src={`data:image/jpeg;base64,${item['image']}`}
                                                                        className="size-full object-cover hover:scale-105 transition-transform duration-200"
                                                                    />
                                                                </div>

                                                                <div className="flex flex-1 flex-col">
                                                                    <div>
                                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                                            <h3>
                                                                                <a href={`/product/${item['product'].id}`} className="hover:text-green-600 transition-colors duration-200">{item['product'].title ?? "Untitled Product"}</a>
                                                                            </h3>
                                                                            <p className="ml-4 font-semibold">
                                                                                {item['variant']?.price && item.quantity
                                                                                    ? `${item['variant'].price * item.quantity} VND`
                                                                                    : item['product'].price && item.quantity
                                                                                        ? `${item['product'].price * item.quantity} VND`
                                                                                        : "N/A"}
                                                                            </p>
                                                                        </div>
                                                                        <p className="mt-1 text-sm text-gray-500">{item['variant']?.name ?? "No Variant"}</p>
                                                                    </div>
                                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                                        <p className="text-gray-500">Số lượng: {item.quantity ?? 1}</p>

                                                                        <div className="flex">
                                                                            <button
                                                                                type="button"
                                                                                className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
                                                                                onClick={() => handleRemoveFromCart(item['product'].id, item['variant']?.id ?? null, item.quantity)}
                                                                            >
                                                                                Xóa
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4 flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="size-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                                                        onChange={(e) =>
                                                                            setSubtotal(
                                                                                (prev) => prev + (e.target.checked ? (item['variant']?.price ?? item['product'].price) * item.quantity : -(item['variant']?.price ?? item['product'].price) * item.quantity)
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 px-6 py-6 sm:px-8 bg-gray-50">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Tổng tiền</p>
                                                <p className="font-semibold text-green-600">{subtotal} VND</p>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500">Phí ship và thuế ở mục thanh toán.</p>
                                            <div className="mt-6 space-y-4">
                                                <a
                                                    href="/user/cart"
                                                    className="flex items-center justify-center rounded-lg border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 transition-colors duration-200"
                                                >
                                                    Xem giỏ hàng
                                                </a>
                                                <Link
                                                    href="/checkout"
                                                    className="flex items-center justify-center rounded-lg border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 transition-colors duration-200"
                                                >
                                                    Thanh toán
                                                </Link>
                                            </div>

                                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsOpen(false)}
                                                    className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
                                                >
                                                    Tiếp tục mua sắm
                                                    <span aria-hidden="true"> &rarr;</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </div>
                </Dialog>
                {children}
                <FloatingMenu user={data?.user}/>
            </div>
        </>
    );
}

export default MainLayout;
