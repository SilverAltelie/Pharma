'use client'

import MainLayout from '@/app/_userlayout';
import {useState, useEffect} from "react";
import {FaTrash} from "react-icons/fa";
import Link from "next/link";
import type { CartItem, Address, Payment } from "@/app/type";

export default function CheckOut() {

    /*type PayementMethod = {
        id: number;
        method: string;
    }

    type CartItem = {
        id: number;
        quantity: number;
        variant: { id?: number, price: number, name: string };
        product_id: number;
        price: number;
        image: string;
        product: { title: string; price: number };
    }*/

    type extendedCartItem = CartItem & {
        image: string;
    }

    type Data = {
        cartItems: extendedCartItem[];
        addresses: Address[];
        paymentMethods: Payment[];
    }

   /* type Address = {
        id: number;
        first_name: string;
        last_name: string;
        address: string;
        number: string;
        email: string;
        is_default: number;
    }*/;

    const [data, setData] = useState<Data | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<number>(data?.addresses[0]?.id ?? 0);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(data?.paymentMethods[0].id || 1 );
    const [note, setNote] = useState('');

    const updateQuantityLocally = (itemId: number, newQuantity: number) => {
        setData((prevData: Data | null) => {
            if (!prevData || !prevData.cartItems) return prevData as Data | null;
            const updatedCartItems = prevData.cartItems.map((item: extendedCartItem) =>
                item.id === itemId ? {...item, quantity: newQuantity} : item
            );
            return {...prevData, cartItems: updatedCartItems};
        });
    };

    const handleOrder = async (cartItems: extendedCartItem[], addressId: number, payment_id: number, note: string) => {

        if (cartItems.length == 0) {
            alert("Giỏ hàng đang trống")
            return
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
                },
                body: JSON.stringify({
                    cartItems,
                    address_id: addressId,
                    payment_id: payment_id,
                    note,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create order");
            }

            await res.json();
            const confirm = window.confirm("Bạn đang đặt hàng thành công, theo dõi đơn hàng?")

            if (confirm) {
                window.location.href = `/user/orders/`;
            }
            else {
                window.location.href = '/';
            }
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/checkout`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    });
                const json = await res.json();
                setData(json);
                const defaultAddress = json.addresses?.find((addr: Address) => addr.is_default == 1);
                setSelectedAddressId(defaultAddress ? defaultAddress.id : null);
            } catch (error) {
                console.error("Lỗi khi gọi API: ", error);
            }
        }

        fetchData();
    }, []);

    if (!data || !Array.isArray(data?.cartItems)) {
        return <div>Loading... </div>;
    }

    return (
        <MainLayout>
            <div className='ml-9 mr-9 mt-8 mb-8'>
                <div className="flex justify-center gap-8 mt-[200px]">
                    {/* Form nhập địa chỉ */}
                    <div className="mr-8 w-1/2 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Thông tin địa chỉ</h2>
                        <p className="mt-2 text-base text-gray-600">Bạn có thể chỉnh sửa hoặc chọn địa chỉ khác.</p>

                        {!isEdit && (
                            <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
                                <p className="text-sm text-gray-700 mb-2">
                                    <strong className="text-gray-900">Họ tên:</strong>{" "}
                                    {data?.addresses?.find((addr: Address) => addr.id === selectedAddressId)?.first_name}{" "}
                                    {data?.addresses?.find((addr: Address) => addr.id === selectedAddressId)?.last_name}
                                </p>
                                <p className="text-sm text-gray-700 mb-2">
                                    <strong className="text-gray-900">Địa chỉ:</strong>{" "}
                                    {data?.addresses?.find((addr: Address) => addr.id === selectedAddressId)?.address}
                                </p>
                                <p className="text-sm text-gray-700 mb-2">
                                    <strong className="text-gray-900">Số điện thoại:</strong>{" "}
                                    {data?.addresses?.find((addr: Address) => addr.id === selectedAddressId)?.phone}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong className="text-gray-900">Email:</strong>{" "}
                                    {data?.addresses?.find((addr: Address) => addr.id === selectedAddressId)?.email}
                                </p>
                                <button
                                    type="button"
                                    className="mt-4 text-sm font-medium text-indigo-500 hover:text-indigo-700 underline"
                                    onClick={() => setIsEdit(true)}
                                >
                                    Đổi địa chỉ
                                </button>
                            </div>
                        )}

                        {isEdit && (
                            <form className="mt-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chọn địa chỉ</label>
                                    {data?.addresses?.length > 0 ? (
                                        <div className="mt-3 space-y-4">
                                            {data.addresses.map((addr: Address) => (
                                                <div
                                                    key={addr.id}
                                                    className={`p-4 border rounded-md shadow-sm cursor-pointer ${
                                                        addr.id === selectedAddressId
                                                            ? 'border-indigo-500 bg-indigo-50'
                                                            : 'border-gray-300'
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedAddressId(addr.id);
                                                    }}
                                                >
                                                    <p className="text-sm text-gray-700 mb-2">
                                                        <strong className="text-gray-900">Họ
                                                            tên:</strong> {addr.first_name} {addr.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-700 mb-2">
                                                        <strong className="text-gray-900">Địa
                                                            chỉ:</strong> {addr.address}
                                                    </p>
                                                    <p className="text-sm text-gray-700 mb-2">
                                                        <strong className="text-gray-900">Số điện
                                                            thoại:</strong> {addr.phone}
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        <strong className="text-gray-900">Email:</strong> {addr.email}
                                                    </p>
                                                    {addr.is_default == 1 && <p
                                                        className="mt-2 text-indigo-500 text-sm"
                                                    >
                                                        Mặc định
                                                    </p>
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm text-gray-500">Chưa có địa chỉ</p>
                                            <Link href="/user/addresses" className={"text-sm text-green-800"}>Hãy thêm địa
                                                chỉ</Link>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEdit(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={() => setIsEdit(false)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 transition"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </form>
                        )}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                            <select
                                className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
                                onChange={(e) => setSelectedPaymentMethod(parseInt(e.target.value))}
                                value={selectedPaymentMethod}
                            >
                                {data?.paymentMethods?.map((method: Payment) => (
                                    <option key={method.id} value={method.id}>{method.method}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                            <input
                                className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
                                placeholder={"Viết thêm ghi chú cho shop nhé!"} type="text" value={note}
                                onChange={(e) => setNote(e.target.value)}/>
                        </div>
                    </div>

                    {/* Giỏ hàng */}
                    <div className="ml-8 w-1/2 p-6 bg-white shadow-lg rounded-lg">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">Giỏ hàng</h2>
                        <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                                {data?.cartItems?.map((item: extendedCartItem) => (
                                    <li key={item.id} className="flex py-6 items-center">
                                        <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200">
                                            <img alt={item.product.title} src={'data:image/jpeg;base64,' + item.image}
                                                 className="w-full h-full object-cover"/>
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div
                                                className="flex justify-between items-center text-base font-medium text-gray-900">
                                                <h3>
                                                    <Link href={`/product/${item.product_id}`}
                                                       className="hover:underline">{item.product.title}</Link>
                                                </h3>
                                                <p className="ml-4 text-lg font-semibold">{item.variant ? item.variant.price * item.quantity : item.product.price * item.quantity}đ</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{item.variant?.name}</p>
                                            <div className="flex flex-1 items-end justify-between text-sm mt-2">
                                                <div className="flex items-center">
                                                    <p className="text-gray-500 mr-2">Số lượng:</p>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantityLocally(item.id, parseInt(e.target.value))}
                                                        className="w-16 mb-3 border border-gray-300 rounded-md text-center"
                                                    />
                                                </div>
                                                <button type="button"
                                                        className="text-red-500 hover:text-red-700 font-medium">
                                                    <FaTrash/>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-t border-gray-200 mt-6 pt-4">
                            <div className="flex justify-between text-lg font-semibold text-gray-900">
                                <p>Tổng cộng</p>
                                <p>{data?.cartItems?.reduce((total: number, item: CartItem) => total + (item.variant ? item.variant.price * item.quantity : item.product.price * item.quantity), 0) || "0"}đ</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Phí ship và thuế sẽ được tính ở bước thanh
                                toán.</p>
                            <button
                                onClick={() => handleOrder(data.cartItems, selectedAddressId, selectedPaymentMethod, note)}
                                className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-all">
                                Tiến hành thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
