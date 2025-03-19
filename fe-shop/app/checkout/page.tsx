'use client'

import {ChevronDownIcon} from '@heroicons/react/16/solid';
import MainLayout from '@/app/_userlayout';
import {useState, useEffect} from "react";

export default function CheckOut() {

  const [data, setData] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            });
        const json = await res.json();
        setData(json);
        const defaultAddress = json.addresses?.find((addr: any) => addr.is_default === 1);
        setSelectedAddressId(defaultAddress ? defaultAddress.id : null);
      } catch (error) {
        console.error("Lỗi khi gọi API: ", error);
      }
    }

    fetchData();
  }, []);

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
                      {data?.addresses?.find((addr: any) => addr.id === selectedAddressId)?.first_name}{" "}
                      {data?.addresses?.find((addr: any) => addr.id === selectedAddressId)?.last_name}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong className="text-gray-900">Địa chỉ:</strong>{" "}
                      {data?.addresses?.find((addr: any) => addr.id === selectedAddressId)?.address}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong className="text-gray-900">Số điện thoại:</strong>{" "}
                      {data?.addresses?.find((addr: any) => addr.id === selectedAddressId)?.number}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong className="text-gray-900">Email:</strong>{" "}
                      {data?.addresses?.find((addr: any) => addr.id === selectedAddressId)?.email}
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
                            {data.addresses.map((addr: any) => (
                                <div
                                    key={addr.id}
                                    className={`p-4 border rounded-md shadow-sm cursor-pointer ${
                                        addr.id === selectedAddressId
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-300'
                                    }`}
                                    onClick={() => {
                                      setSelectedAddressId(addr.id);
                                      setAddress(addr.address);
                                    }}
                                >
                                  <p className="text-sm text-gray-700 mb-2">
                                    <strong className="text-gray-900">Họ
                                      tên:</strong> {addr.first_name} {addr.last_name}
                                  </p>
                                  <p className="text-sm text-gray-700 mb-2">
                                    <strong className="text-gray-900">Địa chỉ:</strong> {addr.address}
                                  </p>
                                  <p className="text-sm text-gray-700 mb-2">
                                    <strong className="text-gray-900">Số điện thoại:</strong> {addr.number}
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
                            <a href = "/user/addresses" className={"text-sm text-green-800"}>Hãy thêm địa chỉ</a>
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
            </div>

            {/* Giỏ hàng */}
            <div className="ml-8 w-1/2 p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">Giỏ hàng</h2>
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {data?.cartItems?.map((item: any) => (
                      <li key={item.id} className="flex py-6 items-center">
                        <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200">
                          <img alt={item.title} src={'data:image/jpeg;base64,' + item.image} className="w-full h-full object-cover"/>
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div className="flex justify-between items-center text-base font-medium text-gray-900">
                            <h3>
                              <a href={item.href} className="hover:underline">{item.product.title}</a>
                            </h3>
                            <p className="ml-4 text-lg font-semibold">{item.variant ? item.variant.price * item.quantity: item.product.price * item.quantity}đ</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{item.variant.name}</p>
                          <div className="flex flex-1 items-end justify-between text-sm mt-2">
                            <p className="text-gray-500">Số lượng: {item.quantity}</p>
                            <button type="button" className="text-red-500 hover:text-red-700 font-medium">
                              Xóa
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
                  <p>{data?.cartItems?.reduce((total: number, item: any) => total + (item.variant ? item.variant.price * item.quantity : item.product.price * item.quantity), 0) || "0"}đ</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">Phí ship và thuế sẽ được tính ở bước thanh toán.</p>
                <button
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

// CSS Utility Classes (Tailwind)
const inputField = "w-full mt-2 p-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none";
const btnCancel = "px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100 transition";
const btnSubmit = "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition";
