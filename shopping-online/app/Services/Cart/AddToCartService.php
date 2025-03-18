<?php

namespace App\Services\Cart;

use App\Models\Cart;

class AddToCartService {
    public function handle($data, $user, $cart) {

        $productId = $data->product_id;
        $quantity = $data->quantity;
        $variantId = $data->variant_id;

        $cartItem = $cart->cartItems()->where('product_id', $productId)->where('variant_id', $variantId)->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            $cart->cartItems()->create([
                'product_id' => $productId,
                'variant_id' => $variantId,
                'quantity' => $quantity
            ]);
        }

        return response()->json([
            'cart' => $cart->load('cartItems'),
        ]);
    }
}
