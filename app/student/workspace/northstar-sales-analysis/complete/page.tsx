import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { ProjectCompletionFlow } from "@/components/student/workspace/completion/project-completion-flow";

export const metadata: Metadata = { title: "Complete Your Project | EzraTech", description: "Submit your Northstar project deliverables and explore the simulated SME review." };
export default function CompleteProjectPage() {
  return <DashboardShell activePath="/student/workspace" title="Complete Your Project" subtitle="You have completed the project tasks. Review your final work and submit the project for SME review."><ProjectCompletionFlow /></DashboardShell>;
}
