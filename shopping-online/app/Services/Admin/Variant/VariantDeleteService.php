<?php

namespace App\Services\Admin\Variant;

use App\Models\Variant;

class VariantDeleteService
{
    public function handle($id) {
        return Variant::destroy($id);
    }
}
