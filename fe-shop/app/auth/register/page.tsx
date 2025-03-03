'use client'
import { useState } from 'react'

import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'
import { registerService } from '@/app/api/auth/register/route';

export default function Register() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const token = await registerService(email);
        alert('Đăng ký thành công! Token: ' + token);
    } catch (error: any) {
        alert(error.message || 'Có lỗi xảy ra khi đăng ký!');
    }
};


  return (
    <div className="bg-white h-screen relative content-center isolate overflow-hidden py-16 sm:py-24 lg:py-32 border border-spacing-6 border-gray-950" >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900">Đăng ký thành viên mới</h2>
            <p className="mt-4 text-lg text-gray-800">
              Đăng ký vào để có nhiều tiện ích hơn
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <form onSubmit={handleSubmit} className='flex gap-x-4'>
              <label htmlFor="email-address" className="sr-only">
                Địa chỉ email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Hãy nhập email"
                autoComplete="email"
                className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 border border-gray-950 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
              <button
                type="submit"
                className="flex-none rounded-md bg-green-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Đăng ký
              </button>
              </form>
            </div>
            <div>
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Đã có tài khoản?{' '}
              <a href="/auth/login" className="font-semibold text-green-700 hover:text-green-800">
                Đăng nhập
              </a> 
              &nbsp; Hoặc &nbsp;
             <a href = "/" className="font-semibold text-green-700 hover:text-green-800">Trở thành khách hàng</a>
            </p>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <CalendarDaysIcon aria-hidden="true" className="size-6 text-gray-900" />
              </div>
              <dt className="mt-4 text-base font-semibold text-white">Weekly articles</dt>
              <dd className="mt-2 text-base/7 text-gray-800">
                Dễ dàng theo dõi đơn hàng và lịch sử mua hàng, đồng thời giúp bạn truy cập được vào giỏ hàng bất cứ nơi đâu.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <HandRaisedIcon aria-hidden="true" className="size-6 text-gray-900" />
              </div>
              <dt className="mt-4 text-base font-semibold text-white">No spam</dt>
              <dd className="mt-2 text-base/7 text-gray-800">
                Thao tác thuận tiện với các gợi ý về mặt hàng bạn muốn mua ở hiện tại và tương lai.
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-1155/678 w-[72.1875rem] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
    </div>
  )
}
