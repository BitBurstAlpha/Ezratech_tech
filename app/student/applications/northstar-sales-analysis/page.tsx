import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { AccessGate } from "@/components/student/progress/access-gate";
import { ApplicationStatus } from "@/components/student/applications/application-status";
export const metadata: Metadata = { title: "Application Status | EzraTech", description: "Follow the simulated SME review of Alex Morgan's interest in the Northstar project." };
export default function NorthstarApplicationPage() {
  return <DashboardShell activePath="/student/projects" title="Application Status" subtitle="Follow your application through SME review and mutual confirmation."><AccessGate kind="projects"><ApplicationStatus /></AccessGate></DashboardShell>;
}
