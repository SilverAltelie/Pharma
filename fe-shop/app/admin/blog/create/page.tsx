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
import {useSearchParams} from 'next/navigation'
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
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const BlogEditor = dynamic(() => import('./BlogEditor'), {
    ssr: false
});

export default function CreateBlogPage() {
    return (
        <AdminLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <BlogEditor />
            </Suspense>
        </AdminLayout>
    );
}