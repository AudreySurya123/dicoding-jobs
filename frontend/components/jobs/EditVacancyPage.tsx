"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CreateVacancyForm } from "@/components/jobs/CreateVacancyForm";
import { JobsNavbar } from "@/components/jobs/JobsNavbar";
import { ApiError, getVacancy } from "@/lib/api";

export function EditVacancyPage({ id }: { id: string }) {
  const vacancyQuery = useQuery({
    queryKey: ["vacancies", "detail", id],
    queryFn: () => getVacancy(id),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status === 404 ? false : failureCount < 2,
  });

  if (vacancyQuery.isPending) {
    return (
      <main className="min-h-screen bg-[#fafafa]">
        <JobsNavbar />
        <div aria-label="Memuat lowongan" aria-busy="true" className="mx-auto max-w-[920px] px-5 pt-8">
          <div className="h-7 w-48 animate-pulse rounded bg-[#eceef0]" />
          <div className="mx-auto mt-7 h-[600px] max-w-[600px] animate-pulse rounded border border-[#e5e7eb] bg-white" />
        </div>
      </main>
    );
  }

  if (vacancyQuery.isError) {
    const notFound = vacancyQuery.error instanceof ApiError && vacancyQuery.error.status === 404;

    return (
      <main className="min-h-screen bg-[#fafafa] text-[#292d32]">
        <JobsNavbar />
        <section className="mx-auto flex min-h-[420px] max-w-[920px] flex-col items-center justify-center px-5 text-center">
          <h1 className="text-xl font-semibold">
            {notFound ? "Lowongan tidak ditemukan" : "Lowongan gagal dimuat"}
          </h1>
          <p role="alert" className="mt-2 max-w-md text-sm text-[#69717d]">
            {notFound
              ? "Lowongan ini mungkin sudah dihapus atau alamatnya tidak valid."
              : "Terjadi kendala saat mengambil lowongan. Periksa koneksi lalu coba lagi."}
          </p>
          {!notFound && (
            <button
              type="button"
              onClick={() => void vacancyQuery.refetch()}
              className="mt-5 rounded bg-[#304153] px-4 py-2 text-sm font-medium text-white hover:bg-[#243343]"
            >
              Coba lagi
            </button>
          )}
          <Link href="/dashboard" className="mt-5 text-sm font-medium text-[#2563eb] hover:underline">
            Kembali ke Lowongan Saya
          </Link>
        </section>
      </main>
    );
  }

  return <CreateVacancyForm vacancy={vacancyQuery.data} />;
}
