<?php

namespace App\Services\Admin\Promotion;

use App\Models\Promotion;

class PromotionCreateService
{
    public function handle($data) {
        return Promotion::create($data);
    }
}
