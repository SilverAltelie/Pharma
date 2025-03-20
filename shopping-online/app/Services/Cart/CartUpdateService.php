<?php

namespace App\Services\Cart;

class CartUpdateService
{
    public function updateQuantity($item, $quantity) {
        $item->quantity = $quantity;
        return $item->save();
    }

}
