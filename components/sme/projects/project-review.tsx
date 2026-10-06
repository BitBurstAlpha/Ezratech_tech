import type { ReactNode } from "react";
import { Icon } from "@/components/landing/icon";
import { projectQualityChecks, validateProjectStep, type ProjectDraft } from "./project-data";

function Items({ values }: { values: string[] }) {
  return values.length ? <ul className="list-disc space-y-1 pl-4">{values.map((value, index) => <li key={index}>{value || "Not provided"}</li>)}</ul> : <>None selected</>;
}
export function ProjectReview({ draft, onEdit }: { draft: ProjectDraft; onEdit: (step: number) => void }) {
  const rows: { label: string; value: ReactNode; step: number }[] = [
    { label: "Project Title", value: draft.title, step: 0 },
    { label: "Category", value: draft.category, step: 0 },
    { label: "Short Project Summary", value: draft.summary, step: 0 },
    { label: "Business Problem", value: draft.businessProblem, step: 1 },
    { label: "Business Value", value: draft.businessValue, step: 1 },
    { label: "Successful Outcome", value: draft.successfulOutcome, step: 1 },
    { label: "Objectives", value: <Items values={draft.objectives} />, step: 1 },
    { label: "Deliverables", value: <Items values={draft.deliverables} />, step: 2 },
    { label: "Required Skills", value: draft.requiredSkills.map(skill => skill === "Other" ? draft.otherSkill : skill).join(", ") || "None selected", step: 2 },
    { label: "Optional Skills", value: draft.optionalSkills.join(", ") || "None selected", step: 2 },
    { label: "Duration", value: draft.duration === "Custom" ? draft.customDuration : draft.duration, step: 0 },
    { label: "Weekly Commitment", value: draft.weeklyCommitment === "Custom" ? draft.customCommitment : draft.weeklyCommitment, step: 0 },
    { label: "Working Style", value: draft.workingStyle, step: 0 },
    { label: "Supervisor", value: draft.supervisor.usePrimaryContact === "Yes" ? `${draft.supervisor.name} · ${draft.supervisor.jobTitle}` : <>{draft.supervisor.name} · {draft.supervisor.jobTitle}<span className="block">{draft.supervisor.email}</span></>, step: 3 },
    { label: "Supervision Commitment", value: draft.supervisionTime, step: 3 },
    { label: "Meeting Frequency", value: draft.meetingFrequency, step: 3 },
    { label: "Meeting Format", value: draft.meetingFormat, step: 3 },
    { label: "Suggested Timeline", value: <Items values={draft.timeline.map(stage => `${stage.week}: ${stage.label}`)} />, step: 3 },
    { label: "Company Data Access", value: draft.dataRequirements.access, step: 4 },
    { label: "Data Type", value: draft.dataRequirements.access === "No" ? "No company data required" : draft.dataRequirements.type, step: 4 },
    { label: "Data Description", value: draft.dataRequirements.access === "No" ? "Not applicable" : draft.dataRequirements.description, step: 4 },
    { label: "Confidentiality", value: <>NDA likely: {draft.confidentiality.nda}<span className="block">Sensitive or restricted information: {draft.dataRequirements.sensitive}</span></>, step: 4 },
    { label: "Portfolio Permission", value: draft.confidentiality.portfolioPermission, step: 4 },
    { label: "Project Restrictions", value: <Items values={draft.restrictions.map(item => item === "Other" ? draft.otherRestriction : item)} />, step: 4 },
    { label: "Acceptance Criteria", value: <Items values={draft.acceptanceCriteria} />, step: 3 },
  ];
  const checks = projectQualityChecks(draft);
  const ready = checks.every(check => check.complete) && [0, 1, 2, 3, 4].every(step => !validateProjectStep(draft, step));
  return <div className="space-y-7"><dl className="divide-y divide-border">{rows.map(row => <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 py-4 first:pt-0 sm:grid-cols-[170px_minmax(0,1fr)_auto]"><dt className="text-xs font-semibold text-muted sm:pt-1">{row.label}</dt><dd className="col-start-1 break-words text-sm leading-6 sm:col-start-auto">{row.value || "Not provided"}</dd><button type="button" onClick={() => onEdit(row.step)} aria-label={`Edit ${row.label}`} className="col-start-2 row-start-1 self-start rounded px-2 py-1 text-xs font-semibold text-primary hover:bg-blue-light sm:col-start-auto">Edit</button></div>)}</dl><section className="rounded-lg border border-border bg-section p-5"><h3 className="font-semibold">Project Quality Check</h3><ul className="mt-4 space-y-3">{checks.map(check => <li key={check.label} className="flex items-start justify-between gap-3 text-sm"><span>{check.label}</span><span className={`flex shrink-0 items-center gap-1 text-xs font-medium ${check.complete ? "text-green-700" : "text-amber-800"}`}>{check.complete && <Icon name="check" className="h-4 w-4" />}{check.complete ? "Complete" : "Needs attention"}</span></li>)}</ul><p className={`mt-5 border-t border-border pt-4 text-sm font-semibold ${ready ? "text-green-700" : "text-amber-800"}`}>{ready ? "Ready for EzraTech Review" : "Complete the missing information before submitting"}</p></section></div>;
}
