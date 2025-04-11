<?php

namespace App\Services\Product;

use App\Jobs\SyncUserBehaviorToAlgolia;
use App\Models\Product;
use Illuminate\Support\Facades\Session;

class ProductShowService {
    public function handle($id) {
        $product = Product::with(['variants', 'reviews.user', 'images'])->findOrFail($id);

        $userId = auth()->id() ?? 'guest_' . session()->getId();

        SyncUserBehaviorToAlgolia::dispatch([
            'user_id' => $userId,
            'product_id' => $product->id,
            'action' => 'viewed',
        ]);

        return response()->json($product);
    }
}
