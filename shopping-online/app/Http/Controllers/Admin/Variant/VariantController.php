<?php

namespace App\Http\Controllers\Admin\Variant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Variant\VariantRequest;
use App\Services\Variant\VariantCreateService;
use App\Services\Variant\VariantUpdateService;
use App\Services\Variant\VariantDeleteService;
use Illuminate\Http\Request;

class VariantController extends Controller
{

    protected $variantCreateService;
    protected $variantUpdateService;
    protected $variantDeleteService;
    /**
     * Display a listing of the resource.
     */

    public function __construct(VariantCreateService $variantCreateService, VariantUpdateService $variantUpdateService, VariantDeleteService $variantDeleteService) {
        $this->variantCreateService = $variantCreateService;
        $this->variantUpdateService = $variantUpdateService;
        $this->variantDeleteService = $variantDeleteService;
    }

    public function index()
    {
        //
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
    public function store(VariantRequest $request)
    {
        //
        $validated = $request->validated();

        return $this->variantCreateService->handle($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(igrate $igrate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(igrate $igrate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(VariantRequest $request, $id)
    {
        //
        $validated = $request->validated();
        return $this->variantUpdateService->handle($validated, $id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        return $this->variantDeleteService->handle($id);
    }
}
