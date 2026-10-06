import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { DevelopmentResult } from "@/components/student/assessment/development/development-result";
export const metadata: Metadata = { title: "Assessment Review Complete | EzraTech" };
export default function AssessmentResultPage() { return <DashboardShell activePath="/student/assessment" title="Assessment Review Complete" subtitle="Understand your strengths and the support recommended before project readiness."><DevelopmentResult /></DashboardShell>; }
