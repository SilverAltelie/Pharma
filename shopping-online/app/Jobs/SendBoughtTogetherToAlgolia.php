<?php
namespace App\Jobs;

use App\Models\OrderItem;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendBoughtTogetherToAlgolia implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        // Lấy danh sách tất cả các đơn hàng có nhiều hơn 1 sản phẩm
        $orders = \App\Models\Order::with('orderItems')
            ->has('orderItems', '>', 1)
            ->get();

        $relations = [];

        foreach ($orders as $order) {
            $productIds = $order->orderItems->pluck('product_id');

            foreach ($productIds as $productId) {
                $others = $productIds->filter(fn($id) => $id !== $productId)->values();

                $key = "App\\Models\\Product::{$productId}";

                if (!isset($relations[$key])) {
                    $relations[$key] = collect();
                }

                $relations[$key] = $relations[$key]->merge($others);
            }
        }

        // Loại bỏ trùng lặp
        $finalData = [];
        foreach ($relations as $objectID => $relatedIds) {
            $finalData[] = [
                'objectID' => $objectID,
                'bought_together' => $relatedIds->unique()->map(fn($id) => "App\\Models\\Product::{$id}")->values(),
            ];
        }

        // Gửi lên Algolia
        foreach ($finalData as $data) {
            Http::withHeaders([
                'X-Algolia-Application-Id' => env('ALGOLIA_APPLICATION_ID'),
                'X-Algolia-API-Key' => env('ALGOLIA_API_KEY'),
            ])->post('https://insights.algolia.io/1/events', [
                'events' => [
                    [
                        'eventType' => 'conversion',
                        'eventName' => 'Bought Product',
                        'index' => 'products',
                        'userToken' => 'anonymous', // hoặc lấy từ người dùng thật nếu có
                        'objectIDs' => $data['bought_together'],
                        'timestamp' => now()->timestamp * 1000,
                    ],
                ],
            ]);
        }

    }
}
