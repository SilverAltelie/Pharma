<?php

namespace App\Services\Address;

use App\Models\Address;

class AddressDeleteService
{
    public function handle($user, $id)
    {
        $address = $user->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'message' => 'Address not found'
            ], 404);
        }

        $address->delete();

        return response()->json([
            'message' => 'Address deleted'
        ]);
    }
}
