'use client'

import { useState, useEffect } from 'react';
import ProductLayout from '../components/ProductLayout';
import ProductCard from '../components/ProductCard';

type Product = {
    id: number;
    name: string;
    price: number;
    discounted_price: number;
    image: string;
    category_id: number;
};

type Category = {
    id: number;
    name: string;
    description?: string;
    children?: Category[];
};

type PaginatedProducts = {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [filters, setFilters] = useState<any>({});
    const [sort, setSort] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Omit<PaginatedProducts, 'data'> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchProducts = async (page: number = 1, append: boolean = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const token = sessionStorage.getItem('token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}`, {
                headers
            });

            if (!productsRes.ok) {
                throw new Error('Network response was not ok');
            }

            const productsData = await productsRes.json();

            console.log('Products data:', productsData); // Debug log

            // Handle products data
            if (productsData.data && Array.isArray(productsData.data)) {
                if (append) {
                    setProducts(prev => [...prev, ...productsData.data]);
                } else {
                    setProducts(productsData.data);
                }
                const { data, ...paginationData } = productsData;
                setPagination(paginationData);
                setCurrentPage(page);
            } else if (Array.isArray(productsData)) {
                if (append) {
                    setProducts(prev => [...prev, ...productsData]);
                } else {
                    setProducts(productsData);
                }
            } else {
                setProducts([]);
            }

        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
                headers
            });

            if (!categoriesRes.ok) {
                throw new Error('Network response was not ok');
            }

            const categoriesData = await categoriesRes.json();

            console.log('Categories data:', categoriesData); // Debug log

            // Handle categories data
            if (Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            } else if (categoriesData.data && Array.isArray(categoriesData.data)) {
                setCategories(categoriesData.data);
            } else {
                setCategories([]);
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchProducts(1, false);
        fetchCategories();
    }, []);

    // Reset products when filters change
    useEffect(() => {
        if (currentPage > 1) {
            setCurrentPage(1);
            fetchProducts(1, false);
        }
    }, [filters, sort, searchQuery]);

    const handleLoadMore = () => {
        if (pagination && currentPage < pagination.last_page) {
            fetchProducts(currentPage + 1, true);
        }
    };

    // Filter and sort products
    const filteredProducts = (products || []).filter(product => {
        // Apply category filter
        if (filters.categories?.length > 0) {
            return filters.categories.includes(product.category_id);
        }

        // Apply price range filter
        if (filters.priceRange?.min && product.price < Number(filters.priceRange.min)) {
            return false;
        }
        if (filters.priceRange?.max && product.price > Number(filters.priceRange.max)) {
            return false;
        }

        // Apply search filter
        if (searchQuery) {
            return product.name.toLowerCase().includes(searchQuery.toLowerCase());
        }

        return true;
    }).sort((a, b) => {
        switch (sort) {
            case 'price_asc':
                return (a.discounted_price || a.price) - (b.discounted_price || b.price);
            case 'price_desc':
                return (b.discounted_price || b.price) - (a.discounted_price || a.price);
            case 'discount_desc':
                const discountA = a.discounted_price ? (a.price - a.discounted_price) / a.price : 0;
                const discountB = b.discounted_price ? (b.price - b.discounted_price) / b.price : 0;
                return discountB - discountA;
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const hasMorePages = pagination && currentPage < pagination.last_page;

    return (
        <ProductLayout
            categories={categories}
            onFilterChange={setFilters}
            onSortChange={setSort}
            onSearch={setSearchQuery}
        >
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Tất cả sản phẩm</h1>
                <p className="mt-2 text-sm text-gray-500">
                    {pagination?.total 
                        ? `Hiển thị ${filteredProducts.length} trong tổng số ${pagination.total} sản phẩm`
                        : `Hiển thị ${filteredProducts.length} sản phẩm`}
                </p>
                {pagination && (
                    <p className="mt-1 text-xs text-gray-400">
                        Trang {pagination.current_page} / {pagination.last_page}
                    </p>
                )}
            </div>

            {filteredProducts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.name}
                                price={product.price}
                                discounted_price={product.discounted_price}
                                image={product.image}
                            />
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMorePages && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {loadingMore ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang tải...
                                    </>
                                ) : (
                                    <>
                                        Xem thêm sản phẩm
                                        <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Pagination Info */}
                    {pagination && (
                        <div className="mt-8 text-center text-sm text-gray-500">
                            Đã tải {products.length} / {pagination.total} sản phẩm
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900">Không tìm thấy sản phẩm nào</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        {searchQuery || (filters.priceRange?.min || filters.priceRange?.max) || filters.categories?.length > 0
                            ? 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác'
                            : 'Hiện tại chưa có sản phẩm nào'}
                    </p>
                </div>
            )}
        </ProductLayout>
    );
} 