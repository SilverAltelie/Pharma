'use client'
import { useEffect, useState } from 'react';
import { FaPlus, FaMinus, FaStar, FaRegStar, FaHome, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
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
import { FaFire } from 'react-icons/fa6';
import Link from 'next/link';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function ClientProductPage({ id }: { id: number }) {

    type Product = {
        id: number;
        title: string;
        description: string;
        price: number;
        discounted_price: number;
        quantity: number;
        images: Array<{ id: number; image: string }>;
        variants: Variant[];
    }

    type Variant = {
        id: number;
        name: string;
        discounted_price:number;
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
    const [currentPage, setCurrentPage] = useState(1);
    const [filterRating, setFilterRating] = useState(0);
    const reviewsPerPage = 5;
    const token = sessionStorage.getItem('token');
    const [newReview, setNewReview] = useState({ rate: 5, comment: '' });
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [submitResult, setSubmitResult] = useState<{success: boolean; message: string}>({
        success: false,
        message: ''
    });

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

    const incrementQuantity = () => {
        const max = selectedVariant ? selectedVariant.quantity : (product?.quantity || 1);
        if (quantity < max) {
            setQuantity(q => q + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
        }
    };

    const filteredReviews = reviews.filter(review => 
        filterRating === 0 || review.rate === filterRating
    );

    const pageCount = Math.ceil(filteredReviews.length / reviewsPerPage);
    const paginatedReviews = filteredReviews.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage
    );

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            alert('Vui lòng đăng nhập để đánh giá sản phẩm');
            return;
        }

        setIsSubmitting(true);

        try {
            // Delay 2s
            await new Promise(resolve => setTimeout(resolve, 2000));

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: id,
                    rate: newReview.rate,
                    comment: newReview.comment,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Không thể thêm đánh giá');

            setReviews([...reviews, data]);
            setSubmitResult({
                success: true,
                message: 'Thêm đánh giá thành công!'
            });
        } catch (error) {
            console.error('Error:', error);
            setSubmitResult({
                success: false,
                message: error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm đánh giá'
            });
        } finally {
            setIsSubmitting(false);
            setShowResult(true);
            // Auto hide result after 3s
            setTimeout(() => {
                setShowResult(false);
                if (submitResult.success) {
                    setIsAddingReview(false);
                    setNewReview({ rate: 5, comment: '' });
                }
            }, 3000);
        }
    };

    return (
        <MainLayout>
            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-lg font-semibold text-gray-700">Đang xử lý...</p>
                    </div>
                </div>
            )}

            {/* Result Popup */}
            {showResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-4">
                        {submitResult.success ? (
                            <FaCheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                        ) : (
                            <FaTimesCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
                        )}
                        <p className={`text-lg font-semibold ${submitResult.success ? 'text-green-600' : 'text-red-600'}`}>
                            {submitResult.message}
                        </p>
                    </div>
                </div>
            )}

            <div className="bg-white">
                {/* Breadcrumb */}
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li>
                            <Link href="/" className="hover:text-green-600 transition-colors duration-200 flex items-center">
                                <FaHome className="mr-1" />
                                Trang chủ
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-green-600">{product?.title}</li>
                    </ol>
                </nav>

                <div className="pt-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                            {/* Product Image Slider */}
                            <div className="lg:max-w-none">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                    className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg"
                            >
                                    {product?.images.map((image, index) => (
                                    <SwiperSlide key={image.id}>
                                            <div className="relative aspect-square">
                                        <img
                                            src={'data:image/jpeg;base64,' + image.image}
                                            alt={`Slide ${index + 1}`}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                        />
                                            </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                            {/* Product Info */}
                            <div className="mt-8 lg:mt-0 lg:pl-8">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product?.title}</h1>
                                
                                {/* Price */}
                                <div className="mt-6">
                                    {product?.discounted_price ? (
                                        <div className="space-y-1">
                                            <p className="text-lg text-gray-500 line-through">
                                    {(selectedVariant?.price ?? product.price).toLocaleString()}₫
                                </p>
                                            <div className="flex items-center gap-2">
                                                <FaFire className="text-2xl text-red-500 animate-pulse" />
                                                <p className="text-3xl font-bold text-red-600">
                                                    {(selectedVariant?.discounted_price ?? product.discounted_price).toLocaleString()}₫
                                </p>
                                            </div>
                                </div>
                            ) : (
                                        <p className="text-3xl font-bold text-gray-900">
                                {(selectedVariant?.price ?? product?.price).toLocaleString()}₫
                                </p>
                            )}
                            </div>

                                {/* Description */}
                                <div className="mt-6">
                                    <p className="text-base text-gray-500 leading-relaxed">{product?.description}</p>
                                </div>

                                <form onSubmit={(event) => handleAddToCart(event, id, selectedVariant?.id)} className="mt-8">
                                    {/* Variants */}
                                    {variants.length > 0 && (
                                        <div className="mt-8">
                                    <h3 className="text-sm font-medium text-gray-900">Phân loại</h3>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Kho còn: {selectedVariant?.quantity || 0}
                                            </p>
                                            <RadioGroup
                                                value={selectedVariant}
                                                onChange={setSelectedVariant}
                                                className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
                                            >
                                                {variants.map((variant: Variant) => (
                                                    <Radio
                                                        key={variant.id}
                                                        value={variant}
                                                        disabled={variant.quantity <= 0}
                                                        className={classNames(
                                                            variant.quantity > 0
                                                                ? 'cursor-pointer shadow-sm hover:bg-gray-50'
                                                                : 'cursor-not-allowed bg-gray-50',
                                                            selectedVariant === variant 
                                                                ? 'ring-2 ring-green-600 bg-green-50 scale-105 transform transition-all duration-200' 
                                                                : 'ring-1 ring-gray-200 hover:scale-102 transform transition-all duration-200',
                                                            'group relative flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium uppercase focus:outline-none'
                                                        )}
                                                    >
                                                        <span className={variant.quantity > 0 ? 'text-gray-900' : 'text-gray-400'}>
                                                            {variant.name}
                                                        </span>
                                                        {variant.quantity <= 0 && (
                                                            <span className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-red-500 text-xs">Hết hàng</span>
                                        </span>
                                                        )}
                                                    </Radio>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    )}

                                    {/* Quantity */}
                                    <div className="mt-8">
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                            Số lượng
                                        </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min="1"
                                        max={selectedVariant ? selectedVariant.quantity : product?.quantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-center text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                    />
                                </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        type="submit"
                                        className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 hover:scale-102"
                                    >
                                        Thêm vào giỏ hàng
                                </button>
                            </form>
                        </div>
                    </div>

                        {/* Reviews Section */}
                        <div className="mt-16 lg:mt-24">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Đánh giá sản phẩm</h2>
                                {token && !isAddingReview && (
                                    <button
                                        onClick={() => setIsAddingReview(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                    >
                                        <FaPlus className="mr-2" /> Thêm đánh giá
                                    </button>
                                )}
                            </div>

                            {/* Add Review Form */}
                            {isAddingReview && (
                                <form onSubmit={handleAddReview} className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Đánh giá của bạn
                                        </label>
                                        <div className="flex items-center space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewReview(prev => ({ ...prev, rate: star }))}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    {star <= newReview.rate ? (
                                                        <FaStar className="h-8 w-8 text-yellow-400" />
                                                    ) : (
                                                        <FaRegStar className="h-8 w-8 text-gray-300" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nhận xét của bạn
                                        </label>
                                        <textarea
                                            id="comment"
                                            rows={4}
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingReview(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Gửi đánh giá
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Rating Filter */}
                            <div className="mb-6 flex items-center space-x-4">
                                <span className="text-sm text-gray-700">Lọc theo đánh giá:</span>
                                <div className="flex space-x-2">
                                    {[0, 5, 4, 3, 2, 1].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setFilterRating(rating)}
                                            className={classNames(
                                                'px-3 py-1 rounded-full text-sm',
                                                filterRating === rating
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            )}
                                        >
                                            {rating === 0 ? 'Tất cả' : `${rating} sao`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-8">
                                {paginatedReviews.map((review: ReviewType) => (
                                    <div key={review.id} className="flex space-x-4 bg-white p-6 rounded-lg shadow-sm">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {typeof review.user === 'string' ? review.user : review.user?.name}
                                                    </p>
                                                    <div className="flex items-center mt-1">
                                                        {[...Array(5)].map((_, index) => (
                                                            <span key={index}>
                                                                {index < review.rate ? (
                                                                    <FaStar className="text-yellow-400" />
                                                                ) : (
                                                                    <FaRegStar className="text-gray-300" />
                                                                )}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <time className="text-sm text-gray-500">
                                                    {new Date(review.created_at || '').toLocaleDateString()}
                                                </time>
                                            </div>
                                            <p className="mt-4 text-gray-600">{review.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pageCount > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        {[...Array(pageCount)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPage(index + 1)}
                                                className={classNames(
                                                    'px-3 py-1 rounded-md text-sm font-medium',
                                                    currentPage === index + 1
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                )}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            )}

                            {/* Review Form */}
                        <ProductReviews
                            reviews={reviews.map((review: ReviewType) => ({
                                ...review,
                                user: typeof review.user === 'object' && review.user !== null
                                        ? { ...review.user, id: String(review.user.id) }
                                        : { id: '0', name: '', email: '', password: '', addresses: [] },
                            }))}
                        />
                            </div>
                    </div>
                </div>
            </div>

            {/* Component tìm kiếm sản phẩm liên quan */}
            <SearchComponent productId={id} />
        </MainLayout>
    );
}
