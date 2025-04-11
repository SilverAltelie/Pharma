<?php

namespace App\Http\Controllers\User\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\UpdateRelateRequest;
use App\Models\Product;
use App\Services\Product\ProductGetRelateService;
use App\Services\Product\ProductShowService;
use App\Services\Product\ProductUpdateRelateService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    //
    protected $productShowService;

    protected $productGetRelateService;

    protected $productUpdateRelateService;

    public function __construct(ProductShowService $productShowService,
                                ProductGetRelateService $productGetRelateService,
                                ProductUpdateRelateService $productUpdateRelateService) {
        $this->productShowService = $productShowService;
        $this->productGetRelateService = $productGetRelateService;
        $this->productUpdateRelateService = $productUpdateRelateService;
    }
    public function index()
    {
        return Product::paginnate(10);
    }

    public function show($id)
    {
        return $this->productShowService->handle($id);
    }

    public function updateRelate(UpdateRelateRequest $request)
    {
        $request = $request->validated();

        $id = $request->input('product_id');

        $this->productUpdateRelateService->handle($id, $request);
    }

    public function getRelate($id)
    {
        return $this->productGetRelateService->handle($id);
    }
}
