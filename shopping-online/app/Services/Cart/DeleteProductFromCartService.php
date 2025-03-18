<?php

namespace App\Services\Cart;

use App\Models\Cart;

class DeleteProductFromCartService {
    public function handle($data, $cart) {
        $productId = $data->product_id;
        $variantId = $data->variant_id;

        $cartItem = $cart->cartItems()->where('product_id', $productId)->where('variant_id', $variantId)->first();

        if ($cartItem) {
            $cartItem->delete();
        }

        return response()->json([
            'cart' => $cart->load('cartItems'),
        ]);
    }}
