import AdminLayout from "@/app/admin/admin-layout";

export default function Layout() {
    return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <h1 className="text-2xl font-bold">Trang quản trị</h1>
                <p className="mt-4 text-lg">Chào mừng đến trang quản trị!</p>
            </div>
        </AdminLayout>
    );
}