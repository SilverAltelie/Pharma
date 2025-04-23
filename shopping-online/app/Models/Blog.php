<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $table = 'blogs';

    protected $fillable = [
        'title', 'content', 'thumbnail', 'admin_id', 'category_id'
    ];

    public function admin() {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    public function category() {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }
}
