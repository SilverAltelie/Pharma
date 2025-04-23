<?php

namespace App\Services\Promotion;

use App\Models\Promotion;

class PromotionCreateService {
    public function handle($data) {
        $promotion = Promotion::create([
            'name' => $data['name'],
            'code' => $data['code'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'type' => $data['type'],
            'discount' => $data['discount'] ,
        ]);

        return $promotion;
    }
}
