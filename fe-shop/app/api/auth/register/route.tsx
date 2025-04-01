export async function registerService(email: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Đăng ký thất bại');
    }

    const data = await res.json();
    return data.token;
}
