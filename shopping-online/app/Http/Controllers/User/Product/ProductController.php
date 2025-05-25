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
        $products = Product::with(['images'])
            ->paginate(12);

        // Transform products data
        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'discounted_price' => $product->price, // For now, same as price
                'image' => $product->images->first() ? $product->images->first()->image : null,
                'status' => $product->status,
                'category_id' => $product->category_id,
            ];
        });

        return response()->json($products);
    }

    public function show($id)
    {
        return $this->productShowService->handle($id);
    }

    public function updateRelate(Request $request)
    {
        return $this->productUpdateRelateService->handle($request);
    }

    public function getRelate($id)
    {
        return $this->productGetRelateService->handle($id);
    }
}
