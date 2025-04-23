<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class BlogRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'thumbnail' => 'nullable|string',
            'category_id' => 'required|exists:blog_categories,id',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'The title field is required.',
            'content.required' => 'The content field is required.',
            'thumbnail.string' => 'The thumbnail field must be a string.',
            'category_id.required' => 'The category field is required.',
            'category_id.exists' => 'The selected category is invalid.',
        ];
    }
}
