<?php

namespace App\Http\Controllers\Admin\Promotion;

use App\Http\Controllers\Controller;
use App\Http\Requests\Promotion\PromotionRequest;
use App\Models\Promotion;
use App\Models\PromotionItem;
use App\Services\Promotion\PromotionAddItemsService;
use App\Services\Promotion\PromotionCreateService;
use App\Services\Promotion\PromotionDeleteService;
use App\Services\Promotion\PromotionRemoveItemsService;
use App\Services\Promotion\PromotionShowService;
use App\Services\Promotion\PromotionUpdateService;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    //
    protected $promotionCreateService;
    protected $promotionUpdateService;
    protected $promotionDeleteService;
    protected $promotionShowService;
    protected $promotionAddItemsService;
    protected $promotionRemoveItemsService;

    public function __construct(
        PromotionCreateService $promotionCreateService,
        PromotionUpdateService $promotionUpdateService,
        PromotionDeleteService $promotionDeleteService,
        PromotionShowService $promotionShowService,
        PromotionAddItemsService $promotionAddItemsService,
        PromotionRemoveItemsService $promotionRemoveItemsService
    ) {
        $this->promotionCreateService = $promotionCreateService;
        $this->promotionUpdateService = $promotionUpdateService;
        $this->promotionDeleteService = $promotionDeleteService;
        $this->promotionShowService = $promotionShowService;
        $this->promotionAddItemsService = $promotionAddItemsService;
        $this->promotionRemoveItemsService = $promotionRemoveItemsService;

        $permissions = config('permission.promotion');

        foreach ($permissions as $method => $permission) {
            $this->middleware("permission:$permission")->only($method);
        }
    }

    public function index()
    {
        return Promotion::paginate(10);
    }

    public function store(PromotionRequest $request)
    {
        $data = $request->validated();

        $promotion = $this->promotionCreateService->handle($data);

        return response()->json($promotion);
    }

    public function edit($id)
    {
        $promotion = Promotion::findOrFail($id);

        return response()->json($promotion);
    }

    public function update(PromotionRequest $request, $id)
    {
        $data = $request->validated();

        $promotion = $this->promotionUpdateService->handle($data, $id);

        return response()->json($promotion);
    }

    public function destroy($id)
    {
        return $this->promotionDeleteService->handle($id);
    }

    public function show($id)
    {
        return $this->promotionShowService->handle($id);
    }

    public function getItems($id) {
        return $this->promotionShowService->handle($id);
    }

    public function addItems(Request $request, $id)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
        ]);

        // Lấy promotion từ ID
        $promotion = Promotion::findOrFail($id);

        // Gọi service đúng cách: truyền promotion và items
        return $this->promotionAddItemsService->handle($promotion, $data['items']);
    }


    public function removeItems($id) {
        $promotion = Promotion::findOrFail($id);

        $promotion->items()->delete();

        return response()->json(['message' => 'Đã xóa tất cả sản phẩm khỏi khuyến mãi']);
    }
}
