<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = ['title', 'description', 'content', 'price', 'quantity', 'status', 'category_id'];

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
}
