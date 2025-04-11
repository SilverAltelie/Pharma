<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class CartRequest extends FormRequest{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        return [
          'product_id' => 'required|integer',
          'variant_id' => 'nullable|integer',
          'quantity' => 'required|integer',
        ];
    }

    public function messages() {
        return [
            'product_id.required' => 'Product ID is required.',
            'product_id.integer' => 'Product ID must be an integer.',
            'variant_id.integer' => 'Variant ID must be an integer.',
            'quantity.required' => 'Quantity is required.',
            'quantity.integer' => 'Quantity must be an integer.',
        ];
    }
}
