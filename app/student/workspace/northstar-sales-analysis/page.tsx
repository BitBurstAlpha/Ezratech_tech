import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { ProjectWorkspace } from "@/components/student/workspace/project-workspace";

export const metadata: Metadata = { title: "Project Workspace | EzraTech", description: "Your Northstar project tasks, milestones and delivery workspace." };

export default function WorkspacePage() {
  return <DashboardShell activePath="/student/workspace" title="Project Workspace" subtitle="Your project work, conversations and next steps in one place."><ProjectWorkspace /></DashboardShell>;
}
