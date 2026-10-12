<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VacancyController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::get('/vacancies', [VacancyController::class, 'index']);
Route::get('/vacancies/{vacancy}', [VacancyController::class, 'show']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/vacancies', [VacancyController::class, 'store']);
    Route::patch('/vacancies/{vacancy}', [VacancyController::class, 'update']);
    Route::delete('/vacancies/{vacancy}', [VacancyController::class, 'destroy']);
});
