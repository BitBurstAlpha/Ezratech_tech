import { AccessGate } from "@/components/student/progress/access-gate";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { ProjectDetails } from "@/components/student/projects/details/project-details";
export const metadata: Metadata = { title: "Sales Performance Analysis | EzraTech", description: "Explore the Northstar Retail Ltd demo project brief and express interest for demonstration purposes." };
export default function NorthstarProjectPage() {
  return <DashboardShell activePath="/student/projects" title="Project Details" subtitle="Review the brief, expected commitment and project support before expressing interest."><AccessGate kind="projects"><ProjectDetails /></AccessGate></DashboardShell>;
}
