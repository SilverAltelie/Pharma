<?php

namespace App\Services\Order;

use App\Models\CartItem;
use App\Models\UserBehavior;

class OrderCreateService
{
    public function handle($data, $user)
    {
        $order = $user->orders()->create([
            'user_id' => $user->id,
            'address_id' => $data['address_id'],
            'status' => '0',
            'note' => $data['note'],
            'payment_id' => $data['payment_id'],
            'amount' => $data['amount'], // Total amount is stored here
        ]);

        foreach ($data['cartItems'] as $cartItem) {
            $orderItem = $order->orderItems()->create([
                'quantity' => $cartItem['quantity'],
                'variant_id' => $cartItem['variant_id'] ?? null,
                'product_id' => $cartItem['product_id'],
                'promotion_id' => $cartItem['promotion_id'] ?? null, // Store which promotion was applied
            ]);

            $cartItemModel = CartItem::findOrFail($cartItem['id']);

            // Decrease inventory
            if ($cartItemModel->variant_id) {
                $cartItemModel->variant()->decrement('quantity', $cartItem['quantity']);
            } else {
                $cartItemModel->product()->decrement('quantity', $cartItem['quantity']);
            }

            // Remove from cart
            $cartItemModel->delete();
        }

        return [
            'message' => 'Order created successfully',
            'order_id' => $order->id,
        ];
    }
}
