<?php

namespace App\Http\Requests\Promotion;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PromotionRequest extends FormRequest
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
        $promotionId = $this->route('id');
        return [
            //
            'name' => 'required|string|max:255',
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('promotions', 'code')->ignore($promotionId),
            ],
            'discount' => 'nullable|integer|min:0',
            'type' => 'required|string|in:percent,price',
            'start_date' => 'required|date|after:today',
            'end_date' => 'required|date|after:start_date',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên khuyến mãi là bắt buộc.',
            'name.string' => 'Tên khuyến mãi phải là một chuỗi.',
            'name.max' => 'Tên khuyến mãi không được vượt quá 255 ký tự.',
            'code.required' => 'Mã khuyến mãi là bắt buộc.',
            'code.string' => 'Mã khuyến mãi phải là một chuỗi.',
            'code.max' => 'Mã khuyến mãi không được vượt quá 255 ký tự.',
            'code.unique' => 'Mã khuyến mãi đã tồn tại.',
            'discount.integer' => 'Giá trị phần trăm phải là một số nguyên.',
            'discount.min' => 'Giá trị phần trăm không được nhỏ hơn 0.',
            'type.required' => 'Loại khuyến mãi là bắt buộc.',
            'type.string' => 'Loại khuyến mãi phải là một chuỗi.',
            'type.in' => 'Loại khuyến mãi không hợp lệ.',
            'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
            'start_date.date' => 'Ngày bắt đầu không hợp lệ.',
            'start_date.after' => 'Ngày bắt đầu phải sau ngày hôm nay.',
        ];
    }
}
