<?php

namespace App\Services\Review;

use App\Models\Review;

class ReviewCreateService
{
    public function handle($data, $id)
    {
        return Review::create(
            [
                'user_id' => $id,
                'product_id' => $data['product_id'],
                'comment' => $data['comment'],
                'rate' => $data['rate'],
            ]
        );
    }
}
