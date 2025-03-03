'use client'

import { loginService } from "@/app/api/auth/login/route";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    setError('');

    try {
      const token = await loginService(email, password);
      localStorage.setItem('token', token);
      alert('Đăng nhập thành công');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công');
    }
  };


    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div className="bg-white flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 h-screen">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="/favicon.ico"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Đăng nhập
            </h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
                  <label htmlFor="password" className=" block text-sm/6 font-medium text-gray-900">
                    Mật khẩu
                  </label>
                  <div className="text-sm">
                    <a href="/auth/forgot-pass" className="font-semibold text-green-700 hover:text-green-800">
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
              <a href="/auth/register" className="font-semibold text-green-700 hover:text-green-800">
                Đăng ký
              </a> 
              &nbsp; Hoặc &nbsp;
             <a href = "/" className="font-semibold text-green-700 hover:text-green-800">Trở thành khách hàng</a>
            </p>
              
          </div>
        </div>
      </>
    )
  }
  