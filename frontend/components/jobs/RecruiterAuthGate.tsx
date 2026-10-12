"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ApiError, getOptionalCurrentUser } from "@/lib/api";

export function RecruiterAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const userQuery = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getOptionalCurrentUser,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status === 401 ? false : failureCount < 2,
  });
  const unauthenticated = userQuery.data === null;

  useEffect(() => {
    if (unauthenticated) {
      router.replace("/login");
    }
  }, [router, unauthenticated]);

  if (userQuery.isPending || unauthenticated) {
    return (
      <main
        aria-label="Memeriksa sesi recruiter"
        aria-busy="true"
        className="min-h-screen bg-[#fafafa]"
      >
        <div className="h-[68px] border-b border-[#e8e8e8] bg-white" />
        <div className="mx-auto max-w-[920px] animate-pulse px-5 pt-8">
          <div className="h-7 w-48 rounded bg-[#eceef0]" />
          <div className="mt-7 h-80 rounded border border-[#e5e7eb] bg-white" />
        </div>
      </main>
    );
  }

  if (userQuery.isError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-5 text-center">
        <h1 className="text-xl font-semibold text-[#292d32]">Sesi recruiter gagal diperiksa</h1>
        <p role="alert" className="mt-2 max-w-md text-sm text-[#69717d]">
          {userQuery.error.message}
        </p>
        <button
          type="button"
          onClick={() => void userQuery.refetch()}
          className="mt-5 rounded bg-[#304153] px-4 py-2 text-sm font-medium text-white hover:bg-[#243343]"
        >
          Coba lagi
        </button>
      </main>
    );
  }

  return children;
}
