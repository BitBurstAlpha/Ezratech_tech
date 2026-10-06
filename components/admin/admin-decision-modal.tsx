import { useState, type FormEvent } from "react";
import { CandidateModal as DemoModal } from "@/components/sme/candidates/candidate-ui";
import { ProjectField, ProjectMultiSelect } from "@/components/sme/projects/project-fields";
import { useSMEProjectDraft } from "@/components/sme/projects/project-state";
import { smePrimary, smeSecondary } from "@/components/sme/sme-shell";
import { changeCategories, defaultChangeRequest, rejectionReasons } from "./admin-data";
export type AdminDecisionAction = "approve" | "changes" | "reject";
export function AdminDecisionModal({ action, onDismiss }: { action: AdminDecisionAction; onDismiss: () => void }) {
  const { adminChecks, requestChanges, approveProject, rejectProject, adminReviewStatus } = useSMEProjectDraft();
  const [categories, setCategories] = useState(["Data & Confidentiality"]);
  const [changeText, setChangeText] = useState(defaultChangeRequest);
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const ready = Object.values(adminChecks).every(status => status === "approved") && ["awaiting_review", "resubmitted"].includes(adminReviewStatus);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (action === "changes") { if (!categories.length || !changeText.trim()) { setError("Select at least one issue category and describe the requested changes."); return; } requestChanges(categories, changeText.trim()); }
    if (action === "approve") { if (!confirmed || !ready) return; approveProject(); }
    if (action === "reject") { if (!reason || !explanation.trim()) { setError("Choose a reason and add an explanation before confirming rejection."); return; } rejectProject(reason, explanation.trim()); }
    onDismiss();
  }
  const confirmationChecks = [{ label: "Project scope reviewed", keys: ["scope", "businessProblem"] }, { label: "Deliverables reviewed", keys: ["deliverables"] }, { label: "Skills reviewed", keys: ["skills"] }, { label: "Supervision reviewed", keys: ["supervision", "timeCommitment"] }, { label: "Data arrangement reviewed", keys: ["dataConfidentiality"] }, { label: "Acceptance criteria reviewed", keys: ["acceptanceCriteria"] }] as const;
  return <DemoModal title={action === "approve" ? "Approve this project?" : action === "changes" ? "Request Project Changes" : "Reject Project"} onDismiss={onDismiss}><form onSubmit={submit} className="space-y-5">{action === "changes" ? <><ProjectMultiSelect label="Issue categories" options={changeCategories} value={categories} onChange={setCategories} /><ProjectField label="Changes Requested" multiline value={changeText} onChange={setChangeText} /></> : action === "approve" ? <><div><h3 className="font-semibold">Sales Performance Analysis</h3><p className="mt-2 text-sm text-muted">Northstar Retail Ltd</p></div><ul className="space-y-3">{confirmationChecks.map(check => { const done = check.keys.every(key => adminChecks[key] === "approved"); return <li key={check.label} className="flex items-center justify-between gap-3 text-sm"><span>{check.label}</span><span className={`text-xs font-medium ${done ? "text-green-700" : "text-amber-800"}`}>{done ? "Reviewed" : "Needs attention"}</span></li>; })}</ul>{!ready && <p className="rounded-lg bg-amber-50 p-4 text-xs leading-6 text-amber-900">Resolve outstanding review checks before approval. If changes were requested, wait for the SME to submit an update.</p>}<label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />I confirm this project is ready to move into student matching for this prototype.</label></> : <><p className="text-sm leading-6 text-muted">Record why the project is not suitable to proceed. The project will remain in the prototype.</p><div><label htmlFor="admin-rejection-reason" className="mb-2 block text-sm font-semibold">Reason</label><select id="admin-rejection-reason" required value={reason} onChange={event => setReason(event.target.value)} className="w-full rounded-lg border border-border px-3 py-3 text-sm"><option value="">Select a reason</option>{rejectionReasons.map(item => <option key={item}>{item}</option>)}</select></div><ProjectField label="Admin explanation" multiline value={explanation} onChange={setExplanation} /></>}{error && <p role="alert" className="text-sm text-amber-900">{error}</p>}<div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5"><button type="button" onClick={onDismiss} className={smeSecondary}>Cancel</button><button type="submit" disabled={action === "approve" && (!ready || !confirmed)} className={action === "reject" ? "rounded-lg border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50" : smePrimary}>{action === "approve" ? "Approve Project" : action === "changes" ? "Send Change Request" : "Confirm Rejection"}</button></div></form></DemoModal>;
}
