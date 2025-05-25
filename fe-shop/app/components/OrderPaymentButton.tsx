'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrderPaymentButtonProps {
    orderId: number;
    paymentId: number;
    status: string | number;
}

export default function OrderPaymentButton({ orderId, paymentId, status }: OrderPaymentButtonProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Only show for unpaid bank transfer orders (payment_id = 2 and status = 0)
    if (paymentId !== 2 || status !== '0') {
        return null;
    }

    const handlePayment = () => {
        const confirmPayment = window.confirm("Bạn muốn thanh toán đơn hàng này?");
        if (confirmPayment) {
            // Open in a popup window
            const width = 500;
            const height = 600;
            const left = (window.innerWidth - width) / 2;
            const top = (window.innerHeight - height) / 2;
            
            window.open(
                `/checkout/qr-pay/${orderId}`,
                'QRPayment',
                `width=${width},height=${height},left=${left},top=${top}`
            );
        }
    };

    return (
        <button
            onClick={handlePayment}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
            Thanh toán
        </button>
    );
} 