import { expect, test } from "@playwright/test";

test("menampilkan card lowongan di halaman daftar", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Daftar Pekerjaan Terbaru" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Product Engineer" })).toBeVisible();
});

test("mencari lowongan berdasarkan judul dan memfilter hasil", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: "Cari lowongan berdasarkan judul" }).fill("Product Engineer");

  await expect(page).toHaveURL(/search=Product(?:\+|%20)Engineer/);
  await expect(page.getByRole("link", { name: "Product Engineer" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Android Developer" })).toHaveCount(0);
});

test("membuka detail lowongan dari card", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Product Engineer" }).click();

  await expect(page).toHaveURL(/\/jobs\/\d+$/);
  await expect(page.getByRole("heading", { level: 1, name: "Product Engineer" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Job Description" })).toBeVisible();
});

test("recruiter dapat login dengan sesi Sanctum dan logout", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Kata sandi").fill("password");
  await page.getByRole("button", { name: "Masuk" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Lowongan Saya" })).toBeVisible();
  await page.getByRole("button", { name: "Keluar" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: "Masuk" })).toBeVisible();
});
