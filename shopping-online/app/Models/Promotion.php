<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $table = 'promotions';
    protected $fillable = ['name', 'description', 'start_date', 'end_date', 'status'];

    public function promotionItems() {
        return $this->hasMany(PromotionItem::class);
    }
}
