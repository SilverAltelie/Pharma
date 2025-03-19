<?php

namespace App\Services\Address;

use App\Models\Address;

class AddressCreateService
{
    public function handle($data, $user)
    {
        return $user->addresses()->create($data);
    }
}
