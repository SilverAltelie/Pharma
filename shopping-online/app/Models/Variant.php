<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    use HasFactory;

    protected $table = 'variants';

    protected $fillable = ['product_id', 'name', 'price', 'quantity'];

    // Tự động thêm discounted_price khi trả về JSON
    protected $appends = ['discounted_price'];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function cartItems() {
        return $this->hasMany(CartItem::class);
    }

    public function getDiscountedPriceAttribute()
    {
        $product = $this->product;

        if (!$product) {
            return $this->price;
        }

        $promotions = $product->promotion;

        if ($promotions->isEmpty()) {
            return $this->price;
        }

        $maxDiscount = 0;

        foreach ($promotions as $item) {
            if ($item->type === 'percent') {
                $currentDiscount = $this->price * $item->discount / 100;
            } else {
                $currentDiscount = $item->discount;
            }

            $maxDiscount = max($maxDiscount, $currentDiscount);
        }

        return max($this->price - $maxDiscount, 0);
    }

    protected static function booted()
    {
        static::retrieved(function ($variant) {
            $variant->discounted_price = $variant->discounted_price; // để trigger accessor
        });
    }
}
