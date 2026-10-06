import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { ReassessmentFlow } from "@/components/student/assessment/development/reassessment-flow";
export const metadata: Metadata = { title: "Skills Reassessment | EzraTech" };
export default function ReassessmentPage() { return <DashboardShell activePath="/student/assessment" title="Skills Reassessment" subtitle="Complete a short follow-up assessment focused on the areas identified during your previous review."><ReassessmentFlow /></DashboardShell>; }
