<?php

namespace App\Http\Requests\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

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
            'image' => 'nullable|string', // Ảnh chính
            'images' => 'nullable|array',  // Mảng ảnh
            'images.*' => 'nullable|string',
            'quantity' => 'required|numeric|min:1',
            'category_id' => 'required|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title field is required.',
            'title.string' => 'The title must be a string.',
            'title.max' => 'The title must not exceed 255 characters.',
            'description.required' => 'The description field is required.',
            'description.string' => 'The description must be a string.',
            'description.max' => 'The description must not exceed 1000 characters.',
            'content.string' => 'The content must be a string.',
            'price.required' => 'The price field is required.',
            'price.numeric' => 'The price must be a number.',
            'price.min' => 'The price must be at least 0.',
            'status.required' => 'The status field is required.',
            'status.in' => 'The status must be either 0 or 1.',
            'image.string' => 'The image must be a string.',
            'images.array' => 'The images field must be an array.',
            'images.*.string' => 'Each image must be a string.',
            'quantity.required' => 'The quantity field is required.',
            'quantity.numeric' => 'The quantity must be a number.',
            'quantity.min' => 'The quantity must be at least 1.',
            'category_id.required' => 'The category_id field is required.',
            'category_id.exists' => 'The category_id must exist in the categories table.',
        ];
    }
}
