<?php

namespace Database\Factories;

use App\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vacancy>
 */
class VacancyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $salaryMin = fake()->numberBetween(5_000_000, 15_000_000);

        return [
            'title' => fake()->jobTitle(),
            'position' => fake()->jobTitle(),
            'employment_type' => fake()->randomElement(['full_time', 'part_time', 'contract', 'internship']),
            'candidates_needed' => fake()->numberBetween(1, 10),
            'active_until' => fake()->dateTimeBetween('+1 day', '+1 year')->format('Y-m-d'),
            'location' => fake()->city(),
            'is_remote' => fake()->boolean(),
            'description' => '<p>'.fake()->paragraph().'</p>',
            'salary_min' => $salaryMin,
            'salary_max' => $salaryMin + fake()->numberBetween(0, 10_000_000),
            'show_salary' => fake()->boolean(),
            'min_experience' => fake()->randomElement(['lt_1', '1_3', '4_5', '6_10', 'gt_10']),
        ];
    }
}
