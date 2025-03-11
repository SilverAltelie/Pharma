'use client'
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [token, setToken] = useState(searchParams.get('token') || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');

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
        } catch (error) {
            setMessage('Lỗi kết nối đến server!');
        }
    };

    return (
        <div>
            <h2>Đặt lại mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                />
                <button type="submit">Cập nhật mật khẩu</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
