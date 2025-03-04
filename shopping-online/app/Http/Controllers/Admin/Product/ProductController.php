<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\ProductRequest;
use App\Models\Product;
use App\Services\Admin\Product\ProductCreateService;
use App\Services\Admin\Product\ProductUpdateService;
use App\Services\Admin\Product\ProductDeleteService;
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
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Product::paginate(10);
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
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
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
