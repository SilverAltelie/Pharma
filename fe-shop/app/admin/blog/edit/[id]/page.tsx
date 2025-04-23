"use client"

import {useEditor, EditorContent} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import Heading from "@tiptap/extension-heading"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import Image from "@tiptap/extension-image"
import {cn} from "@/lib/utils"
import {use, useEffect, useRef, useState} from "react"
import {
    FaAlignCenter,
    FaAlignLeft,
    FaAlignRight,
    FaBold,
    FaHeading,
    FaImage, FaItalic,
    FaListOl, FaListUl,
    FaUnderline
} from "react-icons/fa";
import AdminLayout from "../../../admin-layout"
import type {BlogCategory} from "@/app/type"

export default function TiptapEditor({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params)
    const [token, setToken] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [thumbnailPreview, setThumbnailPreview] = useState<string>()
    const [categories, setCategories] = useState<BlogCategory[]>([])
    const [blog, setBlog] = useState<{
        title: string,
        content: string,
        thumbnail: string,
        category_id: number
    }>({
        title: '',
        content: '',
        thumbnail: '',
        category_id: 0
    })

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            Bold,
            Italic,
            Underline,
            Heading.configure({levels: [1, 2, 3]}),
            BulletList,
            OrderedList,
            ListItem,
            TextAlign.configure({types: ["heading", "paragraph"]}),
            Image,
        ],
        content: "<p>Nhập nội dung tại đây...</p>",
    })

    useEffect(() => {
        async function fetchData() {
            const token = sessionStorage.getItem("adminToken")

            setToken(token)

            if (!token) {
                console.error("Không có token trong sessionStorage")
                return
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blogs/edit/${id}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
                    },
                });

                if (!res.ok) throw new Error("Không thể lấy dữ liệu!");

                const data = await res.json();

                setCategories(data.categories || []);
                setBlog(data.blog || {});
                setThumbnailPreview(data.blog.thumbnail);

                if (data.blog.content) {
                    editor?.chain().focus().setContent(data.blog.content).run();
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        }

        if (editor) {
            fetchData();
        }
    }, [id, editor]);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.error("Không có tệp được chọn!");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            if (reader.readyState === FileReader.DONE) {
                const base64String = reader.result as string;
                setThumbnailPreview(base64String);
            } else {
                console.error("FileReader chưa ở trạng thái DONE.");
            }
        };

        reader.onerror = (error) => {
            console.error("Lỗi FileReader:", error);
        };

        try {
            reader.readAsDataURL(file);
        } catch (err) {
            console.error("Lỗi khi đọc file:", err);
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value);
        formData.append("content", editor?.getHTML() || "");
        formData.append("category_id", (e.currentTarget.elements.namedItem("category_id") as HTMLSelectElement).value);

        // Thumbnail xử lý
        const thumbnailInput = e.currentTarget.elements.namedItem("thumbnail") as HTMLInputElement;
        if (thumbnailInput.files && thumbnailInput.files[0]) {
            const file = thumbnailInput.files[0];
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64String = reader.result as string;
                formData.append("thumbnail", base64String.split(",")[1]); // Bỏ phần 'data:image/...;base64,'

                // Gửi dữ liệu tới API
                await updateBlog(formData);
            };

            reader.readAsDataURL(file);
        } else {
            // Thumbnail hiện tại (giá trị cũ)
            formData.append("thumbnail", blog.thumbnail || "");

            // Gửi dữ liệu tới API
            await updateBlog(formData);
        }
    }

    async function updateBlog(formData: FormData) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blogs/update/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: formData,
            });

            if (res.ok) {
                alert("Cập nhật bài viết thành công");
                window.location.href = "/admin/blog";
            } else {
                const errorData = await res.json();
                alert(`Cập nhật bài viết thất bại: ${errorData.message || "Lỗi không xác định"}`);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            alert("Lỗi khi cập nhật bài viết");
        }
    }

    const buttonClass = (active: boolean) =>
        cn("px-3 py-2 rounded transition mx-2 mb-4", active ? "bg-black text-white" : "bg-white hover:bg-gray-100")

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !editor) return

        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result as string
            editor.chain().focus().setImage({src: base64}).run()
        }
        reader.readAsDataURL(file)
    }

    if (!editor || !categories || !blog) return null

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6 border border-gray-200">
                <div className="flex flex-wrap gap-2 mb-8 mx-auto">
                    <button onClick={() => editor.chain().focus().toggleBold().run()}
                            className={buttonClass(editor.isActive("bold"))}>
                        <FaBold/>
                    </button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={buttonClass(editor.isActive("italic"))}>
                        <FaItalic/>
                    </button>
                    <button onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={buttonClass(editor.isActive("underline"))}>
                        <FaUnderline/>
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                            className={buttonClass(editor.isActive("heading", {level: 1}))}>
                        <FaHeading/> H1
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                            className={buttonClass(editor.isActive("heading", {level: 2}))}>
                        <FaHeading/> H2
                    </button>
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={buttonClass(editor.isActive("bulletList"))}>
                        <FaListUl/>
                    </button>
                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={buttonClass(editor.isActive("orderedList"))}>
                        <FaListOl/>
                    </button>
                    <button onClick={() => editor.chain().focus().setTextAlign("left").run()}
                            className={buttonClass(editor.isActive({textAlign: "left"}))}>
                        <FaAlignLeft/>
                    </button>
                    <button onClick={() => editor.chain().focus().setTextAlign("center").run()}
                            className={buttonClass(editor.isActive({textAlign: "center"}))}>
                        <FaAlignCenter/>
                    </button>
                    <button onClick={() => editor.chain().focus().setTextAlign("right").run()}
                            className={buttonClass(editor.isActive({textAlign: "right"}))}>
                        <FaAlignRight/>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()}
                            className={buttonClass(false)}>
                        <FaImage/>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </button>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-6xl mx-auto" encType="multipart/form-data">
                        <input
                            type="text"
                            name="title"
                            placeholder="Tiêu đề"
                            defaultValue={blog.title}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            name="thumbnail"
                            className="border p-2 rounded"
                            onChange={handleThumbnailChange}
                        />
                        {thumbnailPreview && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">Preview thumbnail:</p>
                                <img
                                    src={`data:image/jpeg;base64,${thumbnailPreview}`}
                                    alt="Thumbnail preview"
                                    className="max-h-60 rounded border"/>
                            </div>
                        )}

                        <select
                            name="category_id"
                            className="w-full border px-4 bg-white py-2 rounded"
                            value={blog.category_id}
                            onChange={(e) => setBlog({...blog, category_id: Number(e.target.value)})}
                            required
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <div className="prose max-w-none border border-gray-300 rounded-md p-4 min-h-[300px]">
                            <EditorContent editor={editor}/>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                            Cập nhật bài viết
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    )
}