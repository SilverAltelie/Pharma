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
            //
            'title' => 'required|string',
            'description' => 'required|string',
            'content' => 'required|string',
            'price' => 'required|numeric',
            'status' => 'required|in:0,1',
            'image' => 'nullable|image',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image',
            'quantity' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
        ];
    }
}
