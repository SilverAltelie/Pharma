export async function fetchCategories() {
    try {
        const res = await fetch('http://localhost:8080/api/category', { // Thêm `await`
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (res.status === 204) {
            return { message: 'No content' };
        }

        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch (error) {
            console.error('Response không phải JSON:', text);
            throw new Error('API trả về dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        throw new Error('Lỗi khi gọi API');
    }
}
