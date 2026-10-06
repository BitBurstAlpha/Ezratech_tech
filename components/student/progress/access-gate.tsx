"use client";
import type { ReactNode } from "react";
import { useDemoProgress } from "./demo-progress";
import { DashboardCard, DashboardLink } from "@/components/student/dashboard/dashboard-card";
import { developmentConfirmed } from "@/components/student/assessment/development/development-data";
import { Icon } from "@/components/landing/icon";
import { ReadinessResult } from "@/components/student/readiness/readiness-result";
export function AccessGate({ kind, children }: { kind: "readiness" | "projects"; children: ReactNode }) {
  const { progress, learningComplete, readinessUnlocked, projectsUnlocked } = useDemoProgress();
  if (kind === "readiness") {
    if (!learningComplete) return <DashboardCard title="Complete your learning plan first"><p className="mb-5 text-sm leading-7 text-muted">Your personalised learning activities must be completed before project readiness can be confirmed.</p><DashboardLink href="/student/learning-plan" primary>Return to Learning Plan</DashboardLink></DashboardCard>;
    if (!progress.assessmentComplete) return <DashboardCard title="Complete your skills assessment first"><p className="mb-5 text-sm leading-7 text-muted">Your assessment must be completed before project readiness can be confirmed.</p><DashboardLink href="/student/assessment" primary>Continue to Skills Assessment</DashboardLink></DashboardCard>;
    if (!readinessUnlocked) return <DashboardCard title="Complete your reassessment first"><p className="mb-5 text-sm leading-7 text-muted">Your learning plan is complete. Finish the reassessment before confirming project readiness.</p><DashboardLink href="/student/reassessment" primary>Start Reassessment</DashboardLink></DashboardCard>;
    if (progress.readinessComplete) return <ReadinessResult />;
    return children;
  }
  if (projectsUnlocked) return children;
  return <DashboardCard title="Project Opportunities Locked" action={<Icon name="lock" className="h-6 w-6 text-muted" />}><p className="mb-6 text-sm leading-7 text-muted">Complete your personalised learning plan, reassessment and project readiness check before exploring SME projects.</p><dl className="mb-6 grid gap-4 sm:grid-cols-2">{[{ label: "Profile", status: progress.profileComplete ? "Completed" : "Not Started" }, { label: "Skills Assessment", status: progress.assessmentComplete ? "Completed" : "Not Started" }, { label: "Learning Plan", status: learningComplete ? "Completed" : "In Progress" }, { label: "Reassessment", status: developmentConfirmed(progress) ? "Completed" : learningComplete ? "Available" : "Locked" }, { label: "Readiness Check", status: progress.readinessComplete ? "Project Ready" : learningComplete ? "Needs confirmation" : "Locked" }].map(item => <div key={item.label} className="rounded-lg border border-border p-4"><dt className="text-sm font-medium">{item.label}</dt><dd className={`mt-2 text-xs ${item.status === "Completed" || item.status === "Project Ready" ? "text-green-700" : "text-muted"}`}>{item.status}</dd></div>)}</dl><DashboardLink href={learningComplete ? developmentConfirmed(progress) ? "/student/readiness" : "/student/reassessment" : "/student/learning-plan"} primary>Continue Your Journey</DashboardLink></DashboardCard>;
}
