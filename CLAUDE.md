# Dicoding Jobs - Technical Exercise
Detail soal: TASK.md. Desain: docs/design/*.png

## Stack
- Backend: Laravel (PHP), folder backend/, port 8000
- Frontend: Next.js (App Router, TypeScript, Tailwind) + TanStack Query, folder frontend/, port 3000
- Database: MySQL (dicoding_jobs)
- Test: PHPUnit (backend), Playwright (frontend E2E)

## Perintah
- Backend run:  cd backend && php artisan serve
- Backend test: cd backend && php artisan test
- Frontend run: cd frontend && npm run dev
- E2E test:     cd frontend && npx playwright test

## Scope
- TANPA autentikasi (di luar scope soal). Dashboard recruiter diakses langsung.
- Tombol Lamar tidak diimplementasikan (opsional di akhir).
- Wajib: Create, List (search by title), Detail. Opsional: Update, Delete.

## Skema tabel vacancies
id, title (index), position, company_name (default "Dicoding Indonesia"),
employment_type (full_time|part_time|contract|internship),
candidates_needed (uint), active_until (date), location, is_remote (bool),
description (longText, HTML), salary_min/salary_max (uint nullable, max >= min),
show_salary (bool), min_experience (lt_1|1_3|4_5|6_10|gt_10), timestamps.
created_at = "Dibuat pada", active_until = "Lamar sebelum".

## Aturan Backend
- Form Request untuk validasi, API Resource untuk response, controller tipis.
- Endpoint di routes/api.php. Search lewat query ?search= pada title, dipaginasi.
- Response JSON konsisten. Enum disimpan sebagai kode, label dipetakan di frontend.
- Wajib unit test (model/validasi) dan integration test (endpoint + DB, RefreshDatabase).

## Aturan Frontend
- Data fetching dengan TanStack Query (client components).
- Komponen JobCard reusable dengan prop variant "public" | "dashboard".
- Tailwind, tampilan mengikuti Figma. Search dengan debounce.
- Deskripsi HTML wajib disanitasi (DOMPurify).
- Rute: / , /jobs/[id] , /dashboard , /dashboard/create

## Umum
- Satu fitur per langkah, commit jelas per fitur. Jangan commit .env.