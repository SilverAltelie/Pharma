'use client'

import MainLayout from '@/app/_userlayout';
import {useState} from 'react';
import {Field, Label, Switch} from '@headlessui/react';
import {useRouter} from "next/navigation";

export default function AddressCreate() {
    const [agree, setAgree] = useState(false);
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const router = useRouter();


    async function handleSubmit(e: React.FormEvent<HTMLFormElement> | undefined) {
        e?.preventDefault();
        setError('');

        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({first_name: firstName, last_name: lastName, email, phone, address, is_default: '0'}),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Đã có lỗi xảy ra');
            }

            alert('Thêm địa chỉ thành công');
            router.push('/user/addresses');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Đã có lỗi xảy ra');
            } else {
                setError('Đã có lỗi xảy ra');
            }
        } finally {
            setLoading(false);
        }

    }

    if (loading) {
        return (
            <MainLayout>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"/>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        throw new Error(error);
    }

    return (
        <MainLayout>
            <div className="mt-[200px] pt-10 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-900">Thêm địa chỉ</h2>
                <p className="mt-1 text-sm text-gray-600">Nhập thông tin địa chỉ để chúng tôi có thể phục vụ bạn tốt
                    hơn.</p>

                <form onSubmit={(e) => handleSubmit(e)} className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Họ</label>
                            <input type="text" name="last_name"
                                   value={lastName}
                                   onChange={(e) => setLastName(e.target.value)}
                                   className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                   placeholder="Nhập họ của bạn"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên</label>
                            <input type="text" name="first_name"
                                   value={firstName}
                                   onChange={(e) => setFirstName(e.target.value)}
                                   className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                   placeholder="Nhập tên của bạn"/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                               placeholder="example@gmail.com"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input type="text" name="phone"
                               value={phone}
                               onChange={(e) => setPhone(e.target.value)}
                               className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                               placeholder="0123456789"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input type="text" name="address"
                               value={address}
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
