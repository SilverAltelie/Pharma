'use client'

import MainLayout from '@/app/_userlayout';
import {use, useEffect, useState} from 'react';
import {Field, Label, Switch} from '@headlessui/react';
import {useRouter} from "next/navigation";
import type { User, Address } from "@/app/type";

export default function AddressCreate({params}: { params: Promise<{ id: number }> }) {

    /*type Address = {
        id: string;
        first_name: string;
        last_name: string;
        address: string;
        phone: string;
        is_default: string;
    }

    type User = {
        id: string;
        name: string;
        email: string;
        addresses: Address[];
    }*/

    type Data = {
        user: User;
        address: Address;
    }

    const {id} = use(params);
    const [agree, setAgree] = useState(false);
    const [data, setData] = useState<Data>();

    const router = useRouter();

    const [address, setAddress] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = sessionStorage.getItem('token');
        if (savedToken) setToken(savedToken);
    }, []);

    useEffect(() => {

        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const json = await res.json();
                setData(json);

                if (json?.address) {
                    setAddress(json.address.address || '');
                    setFirstName(json.address.first_name || '');
                    setLastName(json.address.last_name || '');
                    setEmail(json.address.email || '');
                    setPhone(json.address.phone || '');
                }
            } catch (error) {
                console.error("Lỗi khi gọi API: ", error);
            }
        }

        fetchData();
    }, [token]);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement> | undefined) {
        e?.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    address,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Đã có lỗi xảy ra');
            }

            alert('Cập nhật địa chỉ thành công');
            router.push('/user/addresses');
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message || 'Đã có lỗi xảy ra');
            } else {
                console.error('Đã có lỗi xảy ra');
            }
        } finally {
            // Ensure loading state is handled properly
        }
    }

    if (!data?.address || !data?.user) {
        return <div>Loading...</div>;
    }

    return (
        <MainLayout>
            <div className="mt-[200px] pt-10 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-900">Cập nhật địa chỉ</h2>
                <p className="mt-1 text-sm text-gray-600">Nhập thông tin địa chỉ để chúng tôi có thể phục vụ bạn tốt
                    hơn.</p>

                <form onSubmit={(e) => handleSubmit(e)} className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Họ</label>
                            <input type="text" value={lastName || ''}
                                   onChange={(e) => setLastName(e.target.value)}
                                   className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                   placeholder="Nhập họ của bạn"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên</label>
                            <input type="text" value={firstName || ''}
                                   onChange={(e) => setFirstName(e.target.value)}
                                   className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                   placeholder="Nhập tên của bạn"/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email || ''}
                               onChange={(e) => setEmail(e.target.value)}
                               className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                               placeholder="example@gmail.com"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input type="text" value={phone || ''}
                               onChange={(e) => setPhone(e.target.value)}
                               className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input type="text" value={address}
                               onChange={(e) => setAddress(e.target.value)}
                               className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                               placeholder="Số nhà, tên đường..."/>
                    </div>


                    <Field className="flex items-center gap-x-4 sm:col-span-2">
                        <Switch
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                            className={`${agree ? 'bg-indigo-600' : 'bg-gray-200'} 
              relative inline-flex h-6 w-11 items-center rounded-full transition`}
                        >
              <span
                  className={`${
                      agree ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
                        </Switch>
                        <Label className="text-sm text-gray-600">
                            Bằng cách lựa chọn mục này, bạn sẽ chia sẻ cho chúng tôi thông tin cá nhân.
                        </Label>
                    </Field>

                    <div className="flex justify-end gap-4">
                        <button type="button" className="btn-cancel bg-red-500 px-3 py-2 rounded-md">Hủy</button>
                        <button type="submit"
                                className={`btn-submit ${agree ? 'bg-green-500' : 'bg-green-300'} px-3 py-2 rounded-md )}`}
                                disabled={!agree}>Lưu
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
