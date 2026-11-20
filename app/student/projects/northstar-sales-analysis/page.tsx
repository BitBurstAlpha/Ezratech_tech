import { mockProjectDetails } from "@/components/student/projects/details/project-details-data";
import { requireMarketplace } from "@/lib/learning/access";
import { AccessGate } from "@/components/student/progress/access-gate";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { ProjectDetails } from "@/components/student/projects/details/project-details";
export const metadata: Metadata = { title: "Project Details | EzraTech" };
export default async function NorthstarProjectPage() {
  await requireMarketplace();

  return <DashboardShell activePath="/student/projects" title="Project Details" subtitle="Review the brief, expected commitment and project support before expressing interest."><AccessGate kind="projects"><ProjectDetails project={mockProjectDetails} /></AccessGate></DashboardShell>;
}
