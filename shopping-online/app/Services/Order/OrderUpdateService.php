<?php

namespace App\Services\Order;

use App\Models\Order;

class OrderUpdateService
{
    public function updateStatus($id, $status)
    {
        $order = Order::findOrFail($id);

        $order->status = $status;
        return $order->save();
    }

}
