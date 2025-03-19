<?php

namespace App\Services\Review;

use App\Models\Review;

class ReviewDeleteService
{
    public function handle($id) {
        $review = Review::findOrFail($id);

        return $review->delete();
    }
}
