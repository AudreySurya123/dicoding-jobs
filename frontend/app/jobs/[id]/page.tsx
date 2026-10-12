import { Suspense } from "react";
import { JobDetailPage } from "@/components/jobs/JobDetailPage";

interface JobPageProps {
  params: Promise<{ id: string }>;
}

async function JobDetailRoute({ params }: JobPageProps) {
  const { id } = await params;

  return <JobDetailPage id={id} />;
}

function JobDetailFallback() {
  return (
    <main className="min-h-screen bg-white">
      <div className="h-[68px] border-b border-[#e8e8e8]" />
      <div className="mx-auto max-w-[960px] animate-pulse px-5 py-10">
        <div className="h-7 w-1/3 rounded bg-[#eceef0]" />
        <div className="mt-4 h-5 w-1/4 rounded bg-[#eceef0]" />
        <div className="mt-10 h-64 rounded border border-[#e5e7eb] bg-[#fafafa]" />
      </div>
    </main>
  );
}

export default function Page({ params }: JobPageProps) {
  return (
    <Suspense fallback={<JobDetailFallback />}>
      <JobDetailRoute params={params} />
    </Suspense>
  );
}
