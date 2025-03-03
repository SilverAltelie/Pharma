'use client'

import { ChevronDownIcon } from '@heroicons/react/16/solid';
import MainLayout from '@/app/_userlayout';
import { useState } from 'react';
import { Field, Label, Switch } from '@headlessui/react';

export default function AddressCreate() {
  const [agree, setAgree] = useState(false);
  return (
    <MainLayout>
      <div className="mt-[200px] pt-10 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900">Thêm địa chỉ</h2>
        <p className="mt-1 text-sm text-gray-600">Nhập thông tin địa chỉ để chúng tôi có thể phục vụ bạn tốt hơn.</p>

        <form className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ</label>
              <input type="text" className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="Nhập họ của bạn" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên</label>
              <input type="text" className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="Nhập tên của bạn" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="example@gmail.com" />
          </div>

          <div>
            <label className="sm:col-span-3 block text-sm/6 font-medium text-gray-900">Quốc gia</label>
            <div className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              <select className="border-2 col-start-1 row-start-1 w-1/4 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                <option>Việt Nam</option>
                <option>United States</option>
                <option>Canada</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input type="text" className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="Số nhà, tên đường..." />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Thành phố</label>
              <input type="text" className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tỉnh / Bang</label>
              <input type="text" className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mã bưu điện</label>
              <input type="text" className="border-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
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
            <button type="submit" className={`btn-submit ${agree ? 'bg-green-500' : 'bg-green-300'} px-3 py-2 rounded-md )}`} disabled={!agree}>Lưu</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

// CSS Utility Classes (Tailwind)
const inputField = "w-full mt-2 p-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none";
const btnCancel = "px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100 transition";
const btnSubmit = "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition";
