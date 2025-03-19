<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class ReviewRequest extends FormRequest
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
            'product_id' => 'required|exists:products,id',
            'comment' => 'nullable|string',
            'rate' => 'required|numeric|min:1|max:5',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'The product_id field is required.',
            'product_id.exists' => 'The selected product_id is invalid.',
            'comment.string' => 'The comment must be a string.',
            'rate.required' => 'The rate field is required.',
            'rate.numeric' => 'The rate must be a number.',
            'rate.min' => 'The rate must be at least 1.',
            'rate.max' => 'The rate must not exceed 5.',
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
