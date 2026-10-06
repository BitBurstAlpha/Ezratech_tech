import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { AssessmentFlow } from "@/components/student/assessment/assessment-flow";
export const metadata: Metadata = { title: "Skills Assessment | EzraTech", description: "Explore your practical capabilities through EzraTech's simulated student skills assessment." };
export default function StudentAssessmentPage() {
  return <DashboardShell activePath="/student/assessment" title="Skills Assessment" subtitle="Understand your strengths and discover where to develop next."><AssessmentFlow /></DashboardShell>;
}
