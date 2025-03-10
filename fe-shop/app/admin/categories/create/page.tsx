'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../../admin-layout'
import { useRouter } from 'next/navigation';


export default function CategoryCreate() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category/`);
        if (!res.ok) {
          console.error('Lỗi API:', res.status, res.statusText);
          return;
        }

        const text = await res.text(); // Lấy dữ liệu dạng text
        console.log('Phản hồi dạng text:', text);

        const data = JSON.parse(text); // Chuyển đổi thành JSON
        setCategories(data.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        setCategories([]);
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!(e.currentTarget instanceof HTMLFormElement)) {
      console.error("Lỗi: e.currentTarget không phải là form");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const parent_id = formData.get("parent_id") || null;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ name, description, status, parent_id }),
      });

      const text = await res.text();
      console.log("Phản hồi dạng text:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (error) {
        console.error("Lỗi parse JSON:", error, "Dữ liệu nhận được:", text);
        alert("Lỗi phản hồi từ server, vui lòng thử lại!");
        return;
      }

      if (res.ok) {
        alert("Thêm danh mục thành công!");
        router.push("/admin/categories");
      } else {
        alert("Lỗi: " + (result.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      alert("Không thể kết nối đến server!");
    }
  };

  return (
    <AdminLayout>
      <div className="isolate h-full bg-white px-6 py-12 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Thêm danh mục mới
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Các danh mục giúp bạn quản lý các mặt hàng dễ dàng hơn, hãy tạo các danh mục một cách rõ ràng.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6">
            {/* Tên danh mục */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                Tên danh mục
              </label>
              <div className="mt-2.5">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                  required
                />
              </div>
            </div>

            {/* Mô tả danh mục */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
                Mô tả danh mục
              </label>
              <div className="mt-2.5">
                <input
                  id="description"
                  name="description"
                  type="text"
                  className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
            </div>

            {/* Trạng thái */}
            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-semibold text-gray-900">
                Trạng thái
              </label>
              <div className="mt-2.5">
                <select
                  id="status"
                  name="status"
                  className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                >
                  <option value="0">Ẩn</option>
                  <option value="1">Hiện</option>
                </select>
              </div>
            </div>

            {/* Danh mục cha */}
            <div className="sm:col-span-2">
              <label htmlFor="parent_id" className="block text-sm font-semibold text-gray-900">
                Danh mục cha
              </label>
              <div className="mt-2.5">
                <select
                  id="parent_id"
                  name="parent_id"
                  className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                >
                  <option value="">Không có</option>
                  {categories.map((category) => (
                    category.parent_id === null && (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    )
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Nút submit */}
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              Đăng ký danh mục
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
