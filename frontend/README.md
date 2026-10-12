This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## End-to-end tests

The Playwright E2E tests use the real Laravel API and MySQL database. Before running them:

1. Configure `backend/.env` to connect to MySQL database `dicoding_jobs`.
2. From `backend/`, run migrations and seed the local recruiter account plus sample vacancies:

   ```bash
   php artisan migrate
   php artisan db:seed
   php artisan db:seed --class=VacancySeeder
   ```

3. Keep the API running at `http://localhost:8000`:

   ```bash
   php artisan serve --host=localhost --port=8000
   ```

4. In `frontend/`, install the Chromium browser once:

   ```bash
   npx playwright install chromium
   ```

5. Run the E2E suite from `frontend/`:

   ```bash
   npm run test:e2e
   ```

Playwright starts the Next.js development server automatically at `http://localhost:3000`. The `VacancySeeder` is safe to rerun and ensures the sample `Product Engineer` and `Android Developer` vacancies required by the tests exist.

## Recruiter login

Recruiter login uses Laravel Sanctum's stateful SPA session cookies. Keep the frontend and API on the `localhost` hostname, configure `SANCTUM_STATEFUL_DOMAINS=localhost:3000` in `backend/.env`, and allow the frontend origin in CORS. The frontend initializes the Sanctum CSRF cookie before login and other write requests.

The local/testing database seeder creates `test@example.com` with password `password`; this is for local development only and must not be used in a deployed environment. Production accounts must be provisioned with unique credentials.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
