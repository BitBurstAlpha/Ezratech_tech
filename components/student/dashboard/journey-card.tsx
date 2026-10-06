"use client";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { projectCancelled } from "@/components/projects/closure/closure-data";
import { Icon } from "@/components/landing/icon";
import { DashboardCard } from "./dashboard-card";
import type { IconName } from "@/components/landing/icon";
export function JourneyCard() {
  const { progress, learningComplete, readinessUnlocked } = useDemoProgress();
  const journey: { label: string; status: string; icon: IconName }[] = [
    { label: "Profile", status: "Completed", icon: "check" },
    { label: "Skills Assessment", status: "Completed", icon: "check" },
    { label: "Learning", status: learningComplete ? "Completed" : "Current", icon: learningComplete ? "check" : "learning" },
    { label: "Project Ready", status: progress.projectReady ? "Completed" : readinessUnlocked ? "Next Step" : "Locked", icon: progress.projectReady ? "check" : readinessUnlocked ? "verified" : "lock" },
    { label: "SME Project", status: projectCancelled(progress) ? "Cancelled — evidence preserved" : progress.projectCompletion.smeApproved ? "Completed" : progress.activeProject ? "Current" : progress.projectReady ? "Available" : "Locked", icon: progress.projectCompletion.smeApproved ? "check" : progress.projectReady ? "project" : "lock" },
    { label: "Verified Experience", status: progress.verifiedExperience ? "Completed" : progress.projectCompletion.capabilityReviewReady ? "Next Step" : "Locked", icon: progress.verifiedExperience ? "check" : progress.projectCompletion.capabilityReviewReady ? "verified" : "lock" },
  ];
  const current = progress.verifiedExperience ? "Journey Complete" : progress.projectCompletion.capabilityReviewReady ? "Verified Experience" : progress.projectReady ? "SME Project" : learningComplete ? readinessUnlocked ? "Project Ready" : "Reassessment" : "Learning";

  return <DashboardCard title="Your EzraTech Journey" action={<span className="inline-flex items-center gap-2 rounded-full bg-blue-light px-3 py-1.5 text-xs font-medium text-primary"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{current}</span>}><ol className="grid gap-0 md:grid-cols-6">{journey.map((stage, index) => <li key={stage.label} aria-current={(stage.status === "Next Step" || stage.status === "Current" || stage.status === "Available") ? "step" : undefined} className="relative flex items-center gap-4 py-3 md:flex-col md:gap-3 md:px-1 md:py-2 md:text-center">{index < journey.length - 1 && <span aria-hidden="true" className="absolute left-5 top-12 h-[calc(100%-1.5rem)] border-l border-border md:left-[calc(50%+1.25rem)] md:top-7 md:h-0 md:w-[calc(100%-2.5rem)] md:border-l-0 md:border-t" />}<span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ${stage.status === "Completed" ? "bg-green-50 text-green-700" : (stage.status === "Next Step" || stage.status === "Current" || stage.status === "Available") ? "bg-primary text-white ring-4 ring-blue-light" : "bg-section text-gray-400"}`}><Icon name={stage.icon} className="h-5 w-5" /></span><div><p className={`text-xs font-semibold leading-5 ${stage.status === "Locked" ? "text-muted" : "text-ink"}`}>{stage.label}</p><p className={`mt-1 text-[11px] ${stage.status === "Completed" ? "text-green-700" : (stage.status === "Next Step" || stage.status === "Current" || stage.status === "Available") ? "font-medium text-primary" : "text-muted"}`}>{stage.status}</p></div></li>)}</ol></DashboardCard>;
}
