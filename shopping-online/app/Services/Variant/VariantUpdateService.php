<?php

namespace App\Services\Variant;

use App\Models\Variant;

class VariantUpdateService
{
    public function handle($data, $id) {

        $variant = Variant::findOrFail($id);

        return $variant->update($data);
    }
}
