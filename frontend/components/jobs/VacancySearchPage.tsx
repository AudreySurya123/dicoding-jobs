"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import { JobsNavbar } from "@/components/jobs/JobsNavbar";
import { ApiError, getVacancies } from "@/lib/api";

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4 shrink-0 text-[#69717d]"
    >
      <circle cx="8.75" cy="8.75" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HeroArtwork() {
  return (
    <div
      aria-hidden="true"
      className="relative hidden h-12 w-32 shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-[#b9e1ed] via-[#789caf] to-[#283c50] sm:block"
    >
      <div className="absolute -right-2 -top-5 h-20 w-16 rounded-full bg-[#263746]" />
      <div className="absolute right-8 top-1 h-7 w-7 rounded-full bg-[#d69b77]" />
      <div className="absolute -bottom-5 right-4 h-10 w-14 rounded-t-full bg-[#192633]" />
      <div className="absolute inset-y-0 left-0 w-8 bg-white/15" />
    </div>
  );
}

function getErrorMessage(error: Error): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return "Server sedang bermasalah. Coba lagi beberapa saat.";
    }

    return `Lowongan gagal dimuat (${error.status}). Periksa koneksi lalu coba lagi.`;
  }

  return error.message.includes("NEXT_PUBLIC_API_URL")
    ? "Alamat API belum dikonfigurasi. Atur NEXT_PUBLIC_API_URL lalu muat ulang halaman."
    : "Lowongan gagal dimuat. Periksa koneksi lalu coba lagi.";
}

function VacancySearch({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(value);

  useEffect(() => {
    const normalizedSearch = searchInput.trim();
    if (normalizedSearch === value) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      if (normalizedSearch) {
        nextSearchParams.set("search", normalizedSearch);
      } else {
        nextSearchParams.delete("search");
      }

      const queryString = nextSearchParams.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, router, searchInput, searchParams, value]);

  return (
    <label className="flex h-10 w-full items-center gap-2.5 rounded border border-[#e0e2e5] bg-white px-3 sm:max-w-[360px]">
      <SearchIcon />
      <span className="sr-only">Cari lowongan berdasarkan judul</span>
      <input
        type="search"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Pekerjaan apa yang sedang kamu cari?"
        className="h-full min-w-0 flex-1 bg-transparent text-xs text-[#292d32] outline-none placeholder:text-[#8a8f98]"
      />
    </label>
  );
}

export function VacancySearchPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";

  const vacanciesQuery = useQuery({
    queryKey: ["vacancies", "list", urlSearch],
    queryFn: () => getVacancies(urlSearch || undefined),
  });

  return (
    <main className="min-h-screen bg-white text-[#292d32]">
      <JobsNavbar />

      <section className="bg-[#19191b] text-white">
        <div className="mx-auto flex min-h-[174px] max-w-[1120px] flex-col justify-center px-5 py-8">
          <p className="mb-3 text-sm font-semibold text-[#1687ff]">Dicoding Jobs</p>
          <div className="flex items-center gap-4">
            <h1 className="max-w-[390px] text-[26px] font-semibold leading-[1.45] tracking-[-0.03em] sm:text-[28px]">
              Temukan lowongan yang
              <br className="hidden sm:block" /> cocok untuk kamu
            </h1>
            <HeroArtwork />
          </div>
        </div>
      </section>

      <section
        id="lowongan-terbaru"
        aria-labelledby="latest-jobs-heading"
        className="mx-auto min-h-[470px] max-w-[960px] px-5 pb-24 pt-7"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="latest-jobs-heading" className="text-base font-semibold">
            Daftar Pekerjaan Terbaru
          </h2>
          <VacancySearch key={urlSearch} value={urlSearch} />
        </div>

        {vacanciesQuery.isPending ? (
          <div aria-label="Memuat lowongan" aria-busy="true" className="flex flex-col gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[112px] animate-pulse rounded-md border border-[#e1e3e6] bg-white"
              />
            ))}
          </div>
        ) : vacanciesQuery.isError ? (
          <div
            role="alert"
            className="rounded-md border border-[#f2c6cc] bg-[#fff7f8] px-5 py-6 text-sm text-[#842536]"
          >
            <p>{getErrorMessage(vacanciesQuery.error)}</p>
            <button
              type="button"
              onClick={() => void vacanciesQuery.refetch()}
              className="mt-3 rounded bg-[#304153] px-4 py-2 text-xs font-medium text-white hover:bg-[#243343]"
            >
              Coba lagi
            </button>
          </div>
        ) : vacanciesQuery.data?.data.length ? (
          <div className="flex flex-col gap-3">
            {vacanciesQuery.data.data.map((vacancy) => (
              <JobCard key={vacancy.id} vacancy={vacancy} variant="public" />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-[#d8dce1] px-5 py-12 text-center">
            <h3 className="text-sm font-semibold text-[#343a40]">
              {urlSearch ? "Lowongan tidak ditemukan" : "Belum ada lowongan"}
            </h3>
            <p className="mt-2 text-xs text-[#69717d]">
              {urlSearch
                ? `Belum ada lowongan dengan judul “${urlSearch}”. Coba kata kunci lain.`
                : "Lowongan terbaru akan tampil di sini."}
            </p>
          </div>
        )}
      </section>

      <footer className="mx-auto max-w-[960px] border-t border-[#e5e7eb] px-5 py-8">
        <p className="text-xl font-semibold tracking-tight text-[#304153]">dicoding</p>
        <p className="mt-2 max-w-sm text-xs leading-5 text-[#777e87]">
          Dicoding Space
          <br />
          Jl. Batik Kumeli No.50, Sukaluyu,
          <br />
          Kec. Cibeunying Kaler, Kota Bandung, Jawa Barat 40123
        </p>
      </footer>
    </main>
  );
}
