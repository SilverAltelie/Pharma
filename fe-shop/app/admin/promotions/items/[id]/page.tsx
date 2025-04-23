'use client'

import {use, useEffect, useState} from "react";
import type {Category, Product, PromotionItem} from "@/app/type";
import AdminLayout from "@/app/admin/admin-layout";

export default function PromotionProductSelector({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [priceFilter, setPriceFilter] = useState({min: '', max: ''});
    const [showAllProducts, setShowAllProducts] = useState<{ [categoryId: number]: boolean }>({});
    const [initialProductIds, setInitialProductIds] = useState<number[]>([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/promotions/getItems/${id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
                },
            });
            const data = await res.json();
            setCategories(data.categories);
            const existing = data.promotion.items.map((item: PromotionItem) => item.product_id);
            setSelectedProductIds(existing);
            setInitialProductIds(existing);
        }

        fetchData();
    }, [id]);

    function filterByPrice(products: Product[]) {
        const min = parseFloat(priceFilter.min);
        const max = parseFloat(priceFilter.max);
        return products.filter((product) => {
            const price = (product.price);
            return (
                (!isNaN(min) ? price >= min : true) &&
                (!isNaN(max) ? price <= max : true)
            );
        });
    }

    function toggleProductSelection(productId: number) {
        const isSelected = selectedProductIds.includes(productId);

        if (!isSelected) {
            setSelectedProductIds((prev) => [...prev, productId]);
        } else {
            setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
        }
    }
    function toggleSelectAll() {
        const allProductIds = categories.flatMap(c => c.products?.map(p => p.id));
        const filtered = filterByPrice(allProductIds.map(id => {
            return categories.flatMap(c => c.products).find(p => p?.id === id)!;
        }));
        const filteredIds = filtered.map(p => p.id);

        const isAllSelected = filteredIds.every(id => selectedProductIds.includes(parseInt(id)));

        setSelectedProductIds(isAllSelected
            ? selectedProductIds.filter(id => !filteredIds.map(Number).includes(id))
            : Array.from(new Set([...selectedProductIds, ...filteredIds.map(Number)]))
        );
    }

    function toggleSelectCategory(category: Category) {
        const filtered = filterByPrice(category.products || []);
        const productIds = filtered.map(p => p.id);
        const isAllSelected = productIds.every(id => selectedProductIds.includes(Number(id)));

        setSelectedProductIds(isAllSelected
            ? selectedProductIds.filter(id => !productIds.map(Number).includes(id))
            : Array.from(new Set([...selectedProductIds, ...productIds.map(Number)]))
        );
    }


    async function handleAddToPromotion() {
        const toAdd = selectedProductIds.filter(id => !initialProductIds.includes(id));
        const toRemove = initialProductIds.filter(id => !selectedProductIds.includes(id));

        try {
            if (toAdd.length > 0) {
                const addRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/promotions/addItems/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
                    },
                    body: JSON.stringify({ items: toAdd.map((id) => ({ product_id: id })) }),
                });

                if (!addRes.ok) {
                    throw new Error("Failed to add products to promotion");
                }
            }

            if (toRemove.length > 0) {
                const removeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/promotions/removeItems/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
                    },
                    body: JSON.stringify({ items: toRemove.map((id) => ({ product_id: id })) }),
                });

                if (!removeRes.ok) {
                    throw new Error("Failed to remove products from promotion");
                }
            }

            alert("Promotion updated successfully!");
            window.location.href = `/admin/promotions/`;
        } catch (error) {
            console.error(error);
            alert("An error occurred while updating the promotion.");
        }
    }

    return (
        <AdminLayout>

            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Chọn sản phẩm cho khuyến mãi</h2>

                <div className="border rounded-xl shadow-md flex gap-4 items-end p-4 mb-4 bg-white">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá từ</label>
                        <input
                            type="number"
                            value={priceFilter.min}
                            onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})}
                            className="border px-2 py-1 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">đến</label>
                        <input
                            type="number"
                            value={priceFilter.max}
                            onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})}
                            className="border px-2 py-1 rounded-md"
                        />
                    </div>
                    <button
                        onClick={toggleSelectAll}
                        className="bg-gray-800 text-white px-3 py-1 rounded-md"
                    >
                        Chọn tất cả (lọc)
                    </button>

                    <p className="flex text-gray-700 mb-4">
                        Đã chọn <span className="font-semibold"> {selectedProductIds.length} </span> sản phẩm
                    </p>
                </div>


                <div className="space-y-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="border rounded-xl shadow-md p-4 bg-white"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">{category.name}</h3>
                                <label className="text-sm flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        onChange={() => toggleSelectCategory(category)}
                                        checked={filterByPrice(category.products || []).every(p => selectedProductIds.includes(parseInt(p.id)))}
                                    />
                                    Chọn tất cả trong danh mục này
                                </label>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {filterByPrice(category.products || [])
                                    .slice(0, showAllProducts[category.id] ? undefined : 5)
                                    .map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => toggleProductSelection(parseInt(product.id))}
                                            className="group relative border rounded-lg p-2 hover:shadow-lg transition cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                className="absolute top-4 right-4 z-10"
                                                checked={selectedProductIds.includes(parseInt(product.id))}
                                                onClick={(e) => e.stopPropagation()} // Ngăn click lan ra ngoài
                                                onChange={() => toggleProductSelection(parseInt(product.id))}
                                            />
                                            <img
                                                alt={product.description}
                                                src={`data:image/png;base64,${product.images ? product.images[0]?.image : ''}`}
                                                className="aspect-square w-full rounded-md bg-gray-200 object-cover"
                                            />
                                            <div className="mt-3">
                                                <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
                                                <p className="text-sm text-gray-600">{product.price}</p>
                                            </div>
                                        </div>
                                    ))}

                            </div>

                            {filterByPrice(category.products || []).length > 5 && (
                                <button
                                    className="mt-4 text-blue-600 text-sm underline"
                                    onClick={() =>
                                        setShowAllProducts((prev) => ({
                                            ...prev,
                                            [category.id]: !prev[category.id],
                                        }))
                                    }
                                >
                                    {showAllProducts[category.id] ? 'Ẩn bớt' : 'Hiện thêm'}
                                </button>
                            )}
                        </div>

                    ))}
                </div>

                <button
                    onClick={handleAddToPromotion}
                    className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                >
                    Thêm vào khuyến mãi
                </button>
            </div>
        </AdminLayout>
    );
}
