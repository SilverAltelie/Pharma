'use client'
import { useState } from 'react'
import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [rePassword, setRePassword] = useState('');
  const router = useRouter();

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn form reload trang

    const userData = { name, email, password, rePassword };

    try {

      if (password !== rePassword) {
        setMessage('Mật khẩu không trùng khớp.');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log("Server response:", data); // In response từ API ra console

      if (res.ok) {
        alert('Đăng ký thành công! Kiểm tra email để xác nhận.');
        router.push('/auth/login');
      } else {
        setMessage(data.error || 'Đăng ký thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      setMessage('Không thể kết nối tới server, vui lòng thử lại.');    }
  };

  return (
      <div className="bg-white h-screen relative content-center isolate overflow-hidden py-16 sm:py-24 lg:py-32 border border-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-4xl font-semibold tracking-tight text-gray-900">Đăng ký thành viên mới</h2>
              <p className="mt-4 text-lg text-gray-800">Đăng ký vào để có nhiều tiện ích hơn</p>
              {message && <p className="mt-2 text-sm text-red-600">{message}</p>}

              <form onSubmit={registerUser} className="mt-6 flex flex-col gap-y-4">
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên"
                    required
                    className="border px-3 py-2 rounded-md text-black"
                />
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    required
                    className="border px-3 py-2 rounded-md text-black"
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    className="border px-3 py-2 rounded-md text-black"
                />
                <input
                    type="password"
                    name="re-password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className="border px-3 py-2 rounded-md text-black"
                />
                <button
                    type="submit"
                    className="rounded-md bg-green-800 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-green-900"
                >
                  Đăng ký
                </button>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Đã có tài khoản?{' '}
                <a href="/auth/login" className="font-semibold text-green-700 hover:text-green-800">
                  Đăng nhập
                </a>{' '}
                hoặc{' '}
                <a href="/" className="font-semibold text-green-700 hover:text-green-800">
                  Trở thành khách hàng
                </a>
              </p>
            </div>

            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                  <CalendarDaysIcon aria-hidden="true" className="size-6 text-gray-900" />
                </div>
                <dt className="mt-4 text-base font-semibold text-black">Weekly articles</dt>
                <dd className="mt-2 text-base text-gray-800">
                  Dễ dàng theo dõi đơn hàng và lịch sử mua hàng, đồng thời giúp bạn truy cập vào giỏ hàng bất cứ nơi đâu.
                </dd>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                  <HandRaisedIcon aria-hidden="true" className="size-6 text-gray-900" />
                </div>
                <dt className="mt-4 text-base font-semibold text-black">No spam</dt>
                <dd className="mt-2 text-base text-gray-800">
                  Thao tác thuận tiện với các gợi ý về mặt hàng bạn muốn mua ở hiện tại và tương lai.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
  );
}
