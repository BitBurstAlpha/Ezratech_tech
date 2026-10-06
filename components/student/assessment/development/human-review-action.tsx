"use client";
import { useState } from "react";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { ProjectField, ProjectSelect } from "@/components/sme/projects/project-fields";
import { WorkspaceDialog, secondaryButton, primaryButton } from "@/components/student/workspace/workspace-ui";
import { humanReviewCategories } from "./development-data";
export function HumanReviewAction() {
  const { progress, dispatch } = useDemoProgress();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("Capability level");
  const [text, setText] = useState("I believe my previous project planning experience was not fully reflected in the assessment.");
  return <div className="space-y-4"><button type="button" onClick={() => setOpen(true)} className={secondaryButton}>Request Human Review</button><p className="text-xs leading-6 text-muted">If you believe the assessment does not reflect your evidence, you can request a human review.</p>{(progress.assessment.reviewRequest || progress.assessment.review.decision) && <div role="status" className="rounded-lg border border-primary/20 bg-blue-light p-4"><p className="text-sm font-semibold">{progress.assessment.humanReviewStatus === "pending" ? "Review Requested" : progress.assessment.humanReviewStatus === "evidence_requested" ? "Additional Evidence Requested" : "Human Review Completed"}</p><p className="mt-2 text-xs text-muted">{progress.assessment.humanReviewStatus === "pending" ? "Awaiting Human Review" : progress.assessment.review.reviewerNotes}</p>{progress.assessment.review.evidenceRequired && <p className="mt-3 text-sm leading-7">{progress.assessment.review.evidenceRequired}</p>}</div>}{open && <WorkspaceDialog title="Request Assessment Review" onClose={() => setOpen(false)}><form className="space-y-5" onSubmit={event => { event.preventDefault(); if (!text.trim()) return; dispatch({ type: "requestAssessmentHumanReview", category, text }); setOpen(false); }}><ProjectSelect label="What would you like reviewed?" value={category} options={humanReviewCategories} onChange={setCategory} /><ProjectField label="Explain your request" value={text} multiline onChange={setText} /><div className="flex flex-wrap gap-3"><button type="button" className={secondaryButton} onClick={() => setOpen(false)}>Cancel</button><button type="submit" disabled={!text.trim()} className={primaryButton}>Submit Review Request</button></div></form></WorkspaceDialog>}</div>;
}
export function AssessmentPrototypeNote() { return <p className="text-xs leading-6 text-muted"><span className="font-semibold">Prototype Demo</span> · Assessment outcomes, reassessment and human review shown here use simulated data.</p>; }
