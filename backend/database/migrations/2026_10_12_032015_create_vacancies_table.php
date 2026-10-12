<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title')->index();
            $table->string('position');
            $table->string('company_name')->default('Dicoding Indonesia');
            $table->enum('employment_type', ['full_time', 'part_time', 'contract', 'internship']);
            $table->unsignedInteger('candidates_needed');
            $table->date('active_until');
            $table->string('location');
            $table->boolean('is_remote');
            $table->longText('description');
            $table->unsignedInteger('salary_min')->nullable();
            $table->unsignedInteger('salary_max')->nullable();
            $table->boolean('show_salary');
            $table->enum('min_experience', ['lt_1', '1_3', '4_5', '6_10', 'gt_10']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
