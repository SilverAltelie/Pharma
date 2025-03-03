<?php

namespace App\Services\Category;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategoryCreateService
{
    public function handle($data)
    {
        return Category::create((array) $data);
    }


}