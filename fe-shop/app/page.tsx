'use client'

import MainLayout from "./_userlayout";
import "bootstrap/dist/css/bootstrap.css";

import {useState, useEffect} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import {XMarkIcon} from '@heroicons/react/20/solid'
import ProductCard from "@/app/ProductCard";
import Link from "next/link";
import Recommend from "@/app/Recommend";
import {FaCaretDown, FaFire} from "react-icons/fa";


const stats = [
    {id: 1, name: 'Chi nhánh trên toàn bộ các tỉnh thành', value: '63'},
    {id: 2, name: 'Đơn hàng mỗi tháng', value: '100,000+'},
    {id: 3, name: 'Sản phẩm', value: '1000+'},
    {id: 4, name: 'Khách hàng tin dùng sản phẩm', value: '46,000'},
]

const features = [
    {name: 'Thuốc các loại', description: 'Nhận buốc thuốc theo đơn của bác sĩ'},
    {name: 'Thực phẩm chức năng', description: 'Bồi bổ cho cơ thể'},
    {name: 'Kem/thuốc mỹ phẩm', description: 'Chức năng làm đẹp, tẩy mụn, xóa sẹo'},
    {name: 'Vitamin các loại', description: 'Bổ sung dưỡng chất còn thiếu cho cơ thể phát triển'},

]

const images = [
    {src: '/img/bg-img/voucher.png', link: `/promotion/${1}`},
    {src: '/img/bg-img/zalo.png', link: `/promotion/${1}`},
    {src: '/img/bg-img/calci.png', link: `/product/${1}`},
]

