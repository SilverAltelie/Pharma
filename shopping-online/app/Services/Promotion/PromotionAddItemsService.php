<?php

namespace App\Services\Promotion;

class PromotionAddItemsService {
    public function handle($promotion, $items)
    {
        foreach ($items as $item) {
            if (!isset($item['product_id'])) {
                return response()->json(['error' => 'Invalid item data.'], 400);
            }

            $promotion->items()->create([
                'product_id' => $item['product_id'],
            ]);
        }

        return response()->json(['message' => 'Thêm sản phẩm thành công'], 200);
    }


}
