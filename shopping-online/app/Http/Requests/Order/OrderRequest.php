<?php

namespace App\Http\Requests\Order;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class OrderRequest extends FormRequest
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
            //
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:variants,id',
            'quantity' => 'required|integer|min:1',
            'address' => 'required|string',
            'phone' => 'required|string',
            'note' => 'nullable|string',
        ];
    }

    public function messages() {
        return [
            'product_id.exists' => 'Product not found',
            'variant_id.exists' => 'Variant not found',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new ValidationException($validator, response()->json([
            'status' => 'error',
            'message' => 'Validation failed, please check your inputs.',
            'errors' => $validator->errors(),
        ], 422));
    }

    public function passedValidation()
    {
        response()->json([
            'status' => 'success',
            'message' => 'Validation passed successfully.',
        ])->send();
    }
}
