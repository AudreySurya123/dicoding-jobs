<?php

namespace Tests\Unit;

use App\Http\Requests\StoreVacancyRequest;
use App\Http\Requests\UpdateVacancyRequest;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class VacancyRequestValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_request_accepts_valid_data_and_rejects_invalid_salary_and_expiry(): void
    {
        $validData = $this->validVacancyData();

        $this->assertTrue($this->validateStoreRequest($validData)->passes());

        $equalSalary = $validData;
        $equalSalary['salary_max'] = $equalSalary['salary_min'];
        $this->assertTrue($this->validateStoreRequest($equalSalary)->passes());

        $invalidSalary = $validData;
        $invalidSalary['salary_min'] = 10_000_000;
        $invalidSalary['salary_max'] = 9_000_000;
        $this->assertTrue($this->validateStoreRequest($invalidSalary)->errors()->has('salary_max'));

        $expiredVacancy = $validData;
        $expiredVacancy['active_until'] = now()->subDay()->toDateString();
        $this->assertTrue($this->validateStoreRequest($expiredVacancy)->errors()->has('active_until'));
    }

    public function test_update_request_compares_submitted_salary_with_existing_salary(): void
    {
        $vacancy = Vacancy::factory()->create([
            'salary_min' => 5_000_000,
            'salary_max' => 8_000_000,
        ]);
        $request = UpdateVacancyRequest::create('/api/vacancies/'.$vacancy->id, 'PATCH', [
            'salary_min' => 9_000_000,
        ]);
        $request->setContainer($this->app);
        $request->setRedirector($this->app['redirect']);
        $route = new Route('PATCH', '/api/vacancies/{vacancy}', []);
        $route->bind($request);
        $route->setParameter('vacancy', $vacancy);
        $request->setRouteResolver(fn () => $route);

        $validator = Validator::make($request->all(), $request->rules());
        foreach ($request->after() as $callback) {
            $callback($validator);
        }

        $this->assertTrue($validator->errors()->has('salary_max'));
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function validateStoreRequest(array $data): \Illuminate\Validation\Validator
    {
        $request = StoreVacancyRequest::create('/api/vacancies', 'POST', $data);
        $validator = Validator::make($request->all(), $request->rules());

        foreach ($request->after() as $callback) {
            $callback($validator);
        }

        return $validator;
    }

    /**
     * @return array<string, mixed>
     */
    private function validVacancyData(): array
    {
        return [
            'title' => 'Product Engineer',
            'position' => 'Software Engineer',
            'employment_type' => 'full_time',
            'candidates_needed' => 1,
            'active_until' => now()->addDays(30)->toDateString(),
            'location' => 'Bandung',
            'is_remote' => false,
            'description' => '<p>Build great products.</p>',
            'salary_min' => 5_000_000,
            'salary_max' => 8_000_000,
            'show_salary' => false,
            'min_experience' => '1_3',
        ];
    }
}
