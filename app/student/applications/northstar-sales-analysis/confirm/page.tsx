import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { PreStartFlow } from "@/components/student/applications/pre-start/pre-start-flow";
export const metadata: Metadata = { title: "Confirm Your Project | EzraTech", description: "Review your project arrangement and complete the demo Project Initiation Checklist." };
export default function ConfirmProjectPage() {
 return <DashboardShell activePath="/student/projects" title="Confirm Your Project" subtitle="Northstar Retail Ltd would like to continue with your application. Review the final project arrangement and complete the Project Initiation Checklist before the project workspace opens."><PreStartFlow /></DashboardShell>;
}
