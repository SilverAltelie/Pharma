'use client'

import { useState, useEffect } from 'react';
import MainLayout from '@/app/_userlayout';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

type Category = {
    id: number;
    name: string;
    children?: Category[];
};

type ProductLayoutProps = {
    children: React.ReactNode;
    onFilterChange?: (filters: any) => void;
    onSortChange?: (sort: string) => void;
    onSearch?: (query: string) => void;
    categories?: Category[];
};

export default function ProductLayout({
    children,
    onFilterChange,
    onSortChange,
    onSearch,
    categories = []
}: ProductLayoutProps) {
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [sortOption, setSortOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                priceRange,
                categories: selectedCategories,
            });
        }
    }, [priceRange, selectedCategories]);

    useEffect(() => {
        if (onSortChange) {
            onSortChange(sortOption);
        }
    }, [sortOption]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    const handleCategoryChange = (categoryId: number, isParent: boolean = false, parentId?: number) => {
        setSelectedCategories(prev => {
            let newSelected = [...prev];
            
            if (isParent) {
                // If parent category is being selected
                if (prev.includes(categoryId)) {
                    // Remove parent and all its children
                    const category = categories.find(c => c.id === categoryId);
                    const childrenIds = category?.children?.map(child => child.id) || [];
                    newSelected = newSelected.filter(id => id !== categoryId && !childrenIds.includes(id));
                } else {
                    // Add parent and all its children
                    newSelected.push(categoryId);
                    const category = categories.find(c => c.id === categoryId);
                    category?.children?.forEach(child => {
                        if (!newSelected.includes(child.id)) {
                            newSelected.push(child.id);
                        }
                    });
                }
            } else {
                // If child category is being selected
                if (prev.includes(categoryId)) {
                    // Remove child and parent if all siblings are unchecked
                    newSelected = newSelected.filter(id => id !== categoryId);
                    if (parentId) {
                        const parent = categories.find(c => c.id === parentId);
                        const siblings = parent?.children || [];
                        const allSiblingsUnchecked = siblings.every(sibling => 
                            !newSelected.includes(sibling.id)
                        );
                        if (allSiblingsUnchecked) {
                            newSelected = newSelected.filter(id => id !== parentId);
                        }
                    }
                } else {
                    // Add child and parent if all siblings are checked
                    newSelected.push(categoryId);
                    if (parentId) {
                        const parent = categories.find(c => c.id === parentId);
                        const siblings = parent?.children || [];
                        const allSiblingsChecked = siblings.every(sibling => 
                            newSelected.includes(sibling.id) || sibling.id === categoryId
                        );
                        if (allSiblingsChecked && !newSelected.includes(parentId)) {
                            newSelected.push(parentId);
                        }
                    }
                }
            }
            
            return newSelected;
        });
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            {/* Mobile Filter Button */}
                            <button
                                className="lg:hidden w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FaFilter />
                                {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                            </button>

                            {/* Filter Content */}
                            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                                {/* Search */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Tìm kiếm</h3>
                                    <form onSubmit={handleSearch} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Tìm kiếm sản phẩm..."
                                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                                        />
                                        <button
                                            type="submit"
                                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                        >
                                            <FaSearch />
                                        </button>
                                    </form>
                                </div>

                                {/* Categories */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <Disclosure key={category.id} as="div" defaultOpen={selectedCategories.includes(category.id)}>
                                                {({ open }) => (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`category-${category.id}`}
                                                                checked={selectedCategories.includes(category.id)}
                                                                onChange={() => handleCategoryChange(category.id, true)}
                                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                            />
                                                            <Disclosure.Button className="flex-1 flex justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
                                                                <label
                                                                    htmlFor={`category-${category.id}`}
                                                                    className="flex-1 cursor-pointer"
                                                                >
                                                                    {category.name}
                                                                </label>
                                                                {category.children && category.children.length > 0 && (
                                                                    <ChevronUpIcon
                                                                        className={`${
                                                                            open ? 'rotate-180 transform' : ''
                                                                        } h-5 w-5 text-green-500`}
                                                                    />
                                                                )}
                                                            </Disclosure.Button>
                                                        </div>
                                                        <Transition
                                                            show={open}
                                                            enter="transition duration-100 ease-out"
                                                            enterFrom="transform scale-95 opacity-0"
                                                            enterTo="transform scale-100 opacity-100"
                                                            leave="transition duration-75 ease-out"
                                                            leaveFrom="transform scale-100 opacity-100"
                                                            leaveTo="transform scale-95 opacity-0"
                                                        >
                                                            <Disclosure.Panel static className="pl-8 space-y-2">
                                                                {category.children?.map((child) => (
                                                                    <div key={child.id} className="flex items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`category-${child.id}`}
                                                                            checked={selectedCategories.includes(child.id)}
                                                                            onChange={() => handleCategoryChange(child.id, false, category.id)}
                                                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`category-${child.id}`}
                                                                            className="text-sm text-gray-700 cursor-pointer"
                                                                        >
                                                                            {child.name}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </Disclosure.Panel>
                                                        </Transition>
                                                    </div>
                                                )}
                                            </Disclosure>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Khoảng giá</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Từ</label>
                                            <input
                                                type="number"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                placeholder="Giá thấp nhất"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Đến</label>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                placeholder="Giá cao nhất"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Sort Options */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 font-medium">Sắp xếp theo:</span>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="">Mặc định</option>
                                    <option value="price_asc">Giá tăng dần</option>
                                    <option value="price_desc">Giá giảm dần</option>
                                    <option value="discount_desc">Giảm giá nhiều nhất</option>
                                    <option value="newest">Mới nhất</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 