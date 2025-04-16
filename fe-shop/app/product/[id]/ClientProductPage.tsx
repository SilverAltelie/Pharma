'use client'
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import MainLayout from '@/app/_userlayout';
import ProductReviews from "@/app/Reviews";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import {Radio, RadioGroup} from "@headlessui/react";
import SearchComponent from "@/app/SearchComponent";
import type { ReviewType } from "@/app/type";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function ClientProductPage({ id }: { id: number }) {

    type Product = {
        id: number;
        title: string;
        description: string;
        price: number;
        quantity: number;
        images: Array<{ id: number; image: string }>;
        variants: Variant[];
    }

    type Variant = {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }

    /*type Review = {
        id?: number; // Ensure id is a number
        user_name?: string;
        rate: number;
        comment?: string;
        created_at?: string;
        user?: User | string; // Allow user to be string or User
    };*/

    const [product, setProduct] = useState<Product>();
    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variant>();
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [editingReview, setEditingReview] = useState<ReviewType>();
    const [isEditingReview, setIsEditingReview] = useState(false);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/show/${id}`);
                if (!res.ok) throw new Error("Network response was not ok");
                const data = await res.json();
                setProduct(data);
                setVariants(data.variants || []);
                setReviews(
                    data.reviews.map((review: ReviewType) => ({
                        ...review,
                        id: review.id ? Number(review.id) : undefined, // Convert id to number
                        user: typeof review.user === 'string' ? review.user : review.user, // Allow user to remain as string or User
                    }))
                );
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        if (variants.length > 0 && variants[0].quantity > 0) {
            setSelectedVariant(variants[0]);
        } else {
            setSelectedVariant(undefined);
        }
    }, [variants]);

    if (!product) return <div>Loading...</div>;

    async function handleAddToCart(event: React.FormEvent, product_id: number|string|undefined, variant_id: number|string|undefined) {
        event.preventDefault();
        if (!confirm) return;

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
                body: JSON.stringify(variant_id ? { product_id, variant_id, quantity } : { product_id, quantity }),
            });

            if (!res.ok) throw new Error("Network response was not ok");
            alert("Thêm vào giỏ hàng thành công!");
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <MainLayout>
            <div className="bg-white">
                <div className="pt-6">
                    <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:gap-x-8">
                        <div className="max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                className="w-full rounded-lg overflow-hidden"
                            >
                                {product.images.map((image, index) => (
                                    <SwiperSlide key={image.id}>
                                        <img
                                            src={'data:image/jpeg;base64,' + image.image}
                                            alt={`Slide ${index + 1}`}
                                            className="w-full object-cover rounded-lg"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <div className="mt-6 lg:mt-0">
                            <h1 className="text-2xl font-bold">{product?.title}</h1>
                            <p className="text-3xl mt-2">{selectedVariant ? selectedVariant.price : product?.price}</p>
                            <p className="text-base text-gray-900">{product?.description}</p>

                            <form onSubmit={(event) => handleAddToCart(event, id, selectedVariant?.id)} className="mt-10">

                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-gray-900">Phân loại</h3>
                                    {variants.length > 0 ? (
                                        <>
                                            <p className="text-sm text-gray-900 mt-2">Kho
                                                còn: {selectedVariant?.quantity}</p>
                                            <RadioGroup
                                                value={selectedVariant}
                                                onChange={setSelectedVariant}
                                                className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4 mt-4"
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
                                                            'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus-outline-hidden sm:flex-1 sm:py-6',
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
                                                <line x1={0} x2={100} y1={100} y2={0}
                                                      vectorEffect="non-scaling-stroke"/>
                                            </svg>
                                        </span>
                                                        )}
                                                    </Radio>
                                                ))}
                                            </RadioGroup>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-900">Kho còn: {product?.quantity}</p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-900">Số lượng</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min="1"
                                        max={selectedVariant ? selectedVariant.quantity : product?.quantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="mt-2 block w-full p-2 border-gray-300 shadow-sm"
                                    />
                                </div>

                                <button type="submit" className="mt-10 w-full bg-green-700 text-white p-3 rounded-md">
                                    Add to bag
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pt-12 lg:pb-16">
                        <ProductReviews
                            reviews={reviews.map((review: ReviewType) => ({
                                ...review,
                                user: typeof review.user === 'object' && review.user !== null
                                    ? { ...review.user, id: String(review.user.id) } // Ensure `id` is a string
                                    : { id: '0', name: '', email: '', password: '', addresses: [] }, // Default `User` object
                            }))}
                        />
                        {/* Review editing form */}
                        {isEditingReview && (
                            <div className="mt-6 border rounded-lg p-4">
                                <h3 className="text-lg font-medium mb-4">{editingReview?.id ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}</h3>
                                {/* Rating and Comment Fields */}
                            </div>
                        )}

                        {!isEditingReview && (
                            <button className="mt-4 mb-4 text-indigo-600" onClick={() => { setEditingReview({ rate: 5, comment: '' }); setIsEditingReview(true); }}>
                                {token && <FaPlus />} {token && 'Thêm đánh giá mới'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Component tìm kiếm sản phẩm liên quan */}
            <SearchComponent productId={id} />
        </MainLayout>
    );
}
