"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import { JobsNavbar } from "@/components/jobs/JobsNavbar";
import { ApiError, deleteVacancy, getVacanciesPage } from "@/lib/api";
import type { Vacancy } from "@/types/vacancy";

function getLoadErrorMessage(error: Error): string {
  if (error instanceof ApiError && error.status >= 500) {
    return "Server sedang bermasalah. Coba lagi beberapa saat.";
  }

  return "Daftar lowongan gagal dimuat. Periksa koneksi lalu coba lagi.";
}

export function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const vacanciesQuery = useQuery({
    queryKey: ["vacancies", "list", "dashboard", page],
    queryFn: () => getVacanciesPage(page),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteVacancy,
    onSuccess: async () => {
      setDeleteError(null);
      const pageData = queryClient.getQueryData<Awaited<ReturnType<typeof getVacanciesPage>>>([
        "vacancies",
        "list",
        "dashboard",
        page,
      ]);
      if (page > 1 && pageData?.data.length === 1) {
        setPage(page - 1);
      }
      await queryClient.invalidateQueries({ queryKey: ["vacancies", "list"] });
    },
    onError: (error) => {
      setDeleteError(
        error instanceof Error
          ? `Lowongan gagal dihapus: ${error.message}`
          : "Lowongan gagal dihapus. Silakan coba lagi.",
      );
    },
  });

  function handleDelete(vacancy: Vacancy): void {
    const confirmed = window.confirm(
      `Hapus lowongan "${vacancy.title}"? Tindakan ini tidak dapat dibatalkan.`,
    );
    if (!confirmed) {
      return;
    }

    setDeleteError(null);
    deleteMutation.mutate(vacancy.id);
  }

  return (
    <main className="min-h-screen bg-white text-[#292d32]">
      <JobsNavbar />
      <section className="mx-auto min-h-[470px] max-w-[960px] px-5 pb-24 pt-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-[#69717d]">Dashboard recruiter</p>
            <h1 className="mt-1 text-xl font-semibold">Lowongan Saya</h1>
            {vacanciesQuery.data && (
              <p className="mt-1 text-xs text-[#69717d]">
                {vacanciesQuery.data.meta.total} lowongan
              </p>
            )}
          </div>
          <Link
            href="/dashboard/create"
            className="inline-flex h-10 items-center justify-center rounded-sm bg-[#304153] px-4 text-sm font-medium text-white transition-colors hover:bg-[#243343]"
          >
            + Buat Lowongan
          </Link>
        </div>

        {deleteError && (
          <p
            role="alert"
            className="mb-4 rounded border border-[#f2c6cc] bg-[#fff7f8] px-4 py-3 text-sm text-[#842536]"
          >
            {deleteError}
          </p>
        )}

        {vacanciesQuery.isPending ? (
          <div aria-label="Memuat lowongan" aria-busy="true" className="flex flex-col gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-md border border-[#dee0e3] bg-white"
              />
            ))}
          </div>
        ) : vacanciesQuery.isError ? (
          <div
            role="alert"
            className="rounded-md border border-[#f2c6cc] bg-[#fff7f8] px-5 py-6 text-sm text-[#842536]"
          >
            <p>{getLoadErrorMessage(vacanciesQuery.error)}</p>
            <button
              type="button"
              onClick={() => void vacanciesQuery.refetch()}
              className="mt-3 rounded bg-[#304153] px-4 py-2 text-xs font-medium text-white hover:bg-[#243343]"
            >
              Coba lagi
            </button>
          </div>
        ) : vacanciesQuery.data.data.length ? (
          <>
            <div className="flex flex-col gap-3">
              {vacanciesQuery.data.data.map((vacancy) => (
                <JobCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  variant="dashboard"
                  onEdit={(selectedVacancy) =>
                    router.push(`/dashboard/edit/${selectedVacancy.id}`)
                  }
                  onDelete={handleDelete}
                  actionsDisabled={deleteMutation.isPending}
                />
              ))}
            </div>
            {vacanciesQuery.data.meta.last_page > 1 && (
              <nav aria-label="Navigasi halaman lowongan" className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded border border-[#dee0e3] px-3 py-2 text-xs text-[#4a4e55] hover:bg-[#f6f7f8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="self-center px-2 text-xs text-[#60646c]">
                  Halaman {vacanciesQuery.data.meta.current_page} dari {vacanciesQuery.data.meta.last_page}
                </span>
                <button
                  type="button"
                  disabled={page >= vacanciesQuery.data.meta.last_page}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded border border-[#dee0e3] px-3 py-2 text-xs text-[#4a4e55] hover:bg-[#f6f7f8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Berikutnya
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="rounded-md border border-dashed border-[#d8dce1] px-5 py-12 text-center">
            <h2 className="text-sm font-semibold text-[#343a40]">Belum ada lowongan</h2>
            <p className="mt-2 text-xs text-[#69717d]">
              Lowongan yang kamu buat akan tampil di sini.
            </p>
            <Link
              href="/dashboard/create"
              className="mt-4 inline-flex rounded-sm bg-[#304153] px-4 py-2 text-xs font-medium text-white hover:bg-[#243343]"
            >
              Buat lowongan pertama
            </Link>
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
