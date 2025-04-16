'use client'

import { useEffect, useState } from "react";
import AdminLayout from "../admin-layout";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import Link from "next/link";
import type {Product} from "../../type";


export default function Products() {
    /*interface Product {
        id: number;
        images: Image[];
        description: string;
        title: string;
        price: string;
    }*/

    /*type Image = {
        id: number;
        image: string;
    }
*/
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/product?page=${currentPage}`, {
                    headers: { "Authorization": `Bearer ${sessionStorage.getItem('adminToken')}` },
                });
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();
                setProducts(data.data);
                setLastPage(data.last_page);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fetchData();
    }, [currentPage]);


    async function handleDelete(id:number) {
        const isConfirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm?")

        if (!isConfirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/product/delete/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("adminToken")}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            window.location.reload();
        } catch {
            throw new Error();
        }
    }
    return (
        <AdminLayout>
      <div className="bg-white h-full">
        <div className="flex flex-col justify-between mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="flex items-center mb-6 justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sản phẩm đang bán</h2>
            <Link href="/admin/products/create" className="bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                <button
                onClick={() => router.push("/admin/products/create")}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                    <FaPlus />
                </button>
          </Link>

          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products?.map((product) => (
              <div key={product.id} className="group relative">
                <div className="group relative">
                  <button
                    onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                    className="absolute top-2 right-2 z-50 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                    ><FaPencil /></button>
                    <button
                    onClick={() => handleDelete(parseInt(product.id))}
                    className="absolute top-2 right-12 z-50 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                    ><FaTrash /></button>
                </div>

                  <img
                      alt={product.description}
                      src={`data:image/png;base64,${product.images ? product.images[0]?.image : ''}`}
                      className="aspect-square w-full rounded-md bg-gray-200 lg:aspect-auto lg:h-80"
                  />

                  <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link className="no-underline text-black" href={`/admin/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                </div>
              </div>
            ))}



          </div>
        </div>
          <div className="flex justify-center items-center mb-40">
              <div className="flex space-x-2">
                  <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
                  >
                      Trước
                  </button>

                  {[...Array(lastPage)].map((_, index) => (
                      <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-4 py-2 rounded ${
                              currentPage === index + 1
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                      >
                          {index + 1}
                      </button>
                  ))}

                  <button
                      disabled={currentPage === lastPage}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
                  >
                      Tiếp
                  </button>
              </div>
          </div>
      </div>
      </AdminLayout>
    )
  }

  