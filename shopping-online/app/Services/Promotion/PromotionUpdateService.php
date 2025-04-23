<?php

namespace App\Services\Promotion;

use App\Models\Promotion;
use Illuminate\Validation\ValidationException;

class PromotionUpdateService
{
    public function handle($data, $id)
    {
        $promotion = Promotion::findOrFail($id);

        $promotion->update([
            'name' => $data['name'],
            'code' => $data['code'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'type' => $data['type'],
            'discount' => $data['discount'],
        ]);

        return $promotion;
    }
}
