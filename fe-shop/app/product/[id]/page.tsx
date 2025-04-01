'use client'

import {use, useEffect, useState} from 'react'
import {Radio, RadioGroup} from '@headlessui/react'
import MainLayout from '@/app/_userlayout';
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import ProductReviews from "@/app/Reviews";
import {FaPencil} from "react-icons/fa6";
import {FaPlus, FaTrash} from "react-icons/fa";
import {StarIcon} from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Show({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);

    type Review = {
        id?: string;
        user_name?: string;
        rate: number;
        comment?: string;
        created_at?: string;
    };


    interface Product {
        content: string;
        description: string;
        id: string;
        title: string;
        images: string[];
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
    const [reviews, setReviews] = useState<Review[]>([]);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const token = localStorage.getItem('token');

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
                setReviews(data.reviews || [])
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
            setSelectedVariant(null);
        }
    }, [variants]);

    if (!product) return <div>Loading...</div>;

    async function handleAddToCart(event: React.FormEvent, product_id: string | undefined, variant_id?: string) {
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
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleSaveReview = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!editingReview) return;

        const reviewData = {
            product_id: id,
            rate: editingReview.rate,
            comment: editingReview.comment || '',
        };

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/create`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`},
                body: JSON.stringify(reviewData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Lỗi API: ${response.status}`);
            }

            setIsEditingReview(false);
            setEditingReview(null);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi lưu đánh giá:", error);
            alert(`Lỗi khi lưu đánh giá: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <MainLayout>
            <div className="bg-white">
                <div className="pt-6">
                    <div className="mx-auto max-w-7xl min-h-fit lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                            <div className="col-span-2">
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    spaceBetween={20}
                                    slidesPerView={1} // Hiển thị 1 ảnh mỗi lần
                                    navigation
                                    pagination={{clickable: true}}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                    }}
                                    className="w-full rounded-lg overflow-hidden"
                                >
                                    {product.images.map((image: any, index: number) => (
                                        <SwiperSlide key={image.id}>
                                            <img
                                                src={'data:image/jpeg;base64,' + image.image}
                                                alt={`Slide ${index + 1}`}
                                                className="w-full object-cover rounded-lg" // Đảm bảo class name đúng
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>

                        <div className="mt-6 lg:mt-0">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product?.title}</h1>
                            <p className="text-3xl tracking-tight text-gray-900 mt-2">
                                {selectedVariant ? selectedVariant.price : product?.price}
                            </p>
                            <p className="text-base text-gray-900">{product?.description}</p>

                            <form
                                onSubmit={(event) =>
                                    handleAddToCart(event, product?.id, selectedVariant?.id)
                                }
                                className="mt-10"
                            >
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
                    </div>

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pt-12 lg:pb-16">
                        <div className="lg:border-t lg:border-gray-200 lg:pt-8">

                            <div className="mt-10">
                                <h2 className="text-sm font-medium text-gray-900">Details</h2>
                                <p className="text-sm text-gray-600 mt-4">{product?.content}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pt-12 lg:pb-16">
                        <ProductReviews reviews={reviews}
                                onEdit={(review) => {
                                    setEditingReview(review);
                                    setIsEditingReview(true);
                                }}
                        />

                        {isEditingReview && (
                            <div className="mt-6 border rounded-lg p-4">
                                <h3 className="text-lg font-medium mb-4">
                                    {editingReview?.id ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}
                                </h3>

                                <form onSubmit={handleSaveReview}>
                                    {/* Đánh giá sao */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Đánh giá</label>
                                        <div className="flex items-center mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <StarIcon
                                                    key={star}
                                                    className={classNames(
                                                        (editingReview?.rate || 0) >= star ? 'text-yellow-400' : 'text-gray-300',
                                                        'h-6 w-6 cursor-pointer'
                                                    )}
                                                    onClick={() => setEditingReview({...editingReview!, rate: star})}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Nội dung đánh giá */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                                        <textarea
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            rows={4}
                                            value={editingReview?.comment || ''}
                                            onChange={(e) => setEditingReview({...editingReview!, comment: e.target.value})}
                                        ></textarea>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                        >
                                            {editingReview?.id ? 'Cập nhật' : 'Thêm mới'}
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                                            onClick={() => {
                                                setIsEditingReview(false);
                                                setEditingReview(null);
                                            }}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Nút thêm review mới */}
                        {!isEditingReview && (
                            <button
                                className="mt-4 mb-4 flex items-center text-indigo-600 hover:text-indigo-800"
                                onClick={() => {
                                    setEditingReview({rate: 5, comment: ''});
                                    setIsEditingReview(true);
                                }}
                            >

                                {token != null && <FaPlus className="mr-1"/>} {token && 'Thêm đánh giá mới'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
