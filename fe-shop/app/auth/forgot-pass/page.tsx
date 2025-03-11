'use client'

import { useState } from "react";

export default function ForgotPass() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await res.json();
            setMessage(data.message || data.error);
        } catch {
            setMessage("Lỗi kết nối đến server!");
        }
    };

    return (
        <div className="bg-white h-screen flex justify-center items-center py-16 sm:py-24 lg:py-32">
            <div className="max-w-md w-full bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-3xl font-semibold text-gray-900">Quên mật khẩu</h2>
                <p className="mt-2 text-gray-600">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Nhập email của bạn"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
                    >
                        Lấy lại mật khẩu
                    </button>
                </form>

                {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

                <p className="mt-6 text-sm text-gray-600">
                    <a href="/auth/login" className="text-green-700 hover:text-green-800">
                        Quay lại đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
}
