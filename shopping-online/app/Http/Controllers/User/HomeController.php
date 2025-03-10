<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class HomeController extends Controller
{
    //
    public function index()
    {
        $user = Auth::user();

        $category = Category::all();

        $product = Product::paginate(10);

        return [
            'user' => $user,
            'category' => $category,
            'product' => $product
        ];
    }
}
