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
            'cartItems' => 'required|array',
            'address_id' => 'required|integer|exists:addresses,id',
            'note' => 'nullable|string',
            'payment_id' => 'required|integer|exists:payments,id',
            'amount' => 'required|string',
        ];
    }

    public function messages() {
        return [
            'cartItems.required' => 'Cart items is required.',
            'address_id.required' => 'Address id is required.',
            'address_id.integer' => 'Address id must be an integer.',
            'address_id.exists' => 'Address id does not exist.',
            'payment_id.required' => 'Payment method is required.',
            'payment_id.integer' => 'Payment method must be an integer.',
            'payment_id.exists' => 'Payment method does not exist.',
        ];
    }
}
