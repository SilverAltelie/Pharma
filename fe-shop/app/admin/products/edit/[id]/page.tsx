'use client'

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { use, useEffect, useState } from 'react'
import AdminLayout from '@/app/admin/admin-layout'
import {useRouter} from "next/navigation";

export default function UpdateProduct( {params}: {params: Promise<{id: number}>}) {
  const {id} = use(params);
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState<{ title?: string; description?: string ;quantity?: number; price?: number; content?: string; image: string; category_id?: string; status?: number }>({});


    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Hiển thị ảnh preview
    const [imageBase64List, setImageBase64List] = useState<string[]>([]); // Danh sách ảnh
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files); // Lấy danh sách file
            const previews: string[] = [];
            const base64List: string[] = [];

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    previews.push(base64String); // Hiển thị preview
                    base64List.push(base64String.split(",")[1]); // Loại bỏ phần header "data:image/png;base64,"

                    if (previews.length === files.length) {
                        setImagePreviews(previews);
                        setImageBase64List(base64List);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const title = formData.get("title") as string || product.title;
        const price = Number(formData.get("price") as string) || Number(product.price);
        const quantity = Number(formData.get("quantity") as string) || Number(product.quantity);
        const description = formData.get("description") as string || product.description;
        const status = Number(formData.get("status") as string) || Number(product.active);
        const category_id = formData.get("category_id") as string || product.category_id;
        const content = formData.get("content") as string || product.content;

        if (!title || isNaN(price) || isNaN(quantity) || !category_id || !description) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const payload = {
            title,
            price,
            quantity,
            description,
            content,
            status,
            category_id,
            image: imageBase64List[0], // Ảnh chính (nếu có)
            images: imageBase64List   // Danh sách toàn bộ ảnh
        };

        console.log(payload);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/product/update/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
            },
            body: JSON.stringify(payload),
        });

        if (res.status == 403) {
            window.location.href = `/admin/permissions/cannotaccess`;
        }

        if (res.ok) {
            alert("Sản phẩm đã được cập nhật thành công!");
            router.push('/admin/products');
        } else {
            alert("Đã xảy ra lỗi khi cập nhật sản phẩm.");
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
            const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/product/`);
                if (productRes.status == 403) {
                    window.location.href = `/admin/permissions/cannotaccess`;
                }
            const ProductJson = await productRes.json();
            const categoryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category/`);
                if (categoryRes.status == 403) {
                    window.location.href = `/admin/permissions/cannotaccess`;
                }
            const categoryJson = await categoryRes.json();
            setCategories(categoryJson);
            setProduct(ProductJson.data.find((product: any) => product.id == id));
            } catch (error) {
            console.error("Lỗi khi gọi API: ", error);
            }
        }
        fetchData();
    }, []);


    if (categories.length === 0 || !product) {
        return <p className="text-center py-6">Đang tải dữ liệu...</p>;
    }

  return (
    <AdminLayout>
    <form onSubmit={handleSubmit} className='bg-white px-80'>
        <h2 className="font-semibold text-gray-900">Sửa sản phẩm</h2>
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
                defaultValue={product?.title || ''}
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
                defaultValue={product?.quantity || ''}
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
                defaultValue={product?.price || ''}
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
                defaultValue={product?.content || ''}
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
                defaultValue={product?.category_id || ''}
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

        <div className="form-group">
            <label htmlFor="images">Ảnh sản phẩm:</label>
            <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
            />

            {/* Hiển thị ảnh preview */}
            <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                    <img
                        key={index}
                        src={preview}
                        alt={`image-preview-${index}`}
                        className="preview-image"
                    />
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
                    defaultValue={product?.status || 0}
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
