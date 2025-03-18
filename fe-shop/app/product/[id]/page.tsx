'use client'

import {use, useEffect, useState} from 'react'
import {Radio, RadioGroup} from '@headlessui/react'
import MainLayout from '@/app/_userlayout';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Show({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);

    interface Product {
        content: string;
        description: string;
        id: string;
        title: string;
        image: string;
        price: string;
        quantity: number;
        variants: Variant[];
    }

    const [product, setProduct] = useState<Product | null>(null);

    interface Variant {
        id: string;
        name: string;
        price: string;
        quantity: number;
    }

    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/show/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await res.json();
                setProduct(data);
                setVariants(data.variants || []);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        }

        fetchData();
    }, [id]);

    useEffect(() => {
        if (variants.length > 0) {
            setSelectedVariant(variants[0]);
        }
    }, [variants]);

    if (!product) return <div>Loading...</div>;

    async function handleAddToCart(event: React.FormEvent, product_id: string | undefined, variant_id?: string) {
        event.preventDefault();

        if (!confirm) return;

        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/addProduct`, {
                method: 'POST',
                headers: token ? {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                } : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(
                    variant_id ? {product_id, variant_id, quantity} : {product_id, quantity}
                ),
            });

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await res.json();
            console.log(data);
            alert("Thêm vào giỏ hàng thành công!");
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <MainLayout>
            <div className="bg-white">
                <div className="pt-6">
                    <div
                        className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                        <img
                            src={`data:image/jpeg;base64,${product.image}`}
                            className="hidden size-full rounded-lg object-cover lg:block"
                        />
                        <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                            <img
                                src={`data:image/jpeg;base64,${product.image}`}
                                className="aspect-3/2 w-full rounded-lg object-cover"
                            />
                            <img
                                src={`data:image/jpeg;base64,${product.image}`}
                                className="aspect-3/2 w-full rounded-lg object-cover"
                            />
                        </div>
                        <img
                            src={`data:image/jpeg;base64,${product.image}`}
                            className="aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-auto"
                        />
                    </div>

                    <div
                        className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product?.title}</h1>
                        </div>

                        <div className="mt-4 lg:row-span-3 lg:mt-0">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-gray-900">
                                {selectedVariant ? selectedVariant.price : product?.price}
                            </p>

                            <form
                                onSubmit={(event) =>
                                    handleAddToCart(event, product?.id, selectedVariant?.id)
                                }
                                className="mt-10"
                            >
                                <div className="mt-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Phân loại</h3>
                                    </div>

                                    {variants.length > 0 ? (
                                        <>
                                            <div className="mt-10">
                                                <p className="text-sm text-gray-900">Kho
                                                    còn: {selectedVariant?.quantity}</p>
                                            </div>

                                            <fieldset aria-label="Choose a size" className="mt-4">
                                                <RadioGroup
                                                    value={selectedVariant}
                                                    onChange={setSelectedVariant}
                                                    className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                                                >
                                                    {variants.map((variant: {
                                                        id: string;
                                                        name: string;
                                                        quantity: number;
                                                        price?: string | undefined
                                                    }) => (
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
                                                                <div>
                                      <span
                                          aria-hidden="true"
                                          className={classNames(
                                              selectedVariant == variant ? 'ring-2 ring-green-700 ' : '',
                                              'pointer-events-none absolute -inset-px rounded-md border-2 border-transparent'
                                          )}
                                      />
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
                                        <line x1={0} x2={100} y1={100} y2={0} vectorEffect="non-scaling-stroke"/>
                                      </svg>
                                    </span>
                                                            )}
                                                        </Radio>
                                                    ))}
                                                </RadioGroup>
                                            </fieldset>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-900">Kho còn: {product?.quantity}</p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-900">
                                        Số lượng
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min="1"
                                        max={selectedVariant ? selectedVariant.quantity : product?.quantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="mt-2 block w-full p-2 w-75 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-green-700 px-8 py-3 text-base font-medium text-white hover:bg-green-800 focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:outline-hidden"
                                >
                                    Add to bag
                                </button>
                            </form>
                        </div>

                        <div
                            className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
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
        </MainLayout>
    )
}
