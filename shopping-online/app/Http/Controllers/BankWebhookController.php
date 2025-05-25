<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class BankWebhookController extends Controller
{
    //
    public function receiveTransaction(Request $request)
    {
        // Lấy dữ liệu gửi từ API của bên thứ ba (OpenBanking, ZBank...)
        $data = $request->all();

        // Kiểm tra nếu trùng với đơn hàng
        $order = Order::where('id', $data['order_id'])
                    ->where('status', '1')
                    ->first();

        if ($order && (int)$data['amount'] === (int)$order->total) {
            $order->update(['status' => 'paid']);

            // Lưu giao dịch lại
            BankTransaction::create([
                'order_code' => $data['order_code'],
                'sender_name' => $data['sender'],
                'content' => $data['message'],
                'amount' => $data['amount'],
                'transferred_at' => now(),
            ]);
        }

        return response()->json(['status' => 'ok']);
    }

    public function simulate(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|string',
            'amount' => 'required|numeric',
            'sender' => 'nullable|string',
            'card_number' => 'required|string|min:16',
            'expiry' => 'required|string',
            'cvc' => 'required|string|min:3',
        ]);

        $cardPrefix = substr($validated['card_number'], 0, 4);

        // Kiểm tra mock thẻ
        if ($cardPrefix === '9704') {
        } elseif ($cardPrefix === '9706') {
            return response()->json(['message' => 'Tài khoản không đủ số dư'], 402);
        } elseif ($cardPrefix === "9707") {
            return response()->json(['message' => 'Thẻ bị từ chối thanh toán'], 402);
        } else {
            return response()->json(['message' => 'Lỗi ngân hàng không xác định'], 400);
        }

        $order = Order::where('id', $validated['order_id'])
            ->where('status', '0')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found or already paid'], 404);
        }

        if ((string)$order->amount == (string)$validated['amount']) {
            $order->update(['status' => '1']);
            return response()->json(['message' => 'Order marked as paid']);
        }

        return response()->json(['message' => 'Amount mismatch'], 422);
    }

}
