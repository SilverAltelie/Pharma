export async function loginService(email: string, password: string) {
    const res = await fetch('http://localhost:8000/api/login',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({email, password}),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Đăng nhập thất bại');
    } 

    const data = await res.json();
    return data.token;
}