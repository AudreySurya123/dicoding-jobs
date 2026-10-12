import { Suspense } from "react";
import { EditVacancyPage } from "@/components/jobs/EditVacancyPage";
import { RecruiterAuthGate } from "@/components/jobs/RecruiterAuthGate";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

async function EditVacancyRoute({ params }: EditPageProps) {
  const { id } = await params;
  return <EditVacancyPage id={id} />;
}

function EditVacancyFallback() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="h-[68px] border-b border-[#e8e8e8] bg-white" />
      <div className="mx-auto max-w-[920px] animate-pulse px-5 pt-8">
        <div className="h-7 w-48 rounded bg-[#eceef0]" />
        <div className="mx-auto mt-7 h-[600px] max-w-[600px] rounded border border-[#e5e7eb] bg-white" />
      </div>
    </main>
  );
}

export default function Page({ params }: EditPageProps) {
  return (
    <Suspense fallback={<EditVacancyFallback />}>
      <RecruiterAuthGate>
        <EditVacancyRoute params={params} />
      </RecruiterAuthGate>
    </Suspense>
  );
}
