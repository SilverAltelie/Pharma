<?php

namespace App\Http\Controllers\User\Category;

use App\Http\Controllers\Controller;
use App\Services\Category\CategoryShowService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    protected $categoryShowService;

    public function __construct(CategoryShowService $categoryShowService){
        $this->categoryShowService = $categoryShowService;
    }

    public function show($id)
    {
        return $this->categoryShowService->handle($id);
    }
}
