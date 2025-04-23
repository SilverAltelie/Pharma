<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\ProductRequest;
use App\Models\Product;
use App\Models\User;
use App\Services\Product\ProductCreateService;
use App\Services\Product\ProductUpdateService;
use App\Services\Product\ProductDeleteService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productCreateService;
    protected $productUpdateService;
    protected $productDeleteService;

    public function __construct(ProductCreateService $productCreateService, ProductUpdateService $productUpdateService, ProductDeleteService $productDeleteService) {
        $this->productCreateService = $productCreateService;
        $this->productUpdateService = $productUpdateService;
        $this->productDeleteService = $productDeleteService;

        $permissions = config('permission.product');

        foreach ($permissions as $method => $permission) {
            $this->middleware("permission:$permission")->only($method);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('images')->paginate(12);
        foreach ($products as $product) {
            $product->discounted_price = $product->getDiscountPrice();
        }
        return $products;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        //
        $validated = $request->validated();

        return $this->productCreateService->handle($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $product = Product::with(['variants', 'reviews.user', 'images'])->findOrFail($id);

        return $product;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        return Product::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, $id)
    {
        //
        $validated = $request->validated();
        return $this->productUpdateService->handle($validated, $id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        return $this->productDeleteService->handle($id);
    }
}
