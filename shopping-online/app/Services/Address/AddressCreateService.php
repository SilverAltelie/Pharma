<?php

namespace App\Services\Address;

use App\Models\Address;

class AddressCreateService
{
    public function handle($data, $user)
    {
        $address = $user->addresses()->create($data);

        return response()->json([
            'address' => $address
        ]);
    }
}
