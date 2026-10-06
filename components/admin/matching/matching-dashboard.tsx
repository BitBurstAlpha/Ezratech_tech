"use client";
import { projectCancelled } from "@/components/projects/closure/closure-data";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { useState } from "react";
import { AdminShell } from "../admin-shell";
import { SMECard, SMEAction, SMEDetail } from "@/components/sme/dashboard-ui";
import { useSMECandidates } from "@/components/sme/candidates/candidate-state";
import { useSMEProjectDraft } from "@/components/sme/projects/project-state";
import { WorkspaceDialog, secondaryButton } from "@/components/student/workspace/workspace-ui";
import { mockMatchingProjects, mockMatchingAttention } from "./matching-data";
import { MatchingPrototypeNote, MatchStatus } from "./matching-ui";
export function MatchingDashboard() {
  const { progress } = useDemoProgress();
  const { decisions, adminReviews } = useSMECandidates();
  const { review } = useSMEProjectDraft();
  const [preview, setPreview] = useState<string | null>(null);
  const accepted = Object.values(decisions).filter(item => item.smeDecision === "accepted").length;
  const pending = Object.values(decisions).filter(item => !item.smeDecision && item.smeReviewStatus !== "withdrawn").length;
  const overrides = Object.values(adminReviews).filter(item => ["removed", "evidence_requested"].includes(item.adminStatus)).length;
  return <AdminShell activeItem="Matching" title="Matching Oversight" subtitle="Review active student-to-project matching and monitor candidate selection across approved SME projects.">
    <div><SMEAction href="/admin/matching/unmatched">Review Unmatched Students</SMEAction></div>
    <section aria-label="Matching summary" className="grid grid-cols-2 gap-4 xl:grid-cols-4">{[{ label: "Projects in Matching", value: 4 - Number(projectCancelled(progress)) }, { label: "Students Awaiting Review", value: 11 }, { label: "SME Decisions Pending", value: 6 }, { label: "Manual Reviews Required", value: 2 + Object.values(adminReviews).filter(item => item.adminStatus === "evidence_requested").length }].map(item => <div key={item.label} className="rounded-xl border border-border bg-white p-5"><p className="text-xs text-muted">{item.label}</p><p className="mt-4 text-3xl font-semibold">{item.value}</p></div>)}</section><p className="text-xs text-muted">Platform totals are simulated demo values.</p>
    <SMECard title="Active Matching"><div className="grid gap-4 xl:grid-cols-3">{mockMatchingProjects.map(project => <article key={project.id} className="flex flex-col rounded-xl border border-border p-5"><h3 className="font-semibold">{project.title}</h3><p className="mt-2 text-sm text-muted">{project.company}</p><p className="my-4"><MatchStatus attention={project.id === "northstar-sales-analysis" && !review.matchingUnlocked}>{project.id === "northstar-sales-analysis" && !review.matchingUnlocked ? projectCancelled(progress) ? "Matching Closed" : "Awaiting Project Approval" : "Matching Active"}</MatchStatus></p><dl className="space-y-4"><SMEDetail label="Category">{project.category}</SMEDetail><SMEDetail label="Interested Students">{project.id === "northstar-sales-analysis" ? Object.values(decisions).filter(item => item.studentInterest).length : project.interested}</SMEDetail><SMEDetail label="Suitable Candidates">{project.suitable}</SMEDetail>{project.id === "northstar-sales-analysis" && <SMEDetail label="Shortlisted Candidates">{Math.max(0, 3 - overrides)}</SMEDetail>}<SMEDetail label="SME Decisions">{project.id === "northstar-sales-analysis" ? `${accepted} Accepted · ${pending} Under Review` : "Pending"}</SMEDetail><SMEDetail label="Admin Attention">{project.id === "northstar-sales-analysis" ? overrides ? `${overrides} candidate reviews recorded` : "None" : project.attention}</SMEDetail></dl><div className="mt-auto pt-5">{project.id === "northstar-sales-analysis" ? <SMEAction href="/admin/matching/northstar-sales-analysis">Review Matching</SMEAction> : <button type="button" className={secondaryButton} onClick={() => setPreview(project.title)}>Review Matching</button>}</div></article>)}</div></SMECard>
    <SMECard title="Needs Attention"><div className="grid gap-4 md:grid-cols-2">{mockMatchingAttention.map(item => <article key={item.title} className="rounded-xl border border-yellow-200 bg-yellow-50 p-5"><h3 className="font-semibold">{item.title}</h3><p className="mt-3 text-sm">Student: Demo Student</p><p className="mt-2 text-sm">Project: {item.project}</p><p className="my-4 text-sm leading-7 text-muted">{item.issue}</p><button type="button" className={secondaryButton} onClick={() => setPreview(item.title)}>Review</button></article>)}</div></SMECard><MatchingPrototypeNote />
    {preview && <WorkspaceDialog title={preview} onClose={() => setPreview(null)}><p className="text-sm leading-7 text-muted">Demo manual review: check the student&apos;s project-relevant evidence and weekly availability with the project requirements before deciding whether to include them.</p><p className="mt-4 text-xs text-muted">This additional project is a preview. The complete interactive matching review is available for Northstar Retail Ltd.</p><div className="mt-5"><SMEAction href="/admin/matching/northstar-sales-analysis">Review Northstar Matching</SMEAction></div></WorkspaceDialog>}
  </AdminShell>;
}
