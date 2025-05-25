<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Order extends Model
{
    use HasFactory, Searchable;

    protected $table = 'orders';

    protected $fillable = ['user_id', 'status', 'payment_id', 'note', 'address_id', 'amount'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function address() {
        return $this->belongsTo(Address::class);
    }

    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }

    public function payment() {
        return $this->hasOne(Payment::class);
    }

    public function getTotalPriceAttribute() {
        return $this->orderItems->sum(function ($item) {
            return $item->variant->price * $item->quantity ?? $item->product->price * $item->quantity;
        });
    }
}
