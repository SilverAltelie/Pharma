'use client'

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Field, Label, Switch } from '@headlessui/react'
import { use, useEffect, useState } from 'react'
import AdminLayout from '@/app/admin/admin-layout'
import {ReactFormState} from "react-dom/client";
import {jsonString} from "next/dist/client/components/react-dev-overlay/server/shared";
import {useRouter} from "next/navigation";

export default function ProductCreate() {

    const [categories, setCategories] = useState([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageBase64List, setImageBase64List] = useState<string[]>([]);
    const router = useRouter();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const previews: string[] = [];
            const base64List: string[] = [];

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    previews.push(base64String);
                    base64List.push(base64String.split(",")[1]); // Loại bỏ "data:image/png;base64,"

                    // Cập nhật state sau khi xử lý tất cả ảnh
                    if (previews?.length === files?.length) {
                        setImagePreviews(previews); // Hiển thị preview ảnh
                        setImageBase64List(base64List); // Danh sách base64 để gửi API
                    }
                };
                reader.readAsDataURL(file); // Đọc file
            });
        }
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const title = formData.get("title") as string;
        const price = Number(formData.get("price") as string);
        const quantity = Number(formData.get("quantity") as string);
        const description = formData.get("description") as string;
        const status = formData.get("status") as string;
        const category_id = formData.get("category_id") as string;
        const content = formData.get("content") as string;

        if (!title || isNaN(price) || isNaN(quantity) || !category_id || !description) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (imageBase64List?.length === 0) {
            alert("Vui lòng tải lên ít nhất một ảnh!");
            return;
        }

        const payload = {
            title,
            price,
            quantity,
            content,
            description,
            status,
            category_id,
            image: imageBase64List[0], // Ảnh chính
            images: imageBase64List    // Mảng ảnh base64
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/product/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert("Sản phẩm và ảnh đã được lưu vào database!");
            router.push('/admin/products');
        } else {
            alert("Đã xảy ra lỗi khi lưu sản phẩm.");
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category`, {
                method: "GET",
                headers: { "Content-Type": "application/json",
                    'Accept': 'application/json',
                }
            });
            const json = await res.json();
            setCategories(json);
            } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
            }
        }
        fetchData();
        }, []);


        if (categories?.length === 0 ) {
            return <p className="text-center py-6">Đang tải dữ liệu...</p>;
        }

  return (
    <AdminLayout>
    <form onSubmit={handleSubmit} className='bg-white px-80'>
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
            <label htmlFor="quantity" className="block text-sm/6 font-semibold text-gray-900">
              Số lượng
            </label>
            <div className="mt-2.5">
              <input
                id="quantity"
                name="quantity"
                type="text"
                autoComplete="family-name"
                className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm/6 font-semibold text-gray-900">
              Giá cả
            </label>
            <div className="mt-2.5">
              <input
                id="price"
                name="price"
                type="text"
                autoComplete="family-name"
                className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>

        <div>
            <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
                Mô tả sơ bộ
            </label>
            <div className="mt-2.5">
                <input
                    id="description"
                    name="description"
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
            <label htmlFor="category_id" className="block text-sm/6 font-semibold text-gray-900">
              Danh mục
            </label>
            <div className="mt-2.5">
              <select
                id="category_id"
                name="category_id"
                autoComplete="category_id"
                className="block border-2 w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              >
                {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
                </select>
            </div>
          </div>

        <div className="col-span-full">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                Upload Images
            </label>
            <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md"
            />
            <div className="mt-2 flex space-x-4">
                {imagePreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Preview ${index}`} className="h-20 w-20 object-cover rounded" />
                ))}
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
                    <option value={'0'}>Ẩn</option>
                    <option value={'1'}>Hiện</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none border-2 col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="my-5">
          <button
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
