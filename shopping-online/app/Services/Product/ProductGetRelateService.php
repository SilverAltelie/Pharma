<?php

namespace App\Services\Product;

use Algolia\AlgoliaSearch\RecommendClient;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use \Exception;

class ProductGetRelateService
{
    public function handle($id)
    {
        $appId = env('ALGOLIA_APP_ID');
        $searchKey = env('ALGOLIA_SECRET');
        $userId = Auth::id() ?? Cookie::get('guest_id', uniqid());

        if (!$appId || !$searchKey) {
            throw new \Exception("Thiếu thông tin cấu hình Algolia");
        }

        try {
            $client = RecommendClient::create($appId, $searchKey);

            $requestData = [
                'requests' => [
                    [
                        'indexName' => 'products',
                        'objectID' => (string)$id,
                        'model' => 'related-products',
                        'threshold' => 42.1,
                    ],
                    [
                        'indexName' => 'products',
                        'userToken' => $userId,
                        'model' => 'personalization',
                    ]
                ],
            ];

            // Gọi hàm recommend() để lấy các sản phẩm liên quan
            $response = $client->getRecommendations($requestData);

        } catch (\Exception $exception) {
            throw new Exception($exception->getMessage());
        }

        // Kiểm tra và log cấu trúc dữ liệu trả về
        \Log::debug('Response from Algolia: ', $response);

        // Kiểm tra nếu 'results' không tồn tại hoặc không phải mảng
        if (!isset($response['results']) || !is_array($response['results'])) {
            throw new \Exception("Dữ liệu trả về từ Algolia không hợp lệ: " . json_encode($response));
        }

        // Kiểm tra xem mỗi phần tử trong 'results' có chứa 'model' không
        foreach ($response['results'] as $index => $result) {
            // Log toàn bộ phần tử 'result' để xem cấu trúc
            \Log::debug("Result index: $index", $result);

            if (isset($result['hits']) && is_array($result['hits'])) {
                foreach ($result['hits'] as $hitIndex => $hit) {
                    // Log mỗi phần tử 'hit' để kiểm tra cấu trúc
                    \Log::debug("Hit $hitIndex: ", $hit);

                    // Kiểm tra sự tồn tại của trường 'model'
                    if (isset($hit['model'])) {
                        $model = $hit['model'];
                    } else {
                        $model = 'default-model'; // Sử dụng giá trị mặc định nếu không có 'model'
                    }
                    // Xử lý các hit khác (nếu cần)
                }
            }
        }

        return $response;
    }
}
