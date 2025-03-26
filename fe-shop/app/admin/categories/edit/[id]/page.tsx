'use client'

import { use, useEffect, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import {useRouter} from 'next/navigation'
import AdminLayout from '@/app/admin/admin-layout'

export default function CategoryUpdate({params}: {params: Promise<{id: string}>}) {
    const {id} = use(params)
  const [agreed, setAgreed] = useState(false)
  const [categories, setCategories] = useState([])
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
        const data = await res.json()
        setCategories(data)
    }
    fetchCategories()
    }, [])

    const current = categories.find((category: { 
        id: string; 
        name: string; 
        description: string; 
        status: number; 
        parent_id: string | null }) => category.id == id) as { 
            id: string; 
            name: string; 
            description: string; 
            status: number; 
            parent_id: string | null } | undefined

    if (!current || categories.length === 0) {
        return <p className="text-center py-6">Đang tải dữ liệu...</p>;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const status = formData.get('status') as string
        const parent_id = formData.get('parent_id') || null

      try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/category/update/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ name, description, status, parent_id })
          })

        const text = await res.text();
        console.log('Phản hồi dạng text:', text);

        let result;
        try {
          result = JSON.parse(text);
        } catch (error) {
          console.error('Lỗi parse JSON:', error, 'Dữ liệu nhận được:', text);
          alert('Lỗi phản hồi từ server, vui lòng thử lại!');
          return;
        }

        if (res.ok) {
          alert('Sửa danh mục thành công!');
          router.push('/admin/categories');
        } else {
          alert('Lỗi: ' + (result.message || 'Lỗi không xác định'));
        }
      } catch (error) {
        throw error;
      }
    }

  return (
    <AdminLayout>
    <div className="isolate h-full bg-white px-6 py-12 sm:py-12 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      >
        
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Sửa danh mục</h2>
        <p className="mt-2 text-lg/8 text-gray-600">Các danh mục giúp bạn quản lý các mặt hàng dễ dàng hơn, hãy tạo các danh mục 1 cách rõ ràng.</p>
      </div>
      <form action="#" onSubmit={handleSubmit} method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6">
          <div>
            <label htmlFor="name" className="block text-sm/6 font-semibold text-gray-900">
              Tên danh mục
            </label>
            <div className="mt-2.5">
              <input
                id="name"
                name="name"
                defaultValue={current ? current.name : ''}
                type="text"
                autoComplete="given-name"
                className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm/6 font-semibold text-gray-900">
              Mô tả danh mục
            </label>
            <div className="mt-2.5">
              <input
                id="description"
                name="description"
                defaultValue={current ? current.description : ''}
                type="text"
                autoComplete="organization"
                className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          
          <div className="sm:col-span-2">
            
            <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900">
              Trạng thái
            </label>
              <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    id="status"
                    name="status"
                    autoComplete="status"
                    defaultValue={current ? current.status : 0}
                    aria-label="status"
                    className="col-start-1 border-2 row-start-1 w-full appearance-none rounded-md py-1 pr-7 pl-3.5 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value = {0}>Ẩn</option>
                    <option value = {1}>Hiện</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="parent_id" className="block mt-2 text-sm/6 font-semibold text-gray-900">
              Danh mục cha
            </label>
            <select
                  id="parent_id"
                  name="parent_id"
                    defaultValue={current && current.parent_id !== null ? current.parent_id : ''}
                  className="block w-full border-2 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                >
                <option value="">Không có</option>
                {categories.map((category: any) => (
                    category.parent_id === null && <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
              </div>    
          </div>

        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sửa danh mục
          </button>
        </div>
      </form>
    </div>
    </AdminLayout>
  )
}
