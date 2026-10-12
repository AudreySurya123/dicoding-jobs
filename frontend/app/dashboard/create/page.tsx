import { CreateVacancyForm } from "@/components/jobs/CreateVacancyForm";
import { RecruiterAuthGate } from "@/components/jobs/RecruiterAuthGate";

export default function Page() {
  return (
    <RecruiterAuthGate>
      <CreateVacancyForm />
    </RecruiterAuthGate>
  );
}
