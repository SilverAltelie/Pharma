<?php

namespace App\Services\Variant;

use App\Models\Variant;

class VariantCreateService
{
    public function handle($data) {
        return Variant::create($data);
    }
}
