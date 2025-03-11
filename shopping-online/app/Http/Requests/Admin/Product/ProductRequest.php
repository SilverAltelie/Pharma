<?php

namespace App\Http\Requests\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'content' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:0,1',
            'image' => 'nullable|string',
            'image.*' => 'nullable|string',
            'quantity' => 'required|numeric|min:1',
            'category_id' => 'required|exists:categories,id',
        ];
    }
}
