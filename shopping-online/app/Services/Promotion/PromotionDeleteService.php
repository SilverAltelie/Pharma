<?php

namespace App\Services\Promotion;

use App\Models\Promotion;

class PromotionDeleteService
{
    public function handle($id)
    {
        $promotion = Promotion::findOrFail($id);

        // Detach all items associated with the promotion
        $promotion->items()->detach();

        // Delete the promotion
        $promotion->delete();

        return response()->json(['message' => 'Promotion deleted successfully.'], 200);
    }
}
