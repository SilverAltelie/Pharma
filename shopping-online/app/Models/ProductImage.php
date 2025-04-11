<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class ProductImage extends Model
{
    use HasFactory, Searchable;

    protected $table = 'product_images';
    protected $fillable = ['product_id', 'image'];

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
