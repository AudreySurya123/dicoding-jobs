"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";
import { JobsNavbar } from "@/components/jobs/JobsNavbar";
import { ApiError, getVacancy } from "@/lib/api";
import {
  formatIndonesianDate,
  getEmploymentTypeLabel,
  getMinExperienceLabel,
} from "@/lib/vacancy-formatters";
import { sanitizeHtml } from "@/lib/sanitize-html";

function CompanyMark() {
  return (
    <div
      aria-label="Dicoding"
      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-sm bg-[#304153] text-[13px] font-semibold tracking-tight text-white"
    >
      dicoding
      <span className="ml-0.5 flex h-3 w-3 items-center justify-center border border-white text-[9px] leading-none">
        9
      </span>
    </div>
  );
}

function VacancySkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <JobsNavbar />
      <div className="mx-auto max-w-[960px] animate-pulse px-5 py-10">
        <div className="h-7 w-1/3 rounded bg-[#eceef0]" />
        <div className="mt-4 h-5 w-1/4 rounded bg-[#eceef0]" />
        <div className="mt-10 h-64 rounded border border-[#e5e7eb] bg-[#fafafa]" />
      </div>
    </main>
  );
}

function DetailFooter() {
  return (
    <footer className="mx-auto mt-14 max-w-[960px] border-t border-[#e5e7eb] px-5 py-8">
      <p className="text-xl font-semibold tracking-tight text-[#304153]">dicoding</p>
      <p className="mt-2 max-w-sm text-xs leading-5 text-[#777e87]">
        Dicoding Space
        <br />
        Jl. Batik Kumeli No.50, Sukaluyu,
        <br />
        Kec. Cibeunying Kaler, Kota Bandung, Jawa Barat 40123
      </p>
    </footer>
  );
}

export function JobDetailPage({ id }: { id: string }) {
  const vacancyQuery = useQuery({
    queryKey: ["vacancies", "detail", id],
    queryFn: () => getVacancy(id),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status === 404 ? false : failureCount < 2,
  });
  const sanitizedDescription = useMemo(
    () => sanitizeHtml(vacancyQuery.data?.description ?? ""),
    [vacancyQuery.data?.description],
  );

  if (vacancyQuery.isPending) {
    return <VacancySkeleton />;
  }

  if (vacancyQuery.isError) {
    const isNotFound = vacancyQuery.error instanceof ApiError && vacancyQuery.error.status === 404;

    return (
      <main className="min-h-screen bg-white text-[#292d32]">
        <JobsNavbar />
        <section className="mx-auto flex min-h-[420px] max-w-[960px] flex-col items-center justify-center px-5 text-center">
          <h1 className="text-xl font-semibold">
            {isNotFound ? "Lowongan tidak ditemukan" : "Lowongan gagal dimuat"}
          </h1>
          <p role="alert" className="mt-2 max-w-md text-sm text-[#69717d]">
            {isNotFound
              ? "Lowongan ini mungkin sudah dihapus atau alamatnya tidak valid."
              : "Terjadi kendala saat mengambil detail lowongan. Periksa koneksi lalu coba lagi."}
          </p>
          {!isNotFound && (
            <button
              type="button"
              onClick={() => void vacancyQuery.refetch()}
              className="mt-5 rounded bg-[#304153] px-4 py-2 text-sm font-medium text-white hover:bg-[#243343]"
            >
              Coba lagi
            </button>
          )}
          <Link href="/" className="mt-5 text-sm font-medium text-[#2563eb] hover:underline">
            Kembali ke daftar lowongan
          </Link>
        </section>
        <DetailFooter />
      </main>
    );
  }

  const vacancy = vacancyQuery.data;

  return (
    <main className="min-h-screen bg-white text-[#292d32]">
      <JobsNavbar />
      <article className="mx-auto max-w-[960px] px-5 pb-10 pt-8">
        <header className="border-b border-[#e5e7eb] pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <CompanyMark />
            <div className="min-w-0">
              <p className="text-sm text-[#69717d]">{vacancy.company_name}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#292d32] sm:text-[28px]">
                {vacancy.title}
              </h1>
              <p className="mt-1 text-sm text-[#535a64]">{vacancy.position}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-[#8ebdff] bg-[#f3f8ff] px-3 py-1 text-[#2874d0]">
              {getEmploymentTypeLabel(vacancy.employment_type)}
            </span>
            <span className="rounded-full border border-[#e0e2e5] px-3 py-1 text-[#535a64]">
              {vacancy.is_remote ? "Remote" : vacancy.location}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2 text-xs text-[#60646c]">
            <span>Dibuat pada {formatIndonesianDate(vacancy.created_at)}</span>
            <span>Lamar sebelum {formatIndonesianDate(vacancy.active_until)}</span>
          </div>
        </header>

        <section className="py-7">
          <h2 className="mb-3 text-lg font-semibold">Job Description</h2>
          <div
            className="vacancy-description text-sm leading-[1.55] text-[#343a40]"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </section>

        <section aria-labelledby="additional-information-heading" className="pt-2">
          <h2 id="additional-information-heading" className="mb-4 text-lg font-semibold">
            Informasi Tambahan
          </h2>
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold">Pengalaman bekerja</dt>
              <dd className="mt-1 text-sm text-[#343a40]">
                {getMinExperienceLabel(vacancy.min_experience)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">Kandidat yang dibutuhkan</dt>
              <dd className="mt-1 text-sm text-[#343a40]">
                {vacancy.candidates_needed} kandidat
              </dd>
            </div>
            {vacancy.show_salary && (vacancy.salary_min !== null || vacancy.salary_max !== null) && (
              <div>
                <dt className="text-sm font-semibold">Rentang gaji per bulan</dt>
                <dd className="mt-1 text-sm text-[#343a40]">
                  {vacancy.salary_min?.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }) ?? "Tidak ditentukan"}
                  {" - "}
                  {vacancy.salary_max?.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }) ?? "Tidak ditentukan"}
                </dd>
              </div>
            )}
          </dl>
        </section>
      </article>
      <DetailFooter />
    </main>
  );
}
