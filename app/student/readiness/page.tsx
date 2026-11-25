import { AccessGate } from "@/components/student/progress/access-gate";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { ReadinessForm } from "@/components/student/readiness/readiness-form";
export const metadata: Metadata = { title: "Project Readiness Check | EzraTech", description: "Confirm your availability and preferences before exploring suitable SME project opportunities." };
export default async function StudentReadinessPage({ searchParams }: PageProps<"/student/readiness">) {
  const { marketplace } = await searchParams;
  return <DashboardShell activePath="/student/readiness" title="Project Readiness Check" subtitle="Before we recommend SME projects, we need to confirm that your profile, skills evidence and availability are ready for project matching.">{marketplace === "pending" && <p role="status" className="mb-4">Project Marketplace is locked until your assessment evidence and readiness checks are complete.</p>}<AccessGate kind="readiness"><ReadinessForm /></AccessGate></DashboardShell>;
}
