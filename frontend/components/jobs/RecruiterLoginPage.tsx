"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { JobsNavbar } from "@/components/jobs/JobsNavbar";
import { ApiError, loginRecruiter } from "@/lib/api";

export function RecruiterLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loginMutation = useMutation({
    mutationFn: loginRecruiter,
    onSuccess: async (user) => {
      queryClient.setQueryData(["auth", "user"], user);
      await queryClient.invalidateQueries({ queryKey: ["vacancies", "list"] });
      router.replace("/dashboard");
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof ApiError && error.status === 422
          ? error.validationErrors?.email?.[0] ?? "Email atau password tidak sesuai."
          : error instanceof Error
            ? `Login gagal: ${error.message}`
            : "Login gagal. Silakan coba lagi.",
      );
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setErrorMessage(null);
    loginMutation.mutate({ email: email.trim(), password });
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#292d32]">
      <JobsNavbar />
      <section className="mx-auto flex min-h-[calc(100vh-68px)] max-w-[920px] items-start justify-center px-5 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[420px] rounded-md border border-[#e6e8eb] bg-white p-6 shadow-sm sm:p-8"
        >
          <p className="text-xs font-medium text-[#69717d]">Dashboard recruiter</p>
          <h1 className="mt-1 text-2xl font-semibold">Masuk</h1>
          <p className="mt-2 text-sm text-[#69717d]">Masuk untuk mengelola lowongan pekerjaan.</p>

          <label htmlFor="email" className="mt-6 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 block h-10 w-full rounded border border-[#dfe2e6] px-3 text-sm outline-none focus:border-[#3979b8] focus:ring-2 focus:ring-[#3979b8]/15"
          />

          <label htmlFor="password" className="mt-4 block text-sm font-medium">
            Kata sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 block h-10 w-full rounded border border-[#dfe2e6] px-3 text-sm outline-none focus:border-[#3979b8] focus:ring-2 focus:ring-[#3979b8]/15"
          />

          {errorMessage && (
            <p role="alert" className="mt-4 rounded border border-[#f2c6cc] bg-[#fff7f8] px-3 py-2 text-sm text-[#842536]">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-sm bg-[#304153] px-4 text-sm font-medium text-white transition-colors hover:bg-[#243343] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </section>
    </main>
  );
}
