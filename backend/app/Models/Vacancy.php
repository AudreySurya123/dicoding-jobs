<?php

namespace App\Models;

use Database\Factories\VacancyFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    /** @use HasFactory<VacancyFactory> */
    use HasFactory;

    protected $attributes = [
        'company_name' => 'Dicoding Indonesia',
    ];

    protected $fillable = [
        'title',
        'position',
        'company_name',
        'employment_type',
        'candidates_needed',
        'active_until',
        'location',
        'is_remote',
        'description',
        'salary_min',
        'salary_max',
        'show_salary',
        'min_experience',
    ];

    protected function casts(): array
    {
        return [
            'candidates_needed' => 'integer',
            'active_until' => 'date',
            'is_remote' => 'boolean',
            'salary_min' => 'integer',
            'salary_max' => 'integer',
            'show_salary' => 'boolean',
        ];
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        return $query->when(filled($search), function (Builder $query) use ($search): void {
            $query->where('title', 'like', '%'.$search.'%');
        });
    }
}
