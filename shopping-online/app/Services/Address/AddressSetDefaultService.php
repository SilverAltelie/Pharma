<?php

namespace App\Services\Address;

use App\Models\Address;

class AddressSetDefaultService
{
    public function handle($user, $id)
    {
        $address = $user->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'message' => 'Address not found'
            ], 404);
        }

        $user->addresses()->update([
            'is_default' => '0'
        ]);

        $address->update([
            'is_default' => '1'
        ]);

        return response()->json([
            'address' => $address
        ]);
    }
}
