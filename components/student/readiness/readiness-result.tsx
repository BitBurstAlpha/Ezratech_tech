"use client";
import { ProjectPreferencesEditor } from "@/components/student/projects/availability/project-preferences";
import { useRouter } from "next/navigation";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { DashboardCard, DashboardLink } from "@/components/student/dashboard/dashboard-card";
import { Icon } from "@/components/landing/icon";
import { mockReadinessStatus } from "./readiness-data";
export function ReadinessResult({ outcome = "ready" }: { outcome?: "ready" | "notReady" }) {
  const { dispatch } = useDemoProgress();
  const router = useRouter();
  if (outcome === "notReady") return <DashboardCard title={mockReadinessStatus.notReady.status}><ul className="space-y-3">{mockReadinessStatus.notReady.reasons.map(reason => <li key={reason} className="flex items-center gap-2 text-sm text-muted"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{reason}</li>)}</ul><div className="mt-6"><DashboardLink href="/student/dashboard">Return to Dashboard</DashboardLink></div></DashboardCard>;
  const result = mockReadinessStatus.ready;
  return <div className="space-y-6"><section className="rounded-xl border border-border bg-white p-6 sm:p-8"><span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"><Icon name="check" className="h-4 w-4" />{result.status}</span><h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{result.title}</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-muted">{result.description}</p><dl className="mt-6 grid gap-3 sm:grid-cols-2">{result.checks.map(check => <div key={check.label} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-4"><dt className="text-sm font-medium">{check.label}</dt><dd className={`text-xs font-medium ${check.status === "Recorded for demo" ? "text-muted" : "text-green-700"}`}>{check.status}</dd></div>)}</dl></section><DashboardCard title="What happens next?"><ol className="space-y-4">{mockReadinessStatus.nextSteps.map((step, index) => <li key={step} className="flex items-start gap-3 text-sm leading-6 text-muted"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-light text-xs font-semibold text-primary">{index + 1}</span>{step}</li>)}</ol></DashboardCard><ProjectPreferencesEditor /><div className="flex flex-wrap gap-3"><button type="button" onClick={() => { dispatch({ type: "unlockProjects" }); router.push("/student/projects"); }} className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover">Unlock Project Opportunities</button><DashboardLink href="/student/dashboard">Return to Dashboard</DashboardLink></div></div>;
}
