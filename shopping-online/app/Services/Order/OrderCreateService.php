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
        ]);

        foreach ($data['cartItems'] as $cartItem) {
            $order->orderItems()->create([
                'quantity' => $cartItem['quantity'],
                'variant_id' => $cartItem['variant_id'] ?? null,
                'product_id' => $cartItem['product_id'],
            ]);

            $cartItem = CartItem::findOrFail($cartItem['id']);

            if ($cartItem->variant()) {
                $cartItem->variant()->decrement('quantity', $cartItem['quantity']);
            } else {
                $cartItem->product()->decrement('quantity', $cartItem['quantity']);
            }

            CartItem::destroy($cartItem['id']);

        }

        return [
            'message' => 'Order created successfully',
            'order_id' => $order->id,
        ];
    }
}
