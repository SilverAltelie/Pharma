<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Algolia\AlgoliaSearch\InsightsClient;

class SyncUserBehaviorToAlgolia implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $event;

    /**
     * Nhận event khi job được tạo.
     */
    public function __construct($event)
    {
        $this->event = $event;
    }

    /**
     * Gửi event đến Algolia Insights API.
     */
    public function handle()
    {
        $client = InsightsClient::create(env('ALGOLIA_APP_ID'), env('ALGOLIA_ADMIN_KEY'));

        // Sự kiện hành động của người dùng, ví dụ "Mua sản phẩm" hoặc "Thêm vào giỏ hàng"
        $client->user($this->event['user_id'])->sendEvent([
            'eventType' => $this->event['action'],  // "Bought Together" hoặc "Viewed Together"
            'eventName' => ucfirst($this->event['action']),
            'index' => 'products',  // Index sản phẩm
            'userToken' => $this->event['user_id'],
            'objectIDs' => $this->event['product_ids'], // Array các sản phẩm đã được mua cùng nhau
            'timestamp' => now()->timestamp,
        ]);
    }
}
