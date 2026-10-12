<?php

namespace App\Http\Requests;

use App\Models\Vacancy;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'required', 'string', 'max:255'],
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'employment_type' => ['sometimes', 'required', 'in:full_time,part_time,contract,internship'],
            'candidates_needed' => ['sometimes', 'required', 'integer', 'min:0'],
            'active_until' => ['sometimes', 'required', 'date', 'after:today'],
            'location' => ['sometimes', 'required', 'string', 'max:255'],
            'is_remote' => ['sometimes', 'required', 'boolean'],
            'description' => ['sometimes', 'required', 'string'],
            'salary_min' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'salary_max' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'show_salary' => ['sometimes', 'required', 'boolean'],
            'min_experience' => ['sometimes', 'required', 'in:lt_1,1_3,4_5,6_10,gt_10'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                /** @var Vacancy $vacancy */
                $vacancy = $this->route('vacancy');
                $salaryMin = $this->input('salary_min', $vacancy->salary_min);
                $salaryMax = $this->input('salary_max', $vacancy->salary_max);

                if ($salaryMin !== null && $salaryMax !== null && $salaryMax < $salaryMin) {
                    $validator->errors()->add('salary_max', 'The maximum salary must be greater than or equal to the minimum salary.');
                }
            },
        ];
    }
}
