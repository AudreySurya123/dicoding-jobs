"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOptionalCurrentUser, logoutRecruiter } from "@/lib/api";

export function JobsNavbar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getOptionalCurrentUser,
    retry: false,
    staleTime: 60_000,
  });
  const logoutMutation = useMutation({
    mutationFn: logoutRecruiter,
    onSuccess: async () => {
      queryClient.setQueryData(["auth", "user"], null);
      await queryClient.invalidateQueries({ queryKey: ["vacancies", "list"] });
      router.replace("/");
    },
  });
  const unauthenticated = userQuery.data === null;

  return (
    <header className="h-[68px] border-b border-[#e8e8e8] bg-white">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-full max-w-[1120px] items-center gap-8 px-5"
      >
        <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[#304153] text-sm font-semibold text-white">
            9
          </span>
          <span>Jobs</span>
        </Link>
        <Link href="/#lowongan-terbaru" className="text-xs text-[#343a40] hover:text-[#2563eb]">
          Lowongan Kerja
        </Link>
        <Link href="/dashboard" className="text-xs text-[#343a40] hover:text-[#2563eb]">
          Dashboard
        </Link>
        <div className="ml-auto flex items-center gap-3">
          {userQuery.data ? (
            <>
              <span className="hidden text-xs text-[#69717d] sm:inline">{userQuery.data.name}</span>
              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="text-xs text-[#343a40] hover:text-[#2563eb] disabled:opacity-60"
              >
                {logoutMutation.isPending ? "Keluar..." : "Keluar"}
              </button>
            </>
          ) : unauthenticated ? (
            <Link href="/login" className="text-xs text-[#343a40] hover:text-[#2563eb]">
              Masuk
            </Link>
          ) : null}
        </div>
        {logoutMutation.isError && (
          <span role="alert" className="text-xs text-[#c92a3a]">
            Gagal keluar: {logoutMutation.error.message}
          </span>
        )}
      </nav>
    </header>
  );
}
