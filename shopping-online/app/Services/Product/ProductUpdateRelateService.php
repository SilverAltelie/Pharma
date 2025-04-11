<?php

namespace App\Services\Product;

use Algolia\AlgoliaSearch\InsightsClient;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Auth;

class ProductUpdateRelateService
{
    public function handle($id, $data)
    {
        $productId = $data->product_id;
        $userId = Auth::id() ?? Cookie::get('guest_id', uniqid()); // Lấy user ID hoặc tạo guest ID

        // Lấy danh sách sản phẩm đã xem từ cookie
        $viewedProducts = json_decode(Cookie::get('viewed_products', '[]'), true);

        // Nếu sản phẩm chưa có trong danh sách thì thêm vào
        if (!in_array($productId, $viewedProducts)) {
            $viewedProducts[] = $productId;
        }

        // Giữ tối đa 10 sản phẩm gần nhất
        if (count($viewedProducts) > 10) {
            array_shift($viewedProducts);
        }

        // Gửi dữ liệu hành vi lên Algolia Insights
        $this->sendEventToAlgolia($userId, $productId);

        // Lưu danh sách vào cookie (7 ngày)
        $cookie = Cookie::make('viewed_products', json_encode($viewedProducts), 60 * 24 * 7);

        return response()->json(['message' => 'Updated related items', 'relatedItems' => $viewedProducts])
            ->cookie($cookie);
    }

    private function sendEventToAlgolia($userId, $productId)
    {
        $client = InsightsClient::create(env('ALGOLIA_APP_ID'), env('ALGOLIA_ADMIN_KEY'));

        $client->user($userId)->sendEvent([
            'eventType' => 'view',
            'eventName' => 'Viewed',
            'index' => 'products',
            'userToken' => $userId,
            'objectIDs' => [$productId],
            'timestamp' => now()->timestamp,
        ]);
    }
}
