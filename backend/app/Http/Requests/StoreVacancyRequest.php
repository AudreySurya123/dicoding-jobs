<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'employment_type' => ['required', 'in:full_time,part_time,contract,internship'],
            'candidates_needed' => ['required', 'integer', 'min:0'],
            'active_until' => ['required', 'date', 'after:today'],
            'location' => ['required', 'string', 'max:255'],
            'is_remote' => ['required', 'boolean'],
            'description' => ['required', 'string'],
            'salary_min' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'salary_max' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'show_salary' => ['required', 'boolean'],
            'min_experience' => ['required', 'in:lt_1,1_3,4_5,6_10,gt_10'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $salaryMin = $this->input('salary_min');
                $salaryMax = $this->input('salary_max');

                if ($salaryMin !== null && $salaryMax !== null && $salaryMax < $salaryMin) {
                    $validator->errors()->add('salary_max', 'The maximum salary must be greater than or equal to the minimum salary.');
                }
            },
        ];
    }
}
