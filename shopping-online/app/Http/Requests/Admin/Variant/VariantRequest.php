<?php

namespace App\Http\Requests\Admin\Variant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class VariantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'price' => ['numeric'],
            'quantity' => ['numeric'],
            'product_id' => ['numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a string.',
            'price.numeric' => 'The price must be a numeric value.',
            'quantity.numeric' => 'The quantity must be a numeric value.',
            'product_id.numeric' => 'The product_id must be a numeric value.',
        ];
    }

}
