<?php

namespace App\Services\Address;

use App\Models\Address;

class AddressUpdateService
{
    public function handle($data, $user, $id)
    {
        $address = $user->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'message' => 'Address not found'
            ], 404);
        }

        $updatedData = $data->only(['first_name', 'last_name', 'email', 'phone', 'address']);

        $updatedData['is_default'] = $address->is_default ?? 0;

        $address->update($updatedData);

        return response()->json([
            'address' => $address
        ]);
    }
}
