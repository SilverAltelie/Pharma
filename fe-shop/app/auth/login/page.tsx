'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(''); // Thêm state notification để lưu thông báo.

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }

      localStorage.setItem('token', data.token);
      alert('Đăng nhập thành công');
      router.push('/');
    } catch (err: any) {
      setError(err.error || 'Đăng nhập không thành công');
    }
  };

  // Xử lý thông báo email xác minh thành công
  useEffect(() => {
    const fetchMessage = async () => {
      const query = new URLSearchParams(window.location.search);
      const message = query.get('message');
      if (message === 'email-verified-successfully') {
        setNotification('Email của bạn đã được xác minh thành công! Vui lòng đăng nhập.');
      } else if (message === 'password-reset-successfully') {
        setNotification('Mật khẩu của bạn đã được đặt lại thành công! Vui lòng đăng nhập.');
      }
    };
    fetchMessage();
  }, []); // Chạy 1 lần khi component được mount

  return (
      <div className="bg-white flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Your Company" src="/favicon.ico" className="mx-auto h-10 w-auto" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Đăng nhập
          </h2>

          {/* Hiển thị thông báo nếu có */}
          {notification && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                {notification}
              </div>
          )}

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 w-full">
                Địa chỉ Email
              </label>
              <div className="mt-2">
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="block border border-gray-800 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-5 outline-slate-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                >
                  Mật khẩu
                </label>
                <div className="text-sm">
                  <a
                      href="/auth/forgot-pass"
                      className="font-semibold text-green-700 hover:text-green-800"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="block w-full border border-gray-800 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-green-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Đăng nhập
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Chưa có tài khoản?{' '}
            <a
                href="/auth/register"
                className="font-semibold text-green-700 hover:text-green-800"
            >
              Đăng ký
            </a>{' '}
            &nbsp; Hoặc &nbsp;
            <a
                href="/"
                className="font-semibold text-green-700 hover:text-green-800"
            >
              Trở thành khách hàng
            </a>
          </p>
        </div>
      </div>
  );
}