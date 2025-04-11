import Link from "next/link";

export default function FogotPass() {
  return (
    <div className="bg-white h-screen justify-center relative text-center content-center isolate overflow-hidden py-16 sm:py-24 lg:py-32 border border-spacing-6 border-gray-950" >
            
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900">Quên mật khẩu</h2>
            <p className="mt-4 text-lg text-gray-800">
              Đăng ký vào để có nhiều tiện ích hơn
            </p>
            <div className="mt-6 contents max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Địa chỉ email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                autoComplete="email"
                className="min-w-0 text-center flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 border border-gray-950 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
              <button
                type="submit"
                className="items-center ml-2 rounded-md text-center bg-green-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Lấy lại mật khẩu
              </button>

            </div>
            <div>
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Quay lại{' '}
              <Link href="/admin/auth/login" className="font-semibold text-green-700 hover:text-green-800">
                Đăng nhập
              </Link>
            </p>
            </div>
            <div>
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Chưa có tài khoản?{' '}
              
             <Link href = "/" className="font-semibold text-green-700 hover:text-green-800">Trở thành khách hàng</Link>
            </p>
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
