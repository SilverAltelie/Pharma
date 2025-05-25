'use client'

import MainLayout from "@/app/_userlayout";
import { useState, useEffect } from "react";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from "next/link";

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

type Props = {
    id: string;
};

export default function BlogDetailClient({ id }: Props) {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                const data = await res.json();
                setBlog(data.blog);
                setRelatedBlogs(data.related_blogs || []);
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        }
        fetchData();
    }, [id]);

    if (!blog) {
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
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href="/blogs" className="text-gray-700 hover:text-green-600">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <Link 
                                        href={`/blogs?category=${blog.category.id}`} 
                                        className="text-gray-700 hover:text-green-600"
                                    >
                                        {blog.category.name}
                                    </Link>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* Blog Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {blog.title}
                        </h1>
                        <div className="flex items-center text-sm text-gray-500">
                            <span>{blog.admin.name}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(blog.created_at), 'dd MMMM yyyy', { locale: vi })}</span>
                            <span className="mx-2">•</span>
                            <span className="text-green-600">{blog.category.name}</span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="mb-8">
                        <img
                            src={`data:image/jpeg;base64,${blog.thumbnail}`}
                            alt={blog.title}
                            className="w-full h-[400px] object-cover rounded-lg"
                        />
                    </div>

                    {/* Blog Content */}
                    <article className="prose prose-lg max-w-none mb-12">
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </article>

                    {/* Related Posts */}
                    {relatedBlogs.length > 0 && (
                        <div className="border-t pt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Bài viết liên quan
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedBlogs.map(relatedBlog => (
                                    <Link href={`/blogs/${relatedBlog.id}`} key={relatedBlog.id}>
                                        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                                            <img
                                                src={`data:image/jpeg;base64,${relatedBlog.thumbnail}`}
                                                alt={relatedBlog.title}
                                                className="w-full h-40 object-cover rounded-t-lg"
                                            />
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {relatedBlog.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(relatedBlog.created_at), 'dd MMMM yyyy', { locale: vi })}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
} 