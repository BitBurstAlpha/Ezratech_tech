"use client";
import { projectCancelled } from "@/components/projects/closure/closure-data";
import { ClosedProjectBody } from "@/components/projects/closure/closed-project";
import { useEffect, useRef, useState } from "react";
import { PausedProject } from "@/components/admin/monitoring/shared-monitoring-notice";
import { DashboardCard, DashboardLink } from "@/components/student/dashboard/dashboard-card";
import { JourneyCard } from "@/components/student/dashboard/journey-card";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { mockWorkspace as project } from "../workspace-data";
import { StatusBadge } from "../workspace-ui";
import { submissionReady } from "./completion-data";
import { SubmissionForm } from "./submission-form";
import { SubmissionReview } from "./submission-review";

export function ProjectCompletionFlow() {
  const { progress, dispatch } = useDemoProgress();
  const completion = progress.projectCompletion;
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!submitting) return;
    const timer = setTimeout(() => { dispatch({ type: "submitFinalProject" }); setSubmitting(false); }, 1000);
    return () => clearTimeout(timer);
  }, [submitting, dispatch]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 5000); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => { if (completion.finalSubmitted) { resultRef.current?.focus(); resultRef.current?.scrollIntoView({ block: "start" }); } }, [completion.finalSubmitted, completion.smeReviewStatus]);
  if (projectCancelled(progress)) return <ClosedProjectBody role="student" />;
  if (!progress.preStart.workspaceUnlocked) return <DashboardCard title="Workspace Locked"><p className="mb-5 text-sm leading-7 text-muted">Complete all required project confirmation and pre-start steps before accessing the workspace.</p><DashboardLink primary href="/student/applications/northstar-sales-analysis/confirm">Return to Pre-Start Checks</DashboardLink></DashboardCard>;
  if (progress.monitoring.paused && !completion.smeApproved) return <PausedProject />;
  if (!completion.tasksComplete) return <DashboardCard title="Complete Your Project Tasks"><p className="mb-5 text-sm leading-7 text-muted">Complete all six project tasks in your workspace before submitting your final project.</p><DashboardLink primary href="/student/workspace/northstar-sales-analysis">Return to Workspace</DashboardLink></DashboardCard>;
  const status = completion.smeApproved ? "Completed" : completion.finalSubmitted ? "Under Review" : "Work Complete";
  return <div className="mx-auto max-w-5xl space-y-6">
    <section className="rounded-xl border border-border bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-medium text-primary">{project.company}</p><h2 className="mt-2 text-2xl font-semibold">{project.project}</h2></div><StatusBadge status={completion.finalSubmitted ? status : "Project Work Complete"} /></div><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-4">{[{ label: "Student", value: project.student }, { label: "Supervisor", value: project.supervisor }, { label: "Project Duration", value: project.duration }, { label: "Project Status", value: status }].map(item => <div key={item.label}><dt className="text-xs text-muted">{item.label}</dt><dd className="mt-2 font-medium">{item.value}</dd></div>)}</dl></section>
    <DashboardCard title="Project Completion"><dl className="grid gap-5 sm:grid-cols-2">{[{ label: "Tasks", value: "6 of 6 completed" }, { label: "Milestones", value: "5 of 5 completed" }, { label: "Weekly Updates", value: "6 submitted" }, { label: "Project Duration", value: "6 weeks" }, { label: "Current Status", value: completion.smeApproved ? "Project Accepted" : completion.changesRequested ? "Changes Requested" : completion.finalSubmitted ? "Under Review" : "Ready for Final Submission" }].map(item => <div key={item.label}><dt className="text-xs text-muted">{item.label}</dt><dd className="mt-2 text-sm font-medium">{item.value}</dd></div>)}</dl><p className="mt-5 text-xs leading-6 text-muted">This completion summary uses a simulated end-of-project snapshot.</p></DashboardCard>
    {completion.finalSubmitted ? <><div ref={resultRef} tabIndex={-1}><SubmissionReview completion={completion} capabilityReviewed={progress.verifiedExperience} onApprove={() => dispatch({ type: "approveFinalProject" })} onRequestChanges={() => dispatch({ type: "requestProjectChanges" })} onResubmit={() => { dispatch({ type: "resubmitFinalProject" }); setToast("Demo project resubmitted for SME review."); }} /></div><details className="rounded-xl border border-border bg-white p-6"><summary className="cursor-pointer text-sm font-semibold text-primary">View Submitted Work</summary><div className="mt-6"><SubmissionForm submission={progress.submission} onChange={() => {}} onSubmit={() => {}} submitting={false} notify={setToast} readOnly /></div></details></> : <SubmissionForm submission={progress.submission} onChange={patch => dispatch({ type: "updateSubmission", patch })} onSubmit={() => { if (submissionReady(progress.submission)) setSubmitting(true); }} submitting={submitting} notify={setToast} />}
    <JourneyCard />
    <p className="text-xs leading-6 text-muted"><span className="font-semibold">Prototype Demo</span> · Files, submission and SME review are simulated. No files are uploaded and no skills are automatically verified. Demo progress lasts until the page is refreshed.</p>
    {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-center justify-between gap-4 rounded-xl border border-border bg-white p-5 text-sm leading-6 shadow-lg">{toast}<button type="button" onClick={() => setToast("")} className="font-medium text-primary">Dismiss</button></div>}
  </div>;
}
