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
import {useEffect, useRef, useState} from "react"
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
import AdminLayout from "../../admin-layout"
import type {BlogCategory} from "@/app/type";

const TiptapEditor = () => {

    const [token, setToken] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [thumbnailPreview, setThumbnailPreview] = useState<string>()
    const [thumbnailBase64, setThumbnailBase64] = useState<string>()
    const [categories, setCategories] = useState<BlogCategory[]>([])

    useEffect(() => {
        const token = sessionStorage.getItem('adminToken')
        setToken(token)

        if (!token || token === '') {
            return
        }

        async function fetchData() {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blog-categories/`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })

            if (!res.ok) {
                console.error("Lỗi khi gọi API:", res.status)
                return
            }

            const data = await res.json()

            setCategories(data.data);
        }

        fetchData();
    }, [])

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            const base64Content = base64Data.split(',')[1];
            setThumbnailPreview(base64Data);
            setThumbnailBase64(base64Content);
        };
        reader.readAsDataURL(file);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const title = (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value;
        const category_id = (e.currentTarget.elements.namedItem("category_id") as HTMLSelectElement).value;

        const data = {
            title: title,
            content: editor?.getHTML() || "",
            thumbnail: thumbnailBase64,
            category_id: category_id,
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blogs/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert("Đăng bài viết thành công!");
                window.location.href = "/admin/blog";
            } else {
                const errorData = await res.json();
                alert(`Lỗi: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            alert("Lỗi khi đăng bài viết");
        }
    }

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

    const buttonClass = (active: boolean) =>
        cn("px-3 py-2 rounded transition mx-2 mb-4", active ? "bg-black text-white" : "bg-white hover:bg-gray-100")

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !editor) return

        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result as string
            const base64Content = base64.split(',')[1]
            editor.chain().focus().setImage({src: `data:image/png;base64,${base64Content}`}).run()
        }
        reader.readAsDataURL(file)
    }

    if (!editor) return null

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
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-6xl mx-auto">
                        <input
                            type="text"
                            name="title"
                            placeholder="Tiêu đề"
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
                                <img src={thumbnailPreview} alt="Thumbnail preview" className="max-w-[200px]"/>
                            </div>
                        )}

                        <select
                            name="category_id"
                            className="w-full border px-4 bg-white py-2 rounded"
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
                            Đăng bài viết
                        </button>
                    </form>

                </div>
            </div>
        </AdminLayout>
    )
}

export default TiptapEditor