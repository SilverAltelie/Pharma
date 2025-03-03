'use client'
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SetPassword() {
    const [password, setPassword] = useState("");
    const params = useSearchParams();
    const email = params.get("email");
    const token = params.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/set-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token, password })
        });

        if (res.ok) {
            alert("Mật khẩu đã được đặt thành công!");
        } else {
            alert("Có lỗi xảy ra!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Đặt mật khẩu mới</h2>
            <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full mb-4"
                required
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
                Xác nhận
            </button>
        </form>
    );
}
