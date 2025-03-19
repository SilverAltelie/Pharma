<?php

namespace App\Services\Review;

use App\Models\Review;

class ReviewCreateService
{
    public function handle($data, $user)
    {
        return Review::create(
            [
                'user_id' => $user->id,
                'product_id' => $data['product_id'],
                'content' => $data['comment'],
                'rate' => $data['rate'],
            ]
        );
    }
}
