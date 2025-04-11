<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $methods = [
            'Trả tiền trực tiếp',
            'Chuyển khoản',
        ];

        foreach ($methods as $method) {
            Payment::create([
                'method' => $method,
            ]);
        }
    }
}
