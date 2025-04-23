<?php

namespace App\Services\Promotion;

use App\Models\Promotion;

class PromotionRemoveItemsService
{
    public function handle($promotionId, $itemId)
    {
        PromotionProduct::where($validated)->delete();

        return response()->json(['message' => 'Đã xóa khỏi khuyến mãi']);
    }
}
