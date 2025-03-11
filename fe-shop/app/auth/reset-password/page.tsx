'use client'
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [token, setToken] = useState(searchParams.get('token') || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, password, password_confirmation: passwordConfirmation }),
            });

            const data = await res.json();
            setMessage(data.message || data.error);
            router.push('/auth/login?message=password-reset-successfully');
        } catch (error) {
            setMessage('Lỗi kết nối đến server!');
        }
    };

    return (
        <div className="bg-white h-screen flex justify-center items-center py-16 sm:py-24 lg:py-32">
            <div className="max-w-md w-full bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-3xl font-semibold text-gray-900">Đặt lại mật khẩu</h2>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Nhập mật khẩu mới"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        placeholder="Nhập mật khẩu mới"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
                    >
                        Đặt lại mật khẩu
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
