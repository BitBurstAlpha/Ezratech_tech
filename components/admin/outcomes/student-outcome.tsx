"use client";
import { useState } from "react";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { learningComplete } from "@/components/student/progress/progress-state";
import { capabilityDefinitions } from "../capability/capability-data";
import { SMEAction, SMECard } from "@/components/sme/dashboard-ui";
import { primaryButton, secondaryButton } from "@/components/student/workspace/workspace-ui";
import { mockStudentFollowUps, outcomeIdentity, outcomeRoutes, studentOutcome } from "./outcomes-data";
import { OutcomeBadge, OutcomesShell, RecordFields } from "./outcomes-ui";
import { FollowUpDialog } from "./follow-up-dialog";
export function StudentOutcome() {
  const { progress, dispatch } = useDemoProgress();
  const s = studentOutcome(progress);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const journey = [
    ["Registered", progress.profileComplete ? "Completed" : "Pending"], ["Assessment", progress.assessmentComplete ? "Completed" : "Pending"], ["Learning", learningComplete(progress) ? "Completed" : "Pending"], ["Project Ready", progress.projectReady ? "Confirmed" : "Pending"], ["Project", s.projectStatus], ["Capability Review", s.capabilityStatus], ["Portfolio", progress.portfolioAdded ? "Updated" : "Pending"], ["30-Day Follow-Up", s.followUp30 ? "Completed" : s.completed ? "Pending" : "Not Due"], ["90-Day Follow-Up", s.followUp90 ? "Completed" : s.completed ? "Pending" : "Not Due"],
  ];
  return <OutcomesShell title="Student Outcome Record" subtitle="Review project evidence and later participant-reported outcomes for Alex Morgan."><SMEAction href={outcomeRoutes.dashboard}>Back to Outcomes</SMEAction>
    <SMECard title={outcomeIdentity.student}><RecordFields items={[["Student", outcomeIdentity.student], ["Career Goal", outcomeIdentity.careerGoal], ["Project", outcomeIdentity.project], ["Company", outcomeIdentity.company]]} /><div className="mt-5"><SMEAction href={outcomeRoutes.sme}>View SME Outcome</SMEAction></div></SMECard>
    <SMECard title="Student Journey Summary"><RecordFields items={journey.map(([label, value]) => [label, <OutcomeBadge key={label}>{value}</OutcomeBadge>])} /></SMECard>
    <SMECard title="Project Outcome"><RecordFields items={[["Project Completed", s.completed ? "Yes" : "No"], ["SME Accepted Output", s.completed ? "Yes" : "No"], ["Verified Experience", s.verified ? "Yes" : s.cancelled && progress.cancellation.partialApproved ? "Partial experience only" : "Pending"]]} /><h3 className="mt-6 text-sm font-semibold">Capabilities Verified</h3><div className="mt-3 flex flex-wrap gap-2">{s.verified ? capabilityDefinitions.filter(item => progress.capabilityReview.capabilities[item.key].decision !== "not_evidenced").map(item => <OutcomeBadge key={item.key}>{item.name}</OutcomeBadge>) : <p className="text-sm text-muted">{s.cancelled ? "Project cancellation remains visible. Any partial experience is reviewed separately; full project completion is not recorded." : "Capabilities will appear after human review confirms the existing project evidence."}</p>}</div><div className="mt-5"><SMEAction href="/admin/capability-reviews/northstar-sales-analysis/alex-morgan">View Capability Review</SMEAction></div></SMECard>
    <SMECard title="30-Day Follow-Up" action={<OutcomeBadge>{s.followUp30 ? "Completed" : s.completed ? "Pending" : "Not Due"}</OutcomeBadge>}>
      {s.followUp30 ? <><RecordFields items={[["Student Status", mockStudentFollowUps.currentStatus], ["Applications Since Project", mockStudentFollowUps.applications], ["Interviews", mockStudentFollowUps.interviews], ["Offers", mockStudentFollowUps.offers], ["Employment", mockStudentFollowUps.employment], ["Portfolio Used in Applications", mockStudentFollowUps.portfolioUsed]]} /><h3 className="mt-6 text-sm font-semibold">Student Comment</h3><blockquote className="mt-3 rounded-lg bg-blue-light p-4 text-sm leading-7">“{mockStudentFollowUps.comment}”</blockquote></> : <><p className="text-sm leading-7 text-muted">{s.completed ? "No 30-day follow-up has been recorded. Record the sample participant-reported follow-up to demonstrate this stage." : "Follow-up becomes available after project completion. Continue the existing journey, or load the completed pilot demo on the dashboard."}</p>{s.completed && <button type="button" className={`${secondaryButton} mt-4`} onClick={() => { dispatch({ type: "record30DayFollowUp" }); setNotice("Sample 30-day follow-up recorded in shared demo state."); }}>Record Sample 30-Day Follow-Up</button>}</>}
      <p className="mt-5 text-xs leading-6 text-muted">This is participant-reported demo information. Interview opportunity reported after participation; no causal claim or employment verification is made.</p>
    </SMECard>
    <SMECard title="90-Day Follow-Up" action={<OutcomeBadge>{s.followUp90 ? "Completed" : s.completed ? "Pending" : "Not Due"}</OutcomeBadge>}>
      {s.followUp90 && <RecordFields items={[["Current Status", s.followUp90.currentStatus === "Started employment" ? "Employment reported after participation" : s.followUp90.currentStatus], ["Role Title", s.followUp90.roleTitle || "Not provided"], ["Employer", s.followUp90.employer || "Not provided"], ["Role Related to Project Area", s.followUp90.related], ["Student Reports Using Project Evidence", s.followUp90.evidenceUsed], ["Notes", s.followUp90.notes || "No additional notes"]]} />}
      <p className="mt-3 text-xs leading-6 text-muted">{s.completed ? "Record a participant’s later status. Follow-up participation is counted once per student, even when multiple follow-ups are completed." : "Follow-up recording is unavailable until the project is completed."}</p><button type="button" disabled={!s.completed} className={`${primaryButton} mt-5`} onClick={() => setEditing(true)}>{s.followUp90 ? "Edit Demo Follow-Up" : "Record Follow-Up"}</button>
    </SMECard>
    {notice && <p role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
    {editing && <FollowUpDialog previous={s.followUp90} onClose={() => setEditing(false)} onSave={followUp => { dispatch({ type: "save90DayFollowUp", followUp }); setEditing(false); setNotice("90-day demo follow-up saved. Shared outcome reporting has updated."); }} />}
  </OutcomesShell>;
}
