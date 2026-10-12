<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_paginated_vacancies_and_searches_by_title(): void
    {
        Vacancy::factory()->create(['title' => 'Product Engineer']);
        Vacancy::factory()->create(['title' => 'Android Developer']);
        Vacancy::factory()->count(15)->create();

        $this->getJson('/api/vacancies')
            ->assertOk()
            ->assertJsonCount(15, 'data')
            ->assertJsonPath('meta.total', 17)
            ->assertJsonPath('meta.per_page', 15);

        $this->getJson('/api/vacancies?search=Product')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Product Engineer');
    }

    public function test_store_creates_a_vacancy_and_returns_created_status(): void
    {
        $this->actingAs(User::factory()->create());

        $this->postJson('/api/vacancies', $this->validVacancyData())
            ->assertCreated()
            ->assertJsonPath('data.title', 'Product Engineer')
            ->assertJsonPath('data.company_name', 'Dicoding Indonesia');

        $this->assertDatabaseHas('vacancies', ['title' => 'Product Engineer']);
    }

    public function test_store_returns_validation_errors_for_invalid_salary_or_expiry(): void
    {
        $this->actingAs(User::factory()->create());

        $this->postJson('/api/vacancies', $this->validVacancyData([
            'salary_min' => 10_000_000,
            'salary_max' => 9_000_000,
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['salary_max']);

        $this->postJson('/api/vacancies', $this->validVacancyData([
            'active_until' => now()->subDay()->toDateString(),
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['active_until']);
    }

    public function test_show_returns_a_vacancy_and_returns_not_found_for_an_unknown_id(): void
    {
        $vacancy = Vacancy::factory()->create(['title' => 'Product Engineer']);

        $this->getJson('/api/vacancies/'.$vacancy->id)
            ->assertOk()
            ->assertJsonPath('data.id', $vacancy->id)
            ->assertJsonPath('data.title', 'Product Engineer');

        $this->getJson('/api/vacancies/999999')->assertNotFound();
    }

    public function test_update_changes_a_vacancy_and_validates_merged_salary_range(): void
    {
        $this->actingAs(User::factory()->create());

        $vacancy = Vacancy::factory()->create([
            'title' => 'Product Engineer',
            'salary_min' => 5_000_000,
            'salary_max' => 8_000_000,
        ]);

        $this->patchJson('/api/vacancies/'.$vacancy->id, ['title' => 'Senior Product Engineer'])
            ->assertOk()
            ->assertJsonPath('data.title', 'Senior Product Engineer');

        $this->patchJson('/api/vacancies/'.$vacancy->id, ['salary_min' => 9_000_000])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['salary_max']);

        $this->patchJson('/api/vacancies/'.$vacancy->id, [
            'active_until' => now()->toDateString(),
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['active_until']);

        $this->patchJson('/api/vacancies/999999', ['title' => 'Missing vacancy'])
            ->assertNotFound();
    }

    public function test_destroy_deletes_a_vacancy_and_returns_not_found_for_an_unknown_id(): void
    {
        $this->actingAs(User::factory()->create());

        $vacancy = Vacancy::factory()->create();

        $this->deleteJson('/api/vacancies/'.$vacancy->id)->assertNoContent();
        $this->assertDatabaseMissing('vacancies', ['id' => $vacancy->id]);

        $this->deleteJson('/api/vacancies/999999')->assertNotFound();
    }

    public function test_vacancy_writes_require_an_authenticated_recruiter(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->postJson('/api/vacancies', $this->validVacancyData())->assertUnauthorized();
        $this->patchJson('/api/vacancies/'.$vacancy->id, ['title' => 'Updated'])->assertUnauthorized();
        $this->deleteJson('/api/vacancies/'.$vacancy->id)->assertUnauthorized();
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validVacancyData(array $overrides = []): array
    {
        return array_merge([
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
        ], $overrides);
    }
}
