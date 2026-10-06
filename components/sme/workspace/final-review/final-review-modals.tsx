import { useState, type FormEvent } from "react";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { WorkspaceDialog, primaryButton, secondaryButton } from "@/components/student/workspace/workspace-ui";
import { ProjectField, ProjectMultiSelect } from "../../projects/project-fields";
import { defaultFinalChange, deliverablePreviews, finalChangeCategories, finalReviewReady } from "./final-review-data";
export type FinalReviewModal = { type: "preview"; id: string } | { type: "accept" | "changes" | "issue" };
export function FinalReviewModalView({ modal, onClose, notify }: { modal: FinalReviewModal; onClose: () => void; notify: (message: string) => void }) {
  const { progress, dispatch } = useDemoProgress();
  const [confirmed, setConfirmed] = useState(false);
  const [categories, setCategories] = useState(["Dashboard"]);
  const [changes, setChanges] = useState(defaultFinalChange);
  const [requestedDate, setRequestedDate] = useState("");
  const [issue, setIssue] = useState("");
  const [error, setError] = useState("");
  const review = progress.finalSMEReview;
  const ready = finalReviewReady(review, progress.submission);
  const deliverable = modal.type === "preview" ? progress.submission.deliverables.find(item => item.id === modal.id) : null;
  const title = modal.type === "preview" ? `Preview: ${deliverable?.title}` : modal.type === "accept" ? "Accept Final Project?" : modal.type === "changes" ? "Request Final Changes" : "Report Final Review Issue";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (modal.type === "accept") { if (!confirmed || !ready) return; dispatch({ type: "acceptFinalSMEProject" }); }
    if (modal.type === "changes") { if (!categories.length || !changes.trim()) { setError("Select at least one category and describe the required changes."); return; } dispatch({ type: "requestFinalSMEChanges", categories, text: changes.trim(), requestedDate }); }
    if (modal.type === "issue") { if (!issue.trim()) { setError("Describe the review issue before submitting."); return; } dispatch({ type: "recordProjectIssue", issueType: "Final Submission Review", description: issue.trim(), urgency: "Normal" }); notify("Project issue recorded for demo."); }
    onClose();
  }
  return <WorkspaceDialog title={title} onClose={onClose}>{modal.type === "preview" ? <><span className="rounded-full bg-blue-light px-3 py-1 text-xs font-semibold text-primary">Mock Preview</span><p className="mt-5 break-words text-sm font-semibold">{deliverable?.file}</p><p className="mt-4 text-sm leading-7 text-muted">{deliverablePreviews[modal.id]}</p><p className="mt-5 text-xs leading-6 text-muted">Prototype preview only. No real file is opened, processed or downloaded.</p><button type="button" onClick={onClose} className={`${secondaryButton} mt-5`}>Close Preview</button></> : <form onSubmit={submit} className="space-y-5">{modal.type === "accept" ? <><h3 className="font-semibold">Sales Performance Analysis</h3><p className="text-sm text-muted">Student: Alex Morgan</p><dl className="space-y-3">{[{ label: "Deliverables reviewed", done: progress.submission.deliverables.every(item => review.reviewedDeliverableIds.includes(item.id)) }, { label: "Acceptance criteria reviewed", done: Object.values(review.acceptanceCriteria).every(value => value === "met") }, { label: "Final feedback completed", done: Boolean(review.feedback.general.trim()) }, { label: "Portfolio permissions reviewed", done: review.portfolioPermissionsReviewed }].map(item => <div key={item.label} className="flex items-center justify-between gap-3 text-sm"><dt>{item.label}</dt><dd className={`text-xs font-medium ${item.done ? "text-green-700" : "text-amber-800"}`}>{item.done ? "Complete" : "Needs attention"}</dd></div>)}</dl>{!ready && <p className="rounded-lg bg-amber-50 p-4 text-xs leading-6 text-amber-900">Review all four deliverables, resolve any acceptance criteria, complete the final feedback and confirm portfolio permissions before accepting.</p>}<label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />I confirm that the agreed project work has been completed for this prototype.</label></> : modal.type === "changes" ? <><ProjectMultiSelect label="Change categories" value={categories} options={finalChangeCategories} onChange={setCategories} /><ProjectField label="Changes Required" multiline value={changes} onChange={setChanges} /><ProjectField label="Requested Completion Date (optional)" type="date" required={false} value={requestedDate} onChange={setRequestedDate} /></> : <ProjectField label="Issue Description" multiline value={issue} onChange={setIssue} />}{error && <p role="alert" className="text-sm text-amber-800">{error}</p>}<div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5"><button type="button" onClick={onClose} className={secondaryButton}>Cancel</button><button type="submit" disabled={modal.type === "accept" && (!ready || !confirmed)} className={primaryButton}>{modal.type === "accept" ? "Accept Project" : modal.type === "changes" ? "Send Change Request" : "Submit Issue"}</button></div></form>}</WorkspaceDialog>;
}
