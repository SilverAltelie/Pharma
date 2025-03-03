'use client'

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Field, Label, Switch } from '@headlessui/react'
import { use, useEffect, useState } from 'react'
import AdminLayout from '@/app/admin/admin-layout'

export default function ProductCreate() {

  const [agreed, setAgreed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState<string | null>(null);
  

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageBase64(base64String.split(",")[1]); // Bỏ phần "data:image/png;base64,"
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageBase64) return alert("Vui lòng tải lên ảnh!");

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (response.ok) {
      alert("Ảnh đã được lưu vào database!");
    } else {
      alert("Lỗi khi lưu ảnh.");
    }
  };

    useEffect(() => {
        async function fetchData() {
            try {
            const res = await fetch("/api/admin-data");
            const json = await res.json();
            setCategories(json.categories);
            } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
            }
        }
        fetchData();
        }, []);


        if (categories.length === 0 ) {
            return <p className="text-center py-6">Đang tải dữ liệu...</p>;
        }

  return (
    <AdminLayout>
    <form className='bg-white px-80'>
        <h2 className="font-semibold text-gray-900">Thêm sản phẩm</h2>
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm/6 font-semibold text-gray-900">
              Tên sản phẩm 
            </label>
            <div className="mt-2.5">
              <input
                id="title"
                name="title"
                type="text"
                autoComplete="given-name"
                className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
              Số lượng
            </label>
            <div className="mt-2.5">
              <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="family-name"
                className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
              Giá cả
            </label>
            <div className="mt-2.5">
              <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="family-name"
                className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="content" className="block w-full text-sm/6 font-semibold text-gray-900">
              Mô tả chi tiết sản phẩm
            </label>
            <div className="mt-2.5">
              <textarea
                id="content"
                name="content"
                rows={4}
                className="block w-full rounded-md border-2 bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
              Danh mục
            </label>
            <div className="mt-2.5">
              <select
                id="category"
                name="category"
                autoComplete="category"
                className="block border-2 w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                {categories.map((category: any) => (
                  <option key={category.id}>{category.name}</option>
                ))}
                </select>
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-900">Ảnh sản phẩm</label>
            <div className="mt-2 flex items-center gap-x-3">
                {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-44 h-44 object-cover rounded-md" />
                ) : (
                <UserCircleIcon aria-hidden="true" className="size-12 text-gray-300" />
                )}
                <input type="file" id="photo" accept="image/*" className="hidden" onChange={handleImageChange} />
                <label htmlFor="photo" className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                Đăng
                </label>
            </div>
            </div>
          <div className="sm:col-span-2">
            <label htmlFor="status" className="block text-sm/6 font-semibold text-gray-900">
              Trạng thái
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    id="status"
                    name="status"
                    autoComplete="status"
                    aria-label="status"
                    className="col-start-1 border-2 row-start-1 w-full appearance-none rounded-md py-2 pr-7 pl-3.5 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value={0}>Ẩn</option>
                    <option value={1}>Hiện</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none border-2 col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Field className="flex items-center gap-x-4 sm:col-span-2">
            <Switch
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className={`${agreed ? 'bg-indigo-600' : 'bg-gray-200'} 
              relative inline-flex h-6 w-11 items-center rounded-full transition`}
            >
              <span
                className={`${
                  agreed ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <Label className="text-sm text-gray-600">
              Bằng cách lựa chọn mục này, bạn sẽ chia sẻ cho chúng tôi thông tin cá nhân.
            </Label>
          </Field>
        </div>
        <div className="my-5">
          <button 
            onClick={handleSubmit}
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Đăng ký mặt hàng
          </button>
        </div>
        
    </form>
    </AdminLayout>
  )
}
