<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, Searchable;

    protected $table = 'products';

    protected $fillable = ['title', 'description', 'content', 'price', 'quantity', 'status', 'category_id'];

    protected $appends = ['discounted_price'];

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function images() {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function variants() {
        return $this->hasMany(Variant::class);
    }

    public function cartItems() {
        return $this->hasMany(CartItem::class);
    }

    public function promotion() {
        return $this->belongsToMany(Promotion::class, 'promotion_items');
    }

    public function orders() {
        return $this->belongsToMany(Order::class, 'order_items')->withPivot('quantity');
    }

    public function getDiscountPrice()
    {
        $promotions = $this->promotion;

        if ($promotions->isEmpty()) {
            return $this->price;
        }

        $discount = 0;

        foreach ($promotions as $item) {
            if ($item->type === 'percent') {
                $discount += $this->price * $item->discount / 100;
            } else {
                $discount += $item->discount;
            }
        }

        return max($this->price - $discount, 0); // không cho giá âm
    }

    public function scopeBestSelling($query, $limit = 12)
    {
        return $query->select('products.*')
            ->join('order_items', 'order_items.product_id', '=', 'products.id')
            ->selectRaw('SUM(order_items.quantity) as total_sold')
            ->groupBy('products.id')
            ->orderByDesc('total_sold')
            ->limit($limit);
    }

    public function getDiscountedPriceAttribute()
    {
        $promotions = $this->promotion;

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

        return max($this->price - $maxDiscount, 0); // tránh giá âm
    }

    protected static function booted()
    {
        static::retrieved(function ($product) {
            $product->discounted_price = $product->getDiscountPrice();
        });
    }

}
