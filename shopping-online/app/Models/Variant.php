<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    use HasFactory;

    protected $table = 'variants';

    protected $fillable = ['product_id', 'name', 'price', 'quantity'];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function cartItems() {
        return $this->hasMany(CartItem::class);
    }
}
