import { DashboardPage } from "@/components/jobs/DashboardPage";
import { RecruiterAuthGate } from "@/components/jobs/RecruiterAuthGate";

export default function Page() {
  return (
    <RecruiterAuthGate>
      <DashboardPage />
    </RecruiterAuthGate>
  );
}
