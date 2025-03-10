'use client'

import { use, useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import AdminLayout from "@/app/admin/admin-layout";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Show({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    type Variant = {
        id: string;
        name: string;
        price: string;
        quantity: number;
        product_id: string;
    };

    type Product = {
        image: string;
        title: string;
        price: string;
        quantity: number;
        description: string;
        content: string;
        variants: Variant[];
        reviews: Review[];
    };

    type Review = {
        rate: number;
    };

    const [product, setProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    async function fetchData() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/product/show/${id}`);
        const data = await res.json();
        setProduct(data);

        const variants = data.variants;
        setVariants(variants || []);
        setReviews(data.reviews || [])
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveVariant = async (event: React.FormEvent) => {
        event.preventDefault(); // Chặn reload trang

        if (!editingVariant) return;

        const variantData = {
            name: editingVariant?.name || "",
            price: Number(editingVariant?.price) || 0,
            quantity: Number(editingVariant?.quantity) || 0,
            product_id: id,
        };

        console.log("Sending data:", variantData);

        const url = editingVariant?.id
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/variants/update/${editingVariant.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/variants/create`;

        const method = "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(variantData),
            });

            console.log("Full response:", response);

            const result = await response.json();
            console.log("API Response:", result);

            if (!response.ok) {
                console.error(`Lỗi API - Status Code: ${response.status}`);
                throw new Error(result.message || `Lỗi API: ${response.status}`);
            }
            fetchData()

            setIsEditing(false);
        } catch (error) {
            console.error("Lỗi khi gửi API:", error);
            alert(`Lỗi khi lưu variant: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };



    const handleDeleteVariant = async (id: string) => {
        const confirm = window.confirm("Bạn có muốn xóa phân loại này không?")

        if (!confirm) return;

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/variants/delete/${id}`;
        const method = "POST";
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", },
        });
        fetchData();
    }

    useEffect(() => {
        if (variants.length > 0) {
            setSelectedVariant(variants[0]);
        }
    }, [variants]);

    if (!product) return <div>Loading...</div>;

    return (
        <AdminLayout>
            <div className="bg-white">
                <div className="pt-6">
                    <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                        <img
                            src={`data:image/png;base64,${product?.image}`}
                            className="hidden size-full rounded-lg object-cover lg:block"
                        />
                        <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                            <img
                                src={`data:image/png;base64,${product?.image}`}
                                className="aspect-3/2 w-full rounded-lg object-cover"
                            />
                            <img src={`data:image/png;base64,${product?.image}`}
                                 className="aspect-3/2 w-full rounded-lg object-cover"
                            />
                        </div>
                        <img
                            src={`data:image/png;base64,${product?.image}`}
                            className="aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-auto"
                        />
                    </div>

                    <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product?.title}</h1>
                        </div>

                        <div className="mt-4 lg:row-span-3 lg:mt-0">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-gray-900">{variants.length > 0 ? selectedVariant?.price : product?.price}</p>

                            <div className="mt-6">
                                <h3 className="sr-only">Reviews</h3>
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        {Array.from({ length: 5 }).map((_, rating) => (
                                            <StarIcon
                                                key={rating}
                                                aria-hidden="true"
                                                className={classNames(
                                                    reviews.length > 0 && reviews[0].rate > rating ? 'text-gray-900' : 'text-gray-200',
                                                    'size-5 shrink-0 text-yellow-400',
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="sr-only text-yellow-400">
                                        {reviews.length > 0 ? reviews[0].rate : 0} out of 5 stars
                                    </p>
                                    <span className="ml-3 text-sm font-medium text-indigo-600">
                                        {reviews.length} reviews
                                    </span>
                                </div>
                            </div>

                            <form className="mt-10">
                                <div className="mt-10">
                                    <p className="text-sm text-gray-900">Kho còn: {selectedVariant?.quantity ? selectedVariant?.quantity : product?.quantity }</p>
                                </div>

                                <fieldset aria-label="Choose a size" className="mt-4">
                                    <RadioGroup
                                        value={selectedVariant}
                                        onChange={setSelectedVariant}
                                        className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                                    >
                                        {variants.map((variant: Variant) => (
                                            <Radio
                                                key={variant.id}
                                                value={variant}
                                                disabled={variant.quantity <= 0}
                                                className={classNames(
                                                    variant.quantity > 0
                                                        ? 'cursor-pointer bg-white text-gray-900 shadow-xs'
                                                        : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                    'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-hidden data-focus:ring-2 data-focus:ring-indigo-500 sm:flex-1 sm:py-6',
                                                )}
                                            >
                                                <span>{variant.name}</span>
                                                {variant.quantity > 0 ? (
                                                    <div >
                                                    <span
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            selectedVariant == variant ? 'ring-2 ring-green-700 ' : '',
                                                            'pointer-events-none absolute -inset-px rounded-md border-2 border-transparent'
                                                        )}
                                                    />
                                                        <a
                                                            onClick={() => {
                                                                setEditingVariant(variant);
                                                                setIsEditing(true);
                                                            }}
                                                            className="absolute z-50 right-0 top-0 cursor-pointer"
                                                        >
                                                            <FaPencil className="w-5 h-5 p-1 rounded-1 bg-blue-500 text-white" />
                                                        </a>

                                                        <a className="absolute z-50 right-6 top-0" onClick={() => handleDeleteVariant(variant.id)}>
                                                            <FaTrash className={"w-5 h-5 p-1 rounded-1  bg-red-500 text-white"}/>
                                                        </a>
                                                    </div>

                                                ) : (
                                                    <span
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                                    >
                                                    <svg
                                                        stroke="currentColor"
                                                        viewBox="0 0 100 100"
                                                        preserveAspectRatio="none"
                                                        className="absolute inset-0 size-full stroke-2 text-gray-200"
                                                    >
                                                      <line x1={0} x2={100} y1={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                    </svg>
                                                  </span>
                                                )}
                                            </Radio>
                                        ))}

                                        <a
                                            onClick={() => {
                                                setEditingVariant(null);
                                                setIsEditing(true);
                                            }}
                                            className="rounded-md content-center align-content-between px-4 py-4 bg-green-800 text-green-300 cursor-pointer"
                                        >
                                            <FaPlus className="w-8 h-8 text-white" />
                                        </a>

                                    </RadioGroup>

                                    {isEditing && (
                                        <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                            <h3 className="text-lg font-semibold">{editingVariant ? "Sửa Variant" : "Tạo Variant"}</h3>

                                            <input
                                                type="text"
                                                className="w-full p-2 mt-2 border rounded"
                                                placeholder="Tên Variant"
                                                value={editingVariant?.name || ""}
                                                onChange={(e) =>
                                                    setEditingVariant((prev) => ({
                                                        ...(prev || { id: "", name: "", price: "", quantity: 0, product_id: "" }),
                                                        name: e.target.value
                                                    }))
                                                }
                                            />

                                            <input
                                                type="number"
                                                className="w-full p-2 mt-2 border rounded"
                                                placeholder="Số lượng"
                                                value={editingVariant?.quantity || ""}
                                                onChange={(e) =>
                                                    setEditingVariant((prev) => ({
                                                        ...(prev || { id: "", name: "", price: "", quantity: 0, product_id: "" }),
                                                        quantity: parseInt(e.target.value) || 0
                                                    }))
                                                }
                                            />

                                            <input
                                                type="number"
                                                className="w-full p-2 mt-2 border rounded"
                                                placeholder="Giá"
                                                value={editingVariant?.price || ""}
                                                onChange={(e) =>
                                                    setEditingVariant((prev) => ({
                                                        ...(prev || { id: "", name: "", price: "", quantity: 0, product_id: "" }),
                                                        price: e.target.value
                                                    }))
                                                }
                                            />


                                            <div className="flex justify-end mt-4">
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-2 mr-2 text-gray-700 border rounded"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    onClick={handleSaveVariant}
                                                    className="px-4 py-2 text-white bg-green-600 rounded"
                                                >
                                                    Lưu
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </fieldset>

                            </form>
                        </div>

                        <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
                            <div>
                                <h3 className="sr-only">Description</h3>

                                <div className="space-y-6">
                                    <p className="text-base text-gray-900">{product?.description}</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h2 className="text-sm font-medium text-gray-900">Details</h2>

                                <div className="mt-4 space-y-6">
                                    <p className="text-sm text-gray-600">{product?.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}