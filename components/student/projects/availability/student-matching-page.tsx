"use client";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { AccessGate } from "@/components/student/progress/access-gate";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { newMatchAvailable } from "./availability-data";
import { NoMatchFlow } from "./no-match-flow";
export function StudentMatchingPage() {
  const { progress, projectsUnlocked } = useDemoProgress();
  const available = newMatchAvailable(progress.matchingAvailability, projectsUnlocked);
  return <DashboardShell activePath="/student/projects" title={!projectsUnlocked ? "Project Matching Status" : available ? "New Project Opportunity" : "No Suitable Project Available Yet"} subtitle="Your readiness stays recognised while suitable project opportunities are reviewed."><AccessGate kind="projects"><NoMatchFlow activate /></AccessGate></DashboardShell>;
}
