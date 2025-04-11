'use client'

import {useEffect, useState} from 'react';
import Image from "next/image";

function SearchComponent({ productId }: { productId: number }) {
    type Product = {
        objectID: string;
        title: string;
        image: string;
    };
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch('https://GEH6J4KOO6.algolia.net/1/indexes/*/recommendations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Algolia-Application-Id': 'GEH6J4KOO6',
                        'X-Algolia-API-Key': '8c26c50ee0602211f890ffa9bdf48656',
                    },
                    body: JSON.stringify({
                        requests: [
                            {
                                indexName: 'products',
                                model: 'related-products',
                                objectID: `App\\Models\\Product::${productId}`,
                                threshold: 0,
                                maxRecommendations: 3,
                            },
                        ],
                    }),
                });

                if (!response.ok) throw new Error('Failed to fetch recommendations');
                const result = await response.json();
                setRelatedProducts(result.results[0].hits || []);
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        if (productId) {
            fetchRelatedProducts();
        }
    }, [productId]);

    if (!relatedProducts) <p> Đang tải </p>

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {relatedProducts.length > 0 ? (
                    relatedProducts.map((product: Product) => (
                        <div key={product.objectID} className="border p-2 rounded shadow-sm">
                            <Image
                                src={product.image ? `data:image/jpeg;base64,${product.image}` : '/im-70627482.jpg'}
                                alt={product.title || 'Sản phẩm'}
                                width={200}
                                height={300}
                                className="size-full object-cover mb-2 rounded"
                                onError={(e) => {
                                    e.currentTarget.src = '/fallback.jpg'; // fallback image nếu lỗi
                                }}
                            />
                            <h4 className="text-sm font-medium">{product.title}</h4>
                        </div>
                    ))
                ) : (
                    <p>Không có sản phẩm liên quan.</p>
                )}
            </div>
        </div>
    );
}

export default SearchComponent;