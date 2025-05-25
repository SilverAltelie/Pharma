'use client'

import MainLayout from "@/app/_userlayout";
import { useState, useEffect } from "react";
import Link from "next/link";

type BlogCategory = {
    id: number;
    name: string;
    blogs: Blog[];
}

type Blog = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    created_at: string;
    admin: {
        name: string;
    };
    category: {
        id: number;
        name: string;
    };
}

export default function BlogsPage() {
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                const data = await res.json();
                setCategories(data || []);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    // Lọc blog theo category và search term
    const allBlogs = categories.flatMap(category => 
        category.blogs.map(blog => ({
            ...blog,
            category: {
                id: category.id,
                name: category.name
            }
        }))
    );

    const filteredBlogs = allBlogs.filter(blog => {
        const matchesCategory = selectedCategory ? blog.category.id.toString() === selectedCategory : true;
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            blog.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (isLoading) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8 mt-[100px]">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8 mt-[100px]">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        className="flex-1 p-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-2 border rounded-lg bg-white"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.map(blog => (
                        <Link href={`/blogs/${blog.id}`} key={blog.id}>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="aspect-w-16 aspect-h-9">
                                    <img
                                        src={`data:image/jpeg;base64,${blog.thumbnail}`}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center mb-2">
                                        <span className="text-sm text-green-600 font-medium">
                                            {blog.category.name}
                                        </span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(blog.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-600 line-clamp-3">
                                        {blog.content.replace(/<[^>]*>/g, '')}
                                    </p>
                                    <div className="mt-4 flex items-center">
                                        <span className="text-sm text-gray-500">
                                            Đăng bởi {blog.admin.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {!isLoading && filteredBlogs.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        Không tìm thấy bài viết nào
                    </div>
                )}
            </div>
        </MainLayout>
    );
} 