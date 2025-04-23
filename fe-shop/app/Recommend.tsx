'use client'

import { useEffect, useState } from 'react';
import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";

function Recommend({ productIds, handleViewProduct }: { productIds: number[], handleViewProduct: (productId: number) => void }) {
    type Product = {
        objectID: string;
        title: string;
        image: string;
    };

    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                if (!productIds || productIds.length === 0) return;

                const requests = productIds.map((id) => ({
                    indexName: 'products',
                    model: 'related-products',
                    objectID: `App\\Models\\Product::${id}`,
                    threshold: 0,
                    maxRecommendations: 3,
                }));

                const response = await fetch('https://GEH6J4KOO6.algolia.net/1/indexes/*/recommendations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Algolia-Application-Id': 'GEH6J4KOO6',
                        'X-Algolia-API-Key': '8c26c50ee0602211f890ffa9bdf48656',
                    },
                    body: JSON.stringify({ requests }),
                });

                if (!response.ok) throw new Error('Failed to fetch recommendations');

                const result = await response.json();

                // Gom tất cả hits lại và loại bỏ trùng lặp theo objectID
                const allHits: Product[] = result.results.flatMap((res: { hits: Product[] }) => res.hits);
                const uniqueHits: Product[] = Array.from(
                    new Map(allHits.map((item) => [item.objectID, item])).values()
                );

                setRelatedProducts(uniqueHits);
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        fetchRelatedProducts();
    }, [productIds]);

    return (
        <div className="mt-8 my-8 px-3">
            <h3 className="text-xl font-semibold mb-4">Vì bạn đã xem sản phẩm trước đó</h3>

            {relatedProducts.length > 0 ? (
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={5}
                    slidesPerView={2}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        1024: {
                            slidesPerView: 4,
                        },
                    }}
                >
                    {relatedProducts.map((product) => (
                        <SwiperSlide key={product.objectID}>
                            <button onClick={() => {
                                const productId = product.objectID.split('::')[1]; // Lấy phần sau '::'
                                handleViewProduct(parseInt(productId));
                            }} className="rounded size-full">
                                <Image
                                    src={product.image ? `data:image/jpeg;base64,${product.image}` : '/im-70627482.jpg'}
                                    alt={product.title || 'Sản phẩm'}
                                    width={200}
                                    height={300}
                                    className="waspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                    onError={(e) => {
                                        e.currentTarget.src = '/fallback.jpg';
                                    }}
                                />
                                <h4 className="text-sm font-medium">{product.title}</h4>
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p>Không có sản phẩm liên quan.</p>
            )}
        </div>
    );
}

export default Recommend;