export default function Home() {

    type Image = {
        id: string;
        image: string;
    }

    type Product = {
        id: string;
        title: string;
        href: string;
        image: Image;
        discounted_price: number;
        price: string;
        color: string;
        variants: Array<{ id: string; name: string; price: string; quantity: string }>;
        images: Image[];
    }

    type Address = {
        id: string;
        first_name: string;
        last_name: string;
        address: string;
        phone: string;
        is_default: string;
    }

    type User = {
        id: string;
        name: string;
        email: string;
        addresses: Address[];
    }

    type Data = {
        user: User;
        addresses: Address[];
        products: {
            data: Product[];
        }
        bestSelling: Product[];
        mostDiscounted: Product[];
    }

    const [data, setData] = useState<Data>();
    const [isVisible, setIsVisible] = useState(true);
    const [token, setToken] = useState<string>();
    const [viewedProducts, setViewedProducts] = useState<number[]>([]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        setViewedProducts(sessionStorage.getItem('viewed') ? JSON.parse(sessionStorage.getItem('viewed') || '[]') : []);
        setToken(sessionStorage.getItem('token') ?? '');

        if (typeof window !== "undefined" && typeof document !== "undefined") {
            import('bootstrap').then(({Modal}) => {
                const storageKey = "popupClosedTime";
                const displayAfterMillis = 3600000;

                const lastClosedTime = localStorage.getItem(storageKey);
                if (!lastClosedTime || Date.now() - parseInt(lastClosedTime, 10) >= displayAfterMillis) {
                    const popup = document.getElementById("salePopup");
                    if (popup) {
                        const modalInstance = new Modal(popup);
                        modalInstance.show();
                    }
                }
            });
        }
    }, []);


    async function handleViewProduct(product_id: number) {
        try {
            // Thêm sản phẩm hiện tại vào danh sách đã xem nếu chưa có
            if (!viewedProducts.includes(product_id)) {
                // Nếu số lượng sản phẩm đã xem vượt quá 3, xóa sản phẩm cũ nhất (ở đầu mảng)
                if (viewedProducts.length >= 3) {
                    viewedProducts.shift(); // Xóa sản phẩm đầu tiên trong mảng
                }

                // Thêm sản phẩm mới vào cuối mảng
                viewedProducts.push(product_id);

                // Lưu lại danh sách vào localStorage
                sessionStorage.setItem('viewed', JSON.stringify(viewedProducts));
            }


            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${product_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();
            console.log(data);
            window.location.href = `/product/${product_id}`;
        } catch (error) {
            console.error("Error:", error);
        }
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
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    /*
        const token = localStorage.getItem('token');
    */

    useEffect(() => {
        async function fetchData() {
            try {
                setToken(localStorage.getItem('token') ?? '');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/main`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        /*
                                        "Authorization": `Bearer ${token}`,
                        */
                    },
                });

                // Kiểm tra xem API có trả về mã lỗi không
                if (!res.ok) {
                    throw new Error(`API trả về lỗi: ${res.statusText}`);
                }

                // Kiểm tra xem nội dung có phải là JSON hợp lệ không
                const text = await res.text();
                try {
                    const json = JSON.parse(text);  // Parse lại nội dung thành JSON
                    setData(json);
                } catch {
                    throw new Error("Dữ liệu trả về không phải là JSON hợp lệ.");
                }
            } catch (error) {
                console.error("Lỗi khi gọi API hoặc phân tích JSON: ", error);
            }
        }


        fetchData();
    }, []);

    if (!data) {
        return <MainLayout>Loading...</MainLayout>;
    }

    return (
        <MainLayout>

            {isVisible && !token && (
                <div
                    className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                    <div
                        aria-hidden="true"
                        className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                    >
                        <div
                            style={{
                                clipPath:
                                    'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                            }}
                            className="aspect-577/310 w-[36.0625rem] bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                        />
                    </div>
                    <div
                        aria-hidden="true"
                        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                    >
                        <div
                            style={{
                                clipPath:
                                    'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                            }}
                            className="aspect-577/310 w-[36.0625rem] bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <p className="text-sm/6 text-gray-900">
                            <strong className="font-semibold">Xin chào</strong>
                            <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
                                <circle r={1} cx={1} cy={1}/>
                            </svg>
                            Bạn chưa có tài khoản? Hãy đăng ký ngay để nhận ưu đãi hấp dẫn.
                        </p>
                        <Link
                            href="/auth/register"
                            className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                        >
                            Đăng ký ngay hôm nay <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-end">
                        <button
                            type="button"
                            className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
                            onClick={handleDismiss}
                        >
                            <span className="sr-only">Dismiss</span>
                            <XMarkIcon aria-hidden="true" className="size-5 text-gray-900"/>
                        </button>
                    </div>
                </div>
            )}
            <div className="modal fade" id="salePopup" tabIndex={-1} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">shop thông báo !</h5>
                            <button
                                type="button"
                                className="close"
                                data-bs-dismiss="modal" // Sử dụng `data-bs-dismiss="modal"` thay vì `data-dismiss="modal"`
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Cám ơn quý khách đã tin tưởng sử dụng sàn thương mại điện tử của chúng tôi !</p>
                            <p>Chúc quý khách mua sắm vui vẻ</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal" // Thêm `data-bs-dismiss="modal"` vào đây
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-gradient-to-b from-blue-50 to-white py-12">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                    {/* Swiper bên trái */}
                    <div className="md:col-span-2">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation
                            pagination={{clickable: true}}
                            autoplay={{delay: 3000, disableOnInteraction: false}}
                            className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <Link href={image.link} className="block relative group">
                                        <img
                                            src={image.src}
                                            alt={`Slide ${index + 1}`}
                                            className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"/>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Hai ảnh tĩnh bên phải */}
                    <div className="flex flex-col gap-6">
                        <Link href="/promotion/1" className="block relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <img
                                src="/img/bg-img/voucher.png"
                                alt="Promotion"
                                className="w-full h-[190px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"/>
                        </Link>
                        <Link href="/product/1" className="block relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <img
                                src="/img/bg-img/calci.png"
                                alt="Product"
                                className="w-full h-[190px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"/>
                        </Link>
                    </div>
                </div>
            </section>

            <div className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-12 text-center lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-green-600 sm:text-5xl">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            <div className="bg-gradient-to-b from-white to-gray-50">
                <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Chuyên bán các sản phẩm</h2>
                        <p className="mt-4 text-gray-500">
                            Chuyên bán các sản phẩm về dược phẩm, thực phẩm chức năng, kem/thuốc mỹ phẩm, vitamin các loại.
                        </p>

                        <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                            {features.map((feature) => (
                                <div key={feature.name} className="border-t border-gray-200 pt-4 group">
                                    <dt className="font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">{feature.name}</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                        {[
                            { src: "/img/product-img/pills.png", alt: "Pills" },
                            { src: "/img/product-img/products.jpg", alt: "Products" },
                            { src: "/img/product-img/beauty.jpg", alt: "Beauty" },
                            { src: "/img/product-img/vitamins.png", alt: "Vitamins" }
                        ].map((img, index) => (
                            <div key={index} className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sản phẩm bán chạy</h2>
                        <div className="h-0.5 flex-1 bg-gray-200 ml-6"/>
                    </div>

                    <div className="relative">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={24}
                            slidesPerView={2}
                            navigation
                            pagination={{clickable: true}}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                768: { slidesPerView: 3 },
                                1024: { slidesPerView: 4 },
                            }}
                            className="py-4"
                        >
                            {data?.bestSelling.map((product: Product, index: number) => (
                                <SwiperSlide key={index}>
                                    <Link href={`/product/${product.id}`} onClick={() => handleViewProduct(parseInt(product.id))} 
                                          className="block group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 no-underline">
                                        <div className="aspect-square relative overflow-hidden">
                                        <img
                                            alt={product.title}
                                            src={`data:image/jpeg;base64,${product.images[0]?.image}`}
                                                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"/>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
                                                    {product.title}
                                                </h3>
                                            <div className="mt-2">
                                                {product.discounted_price && product.discounted_price < parseInt(product.price) ? (
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-500 line-through">
                                                            {parseInt(product.price).toLocaleString()}₫
                                                    </p>
                                                        <p className="text-sm font-bold text-red-600 flex items-center gap-1">
                                                            <FaFire className="animate-pulse"/> 
                                                            {product.discounted_price.toLocaleString()}₫
                                                    </p>
                                                </div>
                                                ) : (
                                                <p className="text-sm font-medium text-gray-900">
                                                        {parseInt(product.price).toLocaleString()}₫
                                                </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sản phẩm giảm giá hot</h2>
                        <div className="h-0.5 flex-1 bg-gray-200 ml-6"/>
                    </div>

                    <div className="relative">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={24}
                            slidesPerView={2}
                            navigation
                            pagination={{clickable: true}}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                768: { slidesPerView: 3 },
                                1024: { slidesPerView: 4 },
                            }}
                            className="py-4"
                        >
                            {data?.mostDiscounted.map((product: Product, index: number) => (
                                <SwiperSlide key={index}>
                                    <Link href={`/product/${product.id}`} onClick={() => handleViewProduct(parseInt(product.id))} 
                                          className="block group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 no-underline">
                                        <div className="aspect-square relative overflow-hidden">
                                        <img
                                            alt={product.title}
                                            src={`data:image/jpeg;base64,${product.images[0]?.image}`}
                                                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"/>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
                                                    {product.title}
                                                </h3>
                                            <div className="mt-2">
                                            {product.discounted_price && product.discounted_price < parseInt(product.price) ? (
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-500 line-through">
                                                            {parseInt(product.price).toLocaleString()}₫
                                                    </p>
                                                        <p className="text-sm font-bold text-red-600 flex items-center gap-1">
                                                            <FaFire className="animate-pulse"/> 
                                                            {product.discounted_price.toLocaleString()}₫
                                                    </p>
                                                </div>
                                                ) : (
                                                <p className="text-sm font-medium text-gray-900">
                                                        {parseInt(product.price).toLocaleString()}₫
                                                </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>

            <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <Recommend
                    productIds={viewedProducts}
                    handleViewProduct={handleViewProduct}
                />
                </div>
            </div>

            <div className="bg-gray-50">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Khám phá thêm sản phẩm</h2>
                        <div className="h-0.5 flex-1 bg-gray-200 ml-6"/>
                    </div>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {data?.products?.data.map((product: Product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            handleAddToCart={handleAddToCart}
                            handleViewProduct={handleViewProduct}
                        />
                    ))}
                </div>

                    <div className="flex justify-center mt-12">
                        <button 
                            onClick={() => window.location.href = '/products/'} 
                            className="group relative inline-flex items-center gap-x-2 rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-all duration-200"
                        >
                            Xem thêm sản phẩm
                            <FaCaretDown className="text-lg group-hover:translate-y-0.5 transition-transform duration-200"/>
              </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
