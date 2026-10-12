<?php

namespace Tests\Unit;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyScopeSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_filters_vacancies_by_partial_title_match(): void
    {
        $matchingVacancy = Vacancy::factory()->create(['title' => 'Senior Product Engineer']);
        Vacancy::factory()->create(['title' => 'Android Developer']);

        $results = Vacancy::query()->search('Product')->get();

        $this->assertCount(1, $results);
        $this->assertTrue($results->first()->is($matchingVacancy));
    }

    public function test_it_returns_all_vacancies_when_search_is_empty(): void
    {
        Vacancy::factory()->count(2)->create();

        $this->assertCount(2, Vacancy::query()->search(null)->get());
        $this->assertCount(2, Vacancy::query()->search('')->get());
    }
}
