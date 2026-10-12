<?php

namespace Database\Seeders;

use App\Models\Vacancy;
use Illuminate\Database\Seeder;

class VacancySeeder extends Seeder
{
    /**
     * Seed the vacancies table with sample Dicoding jobs.
     */
    public function run(): void
    {
        $vacancies = [
            ['Product Engineer', 'Software Engineer', 'full_time', 'Bandung', '4_5'],
            ['Android Developer', 'Mobile Developer', 'full_time', 'Bandung', '1_3'],
            ['iOS Developer', 'Mobile Developer', 'full_time', 'Bandung', '1_3'],
            ['Code Reviewer', 'Technical Reviewer', 'part_time', 'Remote', 'lt_1'],
            ['Backend Engineer', 'Backend Developer', 'full_time', 'Bandung', '4_5'],
            ['Frontend Engineer', 'Frontend Developer', 'full_time', 'Bandung', '1_3'],
            ['DevOps Engineer', 'DevOps Engineer', 'full_time', 'Jakarta', '4_5'],
            ['UI/UX Designer', 'Product Designer', 'contract', 'Remote', '1_3'],
            ['Product Manager', 'Product Manager', 'full_time', 'Jakarta', '6_10'],
            ['Data Analyst', 'Data Analyst', 'full_time', 'Bandung', '1_3'],
            ['Machine Learning Engineer', 'Machine Learning Engineer', 'full_time', 'Remote', '4_5'],
            ['QA Engineer', 'Quality Assurance Engineer', 'full_time', 'Bandung', '1_3'],
            ['Technical Writer', 'Technical Writer', 'contract', 'Remote', '1_3'],
            ['Curriculum Developer', 'Learning Content Developer', 'full_time', 'Bandung', '4_5'],
            ['Platform Engineer Intern', 'Software Engineer Intern', 'internship', 'Bandung', 'lt_1'],
        ];

        foreach ($vacancies as [$title, $position, $employmentType, $location, $experience]) {
            Vacancy::updateOrCreate(
                ['title' => $title, 'company_name' => 'Dicoding Indonesia'],
                [
                    'position' => $position,
                    'employment_type' => $employmentType,
                    'candidates_needed' => 1,
                    'active_until' => now()->addDays(30)->toDateString(),
                    'location' => $location,
                    'is_remote' => $location === 'Remote',
                    'description' => '<p>Join Dicoding Indonesia as a '.$position.' and help us build meaningful learning experiences for developers.</p>',
                    'salary_min' => 5_000_000,
                    'salary_max' => 15_000_000,
                    'show_salary' => false,
                    'min_experience' => $experience,
                ],
            );
        }
    }
}
