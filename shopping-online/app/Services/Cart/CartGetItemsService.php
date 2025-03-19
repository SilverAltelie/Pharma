<?php

namespace App\Services\Cart;

use App\Models\Cart;


class CartGetItemsService
{
    public function getUserCart($userId, $createIfNotExists = false)
    {
        $cart = Cart::where('user_id', $userId)->first();

        if (!$cart && $createIfNotExists) {
            return Cart::create(['user_id' => $userId]);
        }

        return $cart;
    }

    public function getProductCart($userId)
    {
        $cart = $this->getUserCart($userId);

        if (!$cart) {
            return [];
        }

        $cartItems = $cart->cartItems()->with(['product', 'variant'])->get();

        if (!$cartItems) {
            return [];
        }

        return $cartItems;
    }

}
