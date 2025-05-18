"use client";

import {FaCheckCircle, FaEdit, FaPlus, FaProductHunt, FaTrash} from "react-icons/fa";
import AdminLayout from "../admin-layout";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {FaShuffle} from "react-icons/fa6";
import type {Promotion} from "@/app/type";

export default function PromotionTable() {

    const [promotions, setPromotion] = useState<Promotion[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newPromotionName, setNewPromotionName] = useState("");
    const [newPromotionCode, setNewPromotionCode] = useState("");
    const [newPromotionType, setNewPromotionType] = useState("");
    const [newPromotionStartDate, setNewPromotionStartDate] = useState("");
    const [newPromotionEndDate, setNewPromotionEndDate] = useState("");
    const [newPromotionDiscount, setNewPromotionDiscount] = useState<number>(0);
    const [editingPromotionId, setEditingPromotionId] = useState<number>();
    const [editedPromotionName, setEditedPromotionName] = useState("");
    const [editedPromotionCode, setEditedPromotionCode] = useState("");
    const [editedPromotionType, setEditedPromotionType] = useState("");
    const [editedPromotionStartDate, setEditedPromotionStartDate] = useState("");
    const [editedPromotionEndDate, setEditedPromotionEndDate] = useState("");
    const [editedPromotionDiscount, setEditedPromotionDiscount] = useState<number | null>(null);


    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/promotions`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
                    }
                });

                if (res.status === 401) {
                    alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.")
                    window.location.href = "/admin/auth/login"
                    return
                }

                if (res.status === 403) {
                    alert("Bạn không có quyền truy cập vào trang này.")
                    window.location.href = "/admin/layout"
                    return
                }

                const json = await res.json();
                setPromotion(json.data || []);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        }

        fetchData();
    }, []);

    const handleProductButtonClick = async (promotionId: number) => {
        const removeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/promotions/removeItems/${promotionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
            },
        });

        if (removeRes.status === 401) {
            alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.")
            window.location.href = "/admin/auth/login"
            return
        }

        if (removeRes.status === 403) {
            alert("Bạn không có quyền truy cập vào trang này.")
            window.location.href = "/admin/layout"
            return
        }

        if (!removeRes.ok) {
            throw new Error("Failed to remove products from promotion");
        }

        router.push(`/admin/promotions/items/${promotionId}`);
    }

    const handleAddPromotion = async (name: string, code: string, type: string, start_date: string, end_date: string, discount: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/promotions/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`,
                },
                body: JSON.stringify({name, code, discount, type, start_date, end_date}),
            });

            if (res.status === 401) {
                alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.")
                window.location.href = "/admin/auth/login"
                return
            }

            if (res.status === 403) {
                alert("Bạn không có quyền truy cập vào trang này.")
                window.location.href = "/admin/layout"
                return
            }

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            const json = await res.json();

            setPromotion([...promotions, json]);
            setIsAdding(false);

            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    const handleDeletePromotion = async (roleId: number) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa vai trò này?");

        if (!isConfirmed) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/promotions/delete/${roleId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('adminToken')}`,
                },
            });

            if (res.status === 401) {
                alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.")
                window.location.href = "/admin/auth/login"
                return
            }

            if (res.status === 403) {
                alert("Bạn không có quyền truy cập vào trang này.")
                window.location.href = "/admin/layout"
                return
            }

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            setPromotion(promotions.filter(promotion => promotion.id !== roleId));
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }
    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        setNewPromotionCode(result);
        return result;
    };

    const handleEditPromotion = (roleId: number) => {
        setEditingPromotionId(roleId);
        const promotionToEdit = promotions.find(promotion => promotion.id === roleId);
        setEditedPromotionName(promotionToEdit?.name || "");
        setEditedPromotionCode(promotionToEdit?.code || "");
        setEditedPromotionType(promotionToEdit?.type || "");
        setEditedPromotionStartDate(promotionToEdit?.start_date.slice(0, 10) || "");
        setEditedPromotionEndDate(promotionToEdit?.end_date.slice(0, 10) || "");
        setEditedPromotionDiscount(promotionToEdit?.discount || 0);
    };

    const handleSaveEdit = async (promotionId: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/promotions/update/${promotionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`,
                },
                body: JSON.stringify({name: editedPromotionName, code: editedPromotionCode, discount: editedPromotionDiscount, type: editedPromotionType, start_date: editedPromotionStartDate, end_date: editedPromotionEndDate}),
            });

            if (res.status === 401) {
                alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.")
                window.location.href = "/admin/auth/login"
                return
            }

            if (res.status === 403) {
                alert("Bạn không có quyền truy cập vào trang này.")
                window.location.href = "/admin/layout"
                return
            }

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            await res.json();

            setEditingPromotionId(undefined);

            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    if (!isClient || !promotions) {
        return <p className="text-center py-6">Đang tải dữ liệu...</p>;
    }

    return (
        <AdminLayout>
            <div className="flex h-full flex-col bg-white">
                <div className="flex justify-between items-center p-6">
                    <h2 className="text-2xl font-bold">Bảng quản lý khuyến mãi</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-green-600 text-white px-2 py-2 rounded-md hover:bg-green-700 transition"
                        >
                            <FaPlus />
                        </button>


                    </div>
                </div>

                {isAdding && (
                    <div className="p-6">
                        <input
                            type="text"
                            value={newPromotionName}
                            onChange={(e) => setNewPromotionName(e.target.value)}
                            placeholder="Nhập tên khuyến mãi"
                            className="border p-2 rounded-md w-full mb-4"
                        />
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={newPromotionCode}
                                onChange={(e) => setNewPromotionCode(e.target.value)}
                                placeholder="Nhập mã khuyến mãi"
                                className="border p-2 rounded-md w-full mb-4"
                            />
                            <button
                                type="button"
                                onClick={generateRandomCode}
                                className="bg-green-500 text-white p-2 rounded-md ml-2 mb-4"
                            >
                                <FaShuffle className={'text-white'} />
                            </button>
                        </div>
                        <select
                            value={newPromotionType}
                            onChange={(e) => setNewPromotionType(e.target.value)}
                            className="border p-2 rounded-md w-full mb-4"
                        >
                            <option value="percent">Giảm theo phần trăm</option>
                            <option value="price">Giảm theo giá</option>
                        </select>

                        <input
                            type="text"
                            value={newPromotionDiscount}
                            onChange={(e) => setNewPromotionDiscount(parseInt(e.target.value))}
                            placeholder="Nhập giảm giá"
                            className="border p-2 rounded-md w-full mb-4"
                        />

                        <input
                            type="date"
                            value={newPromotionStartDate}
                            onChange={(e) => setNewPromotionStartDate(e.target.value)}
                            placeholder="Nhập ngày bắt đầu"
                            className="border p-2 rounded-md w-full mb-4"
                        />
                        <input
                            type="date"
                            value={newPromotionEndDate}
                            onChange={(e) => setNewPromotionEndDate(e.target.value)}
                            placeholder="Nhập ngày hết hạn"
                            className="border p-2 rounded-md w-full mb-4"
                        />
                        <button
                            onClick={() => handleAddPromotion(newPromotionName, newPromotionCode, newPromotionType, newPromotionStartDate, newPromotionEndDate, newPromotionDiscount)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                        >
                            Lưu vai trò
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-auto p-6">
                    {!promotions || promotions.length == 0 ? (
                        <p className="text-center py-6">Chưa có khuyến mãi</p>
                    ) : (
                        <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border text-left">Tên Khuyến Mãi</th>
                                <th className="p-3 border text-left">Mã Khuyến mãi</th>
                                <th className="p-3 border text-left">Giá trị giảm</th>
                                <th className="p-3 border text-left">Loại Khuyến Mãi</th>
                                <th className="p-3 border text-left">Ngày bắt đầu</th>
                                <th className="p-3 border text-left">Ngày kết thúc</th>
                                <th className="p-1 border text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {promotions?.map((promotion: Promotion, index: number) => (
                                <tr key={index} className="border hover:bg-gray-50">
                                    <td className="p-3 border">
                                        {editingPromotionId === promotion.id ? (
                                            <input
                                                type="text"
                                                value={editedPromotionName}
                                                onChange={(e) => setEditedPromotionName(e.target.value)}
                                                className="border p-2 rounded-md w-full"
                                            />
                                        ) : (
                                            promotion.name
                                        )}
                                    </td>
                                    <td className="p-3 border">
                                        {editingPromotionId === promotion.id ? (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={editedPromotionCode}
                                                    onChange={(e) => setEditedPromotionCode(e.target.value)}
                                                    className="border p-2 rounded-md w-full pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setEditedPromotionCode(generateRandomCode())}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                                                >
                                                    <FaShuffle />
                                                </button>
                                            </div>
                                        ) : (
                                            promotion.code
                                        )}
                                    </td>

                                    <td className="p-3 border">{editingPromotionId === promotion.id ? (
                                        <input
                                            type="text"
                                            value={editedPromotionDiscount || ""}
                                            onChange={(e) => setEditedPromotionDiscount(parseInt(e.target.value))}
                                            className="border p-2 rounded-md w-full"
                                        />
                                    ) : (
                                        promotion.discount
                                    )}</td>
                                    <td className="p-3 border">{editingPromotionId === promotion.id ? (
                                        <select
                                            value={editedPromotionType}
                                            onChange={(e) => setEditedPromotionType(e.target.value)}
                                            className="border p-2 rounded-md w-full"
                                        >
                                            <option value="percent">Giảm theo phần trăm</option>
                                            <option value="price">Giảm theo giá</option>
                                        </select>
                                    ) : (
                                        promotion.type === "percent" ? "Giảm theo phần trăm" : "Giảm theo giá"
                                    )}</td>
                                    <td className="p-3 border">{editingPromotionId === promotion.id ? (
                                        <input
                                            type="date"
                                            value={editedPromotionStartDate?.slice(0, 10)}
                                            onChange={(e) => setEditedPromotionStartDate(e.target.value)}
                                            className="border p-2 rounded-md w-full"
                                        />
                                    ) : (
                                        promotion.start_date
                                    )}</td>
                                    <td className="p-3 border">{editingPromotionId === promotion.id ? (
                                        <input
                                            type="date"
                                            value={editedPromotionEndDate.slice(0, 10)}
                                            onChange={(e) => setEditedPromotionEndDate(e.target.value)}
                                            className="border p-2 rounded-md w-full"
                                        />
                                    ) : (
                                        promotion.end_date
                                    )}</td>
                                    <td className="p-3 border text-center">
                                        {editingPromotionId === promotion.id ? (
                                            <button
                                                onClick={() => handleSaveEdit(promotion.id)}
                                                className="text-green-600 hover:text-green-800 flex text-center items-center gap-1"
                                            >
                                                <FaCheckCircle /> Lưu
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEditPromotion(promotion.id)}
                                                className="text-blue-600 hover:text-blue-800 flex text-center items-center gap-1"
                                            >
                                                <FaEdit/> Sửa
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeletePromotion(promotion.id)}
                                            className="text-red-600 hover:text-red-800 text-center flex items-center gap-1">
                                            <FaTrash/> Xóa
                                        </button>
                                        <button
                                            onClick={() => handleProductButtonClick(promotion.id)}
                                            className="text-yellow-600 hover:text-yellow-800 text-center flex items-center gap-1n"
                                        >
                                            <FaProductHunt /> Thêm sản phẩm khuyến mãi
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}