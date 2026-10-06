import { AccessGate } from "@/components/student/progress/access-gate";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { ProjectMarketplace } from "@/components/student/projects/project-marketplace";
export const metadata: Metadata = { title: "Project Opportunities | EzraTech", description: "Browse simulated SME projects matched to Alex Morgan's skills, availability and career goals." };
export default function StudentProjectsPage() {
  return <DashboardShell activePath="/student/projects" title="Project Opportunities" subtitle="Explore approved SME projects that align with your demonstrated skills, availability and career goals."><AccessGate kind="projects"><ProjectMarketplace /></AccessGate></DashboardShell>;
}
