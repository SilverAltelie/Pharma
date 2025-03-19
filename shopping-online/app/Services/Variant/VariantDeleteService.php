<?php

namespace App\Services\Variant;

use App\Models\Variant;

class VariantDeleteService
{
    public function handle($id) {
        return Variant::destroy($id);
    }
}
