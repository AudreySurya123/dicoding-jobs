import { Suspense } from "react";
import { VacancySearchPage } from "@/components/jobs/VacancySearchPage";

function HomeFallback() {
  return (
    <main className="min-h-screen bg-white">
      <div className="h-[68px] border-b border-[#e8e8e8]" />
      <div className="h-[174px] animate-pulse bg-[#19191b]" />
      <section className="mx-auto mt-8 max-w-[960px] px-5">
        <div className="h-10 animate-pulse rounded bg-[#f1f2f3]" />
        <div className="mt-4 flex flex-col gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[112px] animate-pulse rounded-md border border-[#e1e3e6] bg-white"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <VacancySearchPage />
    </Suspense>
  );
}
