<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Category\CategoryListService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MainController extends Controller
{
    //
    protected $categoriesListService;

    public function __construct(CategoryListService $categoryListService) {
        $this->categoriesListService = $categoryListService;
    }
    public function index() {
        $products = Product::paginate(10);

        $categories = $this->categoriesListService->handle();

        $user = Auth::user();

        return response()->json([
            'products' => $products,
            'categories' => $categories,
            'user' => $user
        ]);
    }
}
