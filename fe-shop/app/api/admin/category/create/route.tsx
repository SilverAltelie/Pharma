export async function createCategoryService(
    name: string,
    description: string,
    status: boolean,
    parent_id?: number | null
  ) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, description, status, parent_id }),
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
  