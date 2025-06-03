<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $table = 'promotions';

    protected $fillable = [
        'name',
        'code',
        'discount',
        'type',
        'start_date',
        'end_date',
    ];

    public function items()
    {
        return $this->hasMany(PromotionItem::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'promotion_items');
    }

    public function getPromotionTypeAttribute()
    {
        return $this->type === 'percent' ? 'Giảm giá theo phần trăm' : 'Giảm giá theo giá tiền';
    }

    public function getPromotionValueAttribute()
    {
        return $this->type === 'percent' ? $this->percent : $this->price;
    }

    public function getPromotionDateAttribute()
    {
        return $this->start_date->format('d/m/Y') . ' - ' . $this->end_date->format('d/m/Y');
    }

    public function getPromotionStatusAttribute()
    {
        $now = now();
        if ($this->start_date > $now) {
            return 0;
        } elseif ($this->end_date < $now) {
            return 2;
        } else {
            return 1;
        }
    }
}
