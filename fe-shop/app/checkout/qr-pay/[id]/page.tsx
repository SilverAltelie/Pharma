'use client'
import { use, useEffect, useState } from 'react'
import axios from 'axios'
import type { Order } from '@/app/type.tsx'
import { FaSpinner, FaCheckCircle } from 'react-icons/fa'

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [amount, setAmount] = useState(150000)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      })
      const order = await res.json()
      setOrder(order)
      setAmount(order.amount)
    }
    fetchData()
  }, [id])

  const simulatePayment = async () => {
    if (!cardNumber || !expiry || !cvc) {
      alert('Vui lòng nhập đầy đủ thông tin thẻ')
      return
    }

    setIsLoading(true)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/mock-bank/webhook`, {
        order_id: id,
        amount,
        sender: 'Nguyen Van A',
        card_number: cardNumber,
        expiry,
        cvc,
      })

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSuccess(true)

      // Close window after success
      setTimeout(() => {
        window.opener?.location.reload() // Refresh parent window if exists
        window.close()
      }, 1000)

    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi xảy ra khi gửi webhook')
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Thanh toán đơn hàng {order?.id}</h1>
      <p>Số tiền: {order?.amount.toLocaleString()} VND</p>
      <p>Nội dung chuyển khoản: <strong>{id}</strong></p>

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-8">
          <FaCheckCircle className="text-green-500 text-5xl mb-4" />
          <p className="text-lg font-medium text-green-600">Thanh toán thành công!</p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <FaSpinner className="text-blue-500 text-5xl mb-4 animate-spin" />
          <p className="text-lg font-medium text-blue-600">Đang xử lý thanh toán...</p>
        </div>
      ) : (
        <>
          <div>
            <label className="block">Số thẻ</label>
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="border px-3 py-2 rounded w-72"
              placeholder="9704 xxxx xxxx xxxx"
            />
          </div>
          <div>
            <label className="block">Ngày hết hạn</label>
            <input
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="border px-3 py-2 rounded w-32"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="block">CVC</label>
            <input
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="border px-3 py-2 rounded w-24"
              placeholder="123"
            />
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            onClick={simulatePayment}
          >
            Giả lập chuyển khoản
          </button>
        </>
      )}
    </div>
  )
}
