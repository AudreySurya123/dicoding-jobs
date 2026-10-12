# Dicoding Jobs

A job vacancy directory with a public vacancy list, title search, and detail pages, plus a recruiter dashboard to create, update, and delete vacancies.

## Tech stack

- **Backend:** PHP 8.2+, Laravel 12, Laravel Sanctum 4 (stateful SPA sessions)
- **Frontend:** Node.js/npm, Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- **Data fetching and forms:** TanStack Query 5, Tiptap 3, DOMPurify
- **Database:** MySQL (`dicoding_jobs`)
- **Testing:** PHPUnit (unit and feature/integration), Playwright (Chromium E2E)

## Prerequisites

- PHP 8.2 or newer with the PHP extensions required by Laravel, Composer, and MySQL.
- MySQL server, with permission to create/use the `dicoding_jobs` database.
- Node.js and npm.
- Playwright Chromium (one-time browser installation described below).

The commands in this guide use **PowerShell from the repository root** (`D:\dicoding`). For a clean checkout, install dependencies, copy the example environment files, and create an application key:

```powershell
composer install --working-dir=backend
if (-not (Test-Path backend\.env)) { Copy-Item backend\.env.example backend\.env }
if (-not (Select-String -Path backend\.env -Pattern '^APP_KEY=base64:.+' -Quiet)) { Set-Location backend; php artisan key:generate; Set-Location .. }
npm ci --prefix frontend
if (-not (Test-Path frontend\.env.local)) { Copy-Item frontend\.env.example frontend\.env.local }
```

Create the database if it does not already exist:

```sql
CREATE DATABASE IF NOT EXISTS dicoding_jobs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Edit `backend/.env` and set the MySQL credentials for `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`. For local Sanctum SPA authentication, keep the web app and API on the `localhost` hostname and configure:

```dotenv
SESSION_DRIVER=database
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `frontend/.env.local`.

## Backend setup and run

From the repository root, apply migrations and seed local recruiter credentials and sample vacancies:

```powershell
Set-Location backend
php artisan migrate
php artisan db:seed
php artisan db:seed --class=VacancySeeder
```

The default local/testing seeder creates the recruiter `test@example.com` with password `password`. This development credential must not be used in a deployed environment.

Start the API on port 8000 (leave it running in its own terminal):

```powershell
Set-Location backend
php artisan serve --host=localhost --port=8000
```

## Frontend setup and run

Install dependencies once with `npm ci --prefix frontend` as shown above. Start Next.js on port 3000 (leave it running in its own terminal):

```powershell
Set-Location frontend
npm run dev
```

Open <http://localhost:3000>. Public routes are `/` and `/jobs/{id}`; recruiter routes are `/login`, `/dashboard`, `/dashboard/create`, and `/dashboard/edit/{id}`.

## Tests

### Backend unit tests

These tests use the in-memory SQLite database configured in `backend/phpunit.xml`:

```powershell
Set-Location backend
php artisan test --testsuite=Unit
```

### Backend integration/feature tests

These tests also use in-memory SQLite and `RefreshDatabase`; the local MySQL database and seed data are not required:

```powershell
Set-Location backend
php artisan test --testsuite=Feature
```

Run the complete backend test suite (unit and feature/integration):

```powershell
Set-Location backend
php artisan test
```

### Frontend end-to-end tests

E2E tests use the **real backend and MySQL database**, so start MySQL, complete backend setup/migrations/seeding above, and keep the API running at `http://localhost:8000`. Install the Chromium browser once, then run Playwright:

```powershell
Set-Location frontend
npx playwright install chromium
npm run test:e2e
```

The Playwright configuration starts the Next.js development server automatically at `http://localhost:3000`. The E2E suite covers the public vacancy list, title search, vacancy details, and recruiter login/logout. The seeded development account is used by the authentication scenario.

## API endpoints

All endpoints are prefixed by `http://localhost:8000`. JSON API routes live in `backend/routes/api.php`.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/vacancies?search={title}&page={number}` | Public | Paginated vacancies; optional title search |
| GET | `/api/vacancies/{id}` | Public | Vacancy details |
| POST | `/api/login` | Public, rate-limited | Start a recruiter session |
| GET | `/api/user` | Recruiter session | Return the authenticated recruiter |
| POST | `/api/logout` | Recruiter session | End the recruiter session |
| POST | `/api/vacancies` | Recruiter session | Create a vacancy |
| PATCH | `/api/vacancies/{id}` | Recruiter session | Update a vacancy |
| DELETE | `/api/vacancies/{id}` | Recruiter session | Delete a vacancy |
| GET | `/sanctum/csrf-cookie` | Browser session setup | Initialize the Sanctum CSRF cookie before state-changing requests |

Sanctum uses stateful session cookies and CSRF protection for browser/API write requests. Vacancy list and detail endpoints remain publicly accessible.

## Project structure

```text
backend/
  app/Http/Controllers/Api/  API controllers
  app/Http/Requests/        Request validation
  app/Http/Resources/       JSON resource representations
  app/Models/               Eloquent models
  config/                   Laravel, CORS, and Sanctum configuration
  database/factories/       Model factories
  database/migrations/      Database schema
  database/seeders/         Local recruiter and sample vacancies
  routes/api.php            API route definitions
  tests/Unit/               Model/query and validation tests
  tests/Feature/            API/database feature tests
frontend/
  app/                      Next.js App Router pages and providers
  components/jobs/          Vacancy, recruiter dashboard, and login UI
  e2e/                      Playwright end-to-end scenarios
  lib/                      API client, formatters, and HTML sanitization
  types/                    Shared TypeScript API types
  playwright.config.ts      Playwright browser/server configuration
docs/design/                UI design references
```

## Decisions & assumptions

- **No authentication:** The original exercise scope assumes no authentication and direct recruiter-dashboard access. The current implementation has since added Sanctum recruiter login as a follow-up. Vacancy list/detail remain public; recruiter operations require a session.
- **No application feature:** The original scope excludes applying to a job. There is no application form, `applications` table, or application endpoint.
- **Next development:** Implement applications end-to-end (form, storage, endpoints, tests), add `user_id` to vacancies and scope recruiter list/update/delete operations to their owner, and strengthen account provisioning/authorization. Sanctum session login already exists; this follow-up should build on it rather than add a second authentication mechanism.
