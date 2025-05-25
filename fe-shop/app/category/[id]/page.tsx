'use client'

import { useState, useEffect } from 'react';
import ProductLayout from '../../components/ProductLayout';
import ProductCard from '../../components/ProductCard';
import { use } from 'react';

type Product = {
    id: number;
    name: string;
    price: number;
    discounted_price: number;
    image: string;
    status: string;
    category_id: number;
};

type Category = {
    id: number;
    name: string;
    description: string;
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

type ApiResponse = {
    category: Category;
    products: PaginatedProducts;
};

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});
    const [sort, setSort] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Omit<PaginatedProducts, 'data'> | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = sessionStorage.getItem('token');
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json'
                };

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${id}`, {
                        headers
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
                        headers
                    })
                ]);

                if (!productsRes.ok || !categoriesRes.ok) {
                    throw new Error('Network response was not ok');
                }

                const [categoryData, categoriesData] = await Promise.all([
                    productsRes.json(),
                    categoriesRes.json()
                ]);

                const { category, products: paginatedProducts } = categoryData as ApiResponse;
                
                console.log('Products data:', paginatedProducts.data); // Debug log
                console.log('Categories data:', categoriesData); // Debug log
                
                setProducts(paginatedProducts.data || []);
                // Handle categories data - it might be an array directly or wrapped in data property
                if (Array.isArray(categoriesData)) {
                    setCategories(categoriesData);
                } else if (categoriesData.data && Array.isArray(categoriesData.data)) {
                    setCategories(categoriesData.data);
                } else {
                    setCategories([]);
                }
                setCurrentCategory(category || null);
                
                // Store pagination data
                const { data, ...paginationData } = paginatedProducts;
                setPagination(paginationData);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    // Filter and sort products
    const filteredProducts = (products || []).filter(product => {
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

    return (
        <ProductLayout
            categories={categories}
            onFilterChange={setFilters}
            onSortChange={setSort}
            onSearch={setSearchQuery}
        >
            {currentCategory && (
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">{currentCategory.name}</h1>
                    {currentCategory.description && (
                        <p className="mt-2 text-gray-600">{currentCategory.description}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                        {pagination?.total 
                            ? `Hiển thị ${filteredProducts.length} trong tổng số ${pagination.total} sản phẩm`
                            : 'Không có sản phẩm nào trong danh mục này'}
                    </p>
                </div>
            )}
            
            {filteredProducts.length > 0 ? (
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
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900">Không tìm thấy sản phẩm nào</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        {searchQuery || (filters.priceRange?.min || filters.priceRange?.max)
                            ? 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác'
                            : 'Danh mục này hiện chưa có sản phẩm nào'}
                    </p>
                </div>
            )}
        </ProductLayout>
    );
}
  