'use client'

import Link from 'next/link';
import { FaFire } from 'react-icons/fa';

type ProductCardProps = {
    id: number;
    title: string;
    price: number;
    discounted_price?: number;
    image: string;
};

export default function ProductCard({ id, title, price, discounted_price, image }: ProductCardProps) {
    const discount = discounted_price ? Math.round(((price - discounted_price) / price) * 100) : 0;

    return (
        <Link href={`/product/${id}`} className="group">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt={title}
                    className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700 line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
                        {title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                        {discounted_price ? (
                            <>
                                <p className="text-sm text-gray-500 line-through">
                                    {price.toLocaleString()}₫
                                </p>
                                <div className="flex items-center gap-1">
                                    <FaFire className="text-red-500" />
                                    <p className="text-lg font-semibold text-red-600">
                                        {discounted_price.toLocaleString()}₫
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-lg font-semibold text-gray-900">
                                {price.toLocaleString()}₫
                            </p>
                        )}
                    </div>
                </div>
                {discount > 0 && (
                    <div className="flex items-start">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                            -{discount}%
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
} 