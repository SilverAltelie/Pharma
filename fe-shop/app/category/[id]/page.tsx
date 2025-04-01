'use client'

import MainLayout from "@/app/_userlayout";
import {useState, useEffect, use} from "react";
import {FaCartPlus} from "react-icons/fa";

export default function CategoryPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);

    interface Product {
        id: string;
        title: string;
        href: string;
        image: string;
        price: string;
        color: string;
        variants: any[];
    }

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${id}`);
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();
                setProducts(data.products.data);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchData();
    }, []);

    if (!products) {
        return <div>Loading... </div>;
    }

    async function handleAddToCart($product_id: string) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/addProduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({product_id: $product_id, quantity: 1}),
            });
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();
            console.log(data);
            alert('Thêm sản phẩm vào giỏ hàng thành công');
            setProducts(data.products.data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <MainLayout>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sản phẩm cho </h2>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {products.map((product: Product) => (
                            <div key={product.id} className="group relative">
                                {product.variants.length <= 0 ? <button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="absolute top-1 z-50 right-1 p-2 bg-green-700 rounded-md text-white text-lg"
                                >
                                    <FaCartPlus/>
                                </button> : ''}
                                <img
                                    alt={product.title}
                                    src={`data:image/jpeg;base64,${product.image}`}
                                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                />
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm text-gray-700">
                                            <a href={`/product/${product.id}`}>
                                                <span aria-hidden="true" className="absolute inset-0"/>
                                                {product.title}
                                            </a>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
  