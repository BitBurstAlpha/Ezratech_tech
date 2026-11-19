"use client";
import { useState } from "react";
import { useSME } from "../sme-state";
import { organisationSupervisor } from "../profile/profile-data";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { demoAgreements } from "@/components/student/applications/pre-start/pre-start-data";
import { SMEDashboardShell } from "../dashboard-shell";
import { SMEAction, SMECard, SMEDetail } from "../dashboard-ui";
import { CandidateModal } from "../candidates/candidate-ui";
import { useSMEProjectDraft } from "../projects/project-state";
import { mockReviewProject as project } from "../projects/review-data";
import { initiationChecklist, projectInitiation, scope, supervisor, supervisionTime, communication, agreement, dataAccess } from "./setup-data";
import { StartProject } from "./start-project";

export function SMEProjectSetupStatus() {
  const { profile } = useSME();
  const name = organisationSupervisor(profile).name;
  const { review } = useSMEProjectDraft();
  const { progress, dispatch } = useDemoProgress();
  const [preview, setPreview] = useState<typeof demoAgreements[number] | null>(null);
  const checks = initiationChecklist(progress);
  const { projectStatus } = projectInitiation(progress);
  const pending = projectStatus === "not_started";
  const values = progress.smeResponsibilityConfirmations;
  const status = { active: "Active", paused: "Paused", completed: "Completed", cancelled: "Cancelled", not_started: Object.values(checks).every(Boolean) ? "Ready to Start" : "Initiation Pending" }[projectStatus];
  function confirmation(keys: string[], label: string) {
    const checked = keys.every(key => values.includes(key));
    return <label className="mt-3 flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 accent-primary" disabled={!checks.sme || !pending} checked={checked} onChange={() => dispatch({ type: "setSMEResponsibilities", values: checked ? values.filter(value => !keys.includes(value)) : [...values, ...keys] })} />{label}</label>;
  }
  const rows = [
    { title: "Student Acceptance", done: checks.student, text: checks.student ? "Alex Morgan has confirmed participation in the project." : "Awaiting participation confirmation from Alex Morgan." },
    { title: "SME Acceptance", done: checks.sme, text: checks.sme ? "The SME has confirmed the selected student and agreed to proceed." : "Confirm the selected student in candidate review.", control: !checks.sme && <SMEAction href="/sme/projects/northstar-sales-analysis/candidates/alex-morgan">Review Candidate</SMEAction> },
    { title: "Project Scope Confirmation", done: checks.scope, text: "Review the approved objectives, expected deliverables, six-week duration, weekly workload and agreed acceptance criteria.", control: confirmation([scope], "I confirm the approved project scope.") },
    { title: "Supervisor Confirmation", done: checks.supervisor, text: `${name} will provide ${profile.supportTime} of supervision, provide student feedback and follow the agreed communication arrangements.`, control: confirmation([supervisor, supervisionTime, communication], "I confirm supervision, feedback and communication arrangements.") },
    { title: "Agreement and Confidentiality", done: checks.agreement, text: "Both parties must complete their agreement requirements in this prototype.", control: <>
      <ul className="mt-2 space-y-1">{demoAgreements.map(item => <li key={item.key} className="text-sm"><button type="button" onClick={() => setPreview(item)} className="font-medium text-primary underline">{item.title}</button> · Student review {progress.preStart[item.key] ? "completed" : "pending"}</li>)}</ul>
      {confirmation([agreement], "I confirm completion of the required project agreement and NDA for this demo.")}
    </> },
    { title: "Data and Resource Access", done: checks.data, text: `Approved resources include anonymised sample sales data, the project brief and reporting materials. Permitted tools include SQL, Excel and Power BI. Access method: ${review.submittedUpdate?.otherAccessMethod || review.submittedUpdate?.accessMethod || "Secure project workspace"}. Customer identifiers, live payment access and external publishing are restricted.`, control: confirmation([dataAccess], "I confirm the student will have access to the approved resources.") },
    { title: "Eligibility and Other Required Checks", done: checks.eligibility, text: `Student pre-start record: eligibility acknowledgement ${progress.preStart.eligibilityAcknowledged ? "recorded" : "pending"}, availability ${progress.preStart.availabilityConfirmed ? "confirmed" : "pending"}, project expectations ${progress.preStart.expectationsConfirmed ? "confirmed" : "pending"}. Legal eligibility verification is outside this demo.` },
  ];
  return <SMEDashboardShell activeItem="Projects" title="Project Initiation Checklist" subtitle="Complete the required confirmations before starting the project and activating the workspace.">
    {pending ? <StartProject title={project.title} student="Alex Morgan" supervisor={name} duration={project.duration} checks={Object.values(checks)} onStart={() => dispatch({ type: "startProject" })} /> :
      <SMECard title={projectStatus === "active" ? "Project Started Successfully" : status}><SMEAction primary href={`/sme/workspace/${project.id}${projectStatus === "cancelled" ? "/cancelled" : ""}`}>Open Workspace</SMEAction></SMECard>}
    <SMECard title={project.title} action={<span className="text-sm font-semibold text-primary">{status}</span>}>
      <dl className="grid gap-4 sm:grid-cols-3"><SMEDetail label="Company">{profile.companyName}</SMEDetail><SMEDetail label="Student">Alex Morgan</SMEDetail><SMEDetail label="Supervisor">{name}</SMEDetail><SMEDetail label="Duration">{project.duration}</SMEDetail><SMEDetail label="Expected Commitment">6 hours/week</SMEDetail></dl>
    </SMECard>
    <SMECard title="Required confirmations"><ol className="divide-y divide-border">{rows.map(row => <li key={row.title} className="py-4 first:pt-0">
      <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{row.title}</h3><span className={row.done ? "text-sm text-green-700" : "text-sm text-muted"}>{row.done ? "Completed" : "Pending"}</span></div>
      <p className="mt-2 text-sm leading-6 text-muted">{row.text}</p>{row.control}
    </li>)}</ol></SMECard>
    <SMEAction href="/sme/dashboard">Return to Dashboard</SMEAction>
    {preview && <CandidateModal title={preview.title} onDismiss={() => setPreview(null)}><p className="text-sm leading-7">{preview.text}</p><p className="mt-3 text-xs text-muted">Prototype agreement preview. No electronic signature is collected.</p></CandidateModal>}
  </SMEDashboardShell>;
}
