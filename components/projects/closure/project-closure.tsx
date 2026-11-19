"use client";
import { useState, type ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { capabilityRoute } from "@/components/admin/capability/capability-data";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { SMEDashboardShell } from "@/components/sme/dashboard-shell";
import { SMEAction, SMECard, SMEDetail } from "@/components/sme/dashboard-ui";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { useSMEWorkspaces } from "@/components/sme/workspace/workspace-manager-state";
import { useSMEProjectDraft } from "@/components/sme/projects/project-state";
import { useSME } from "@/components/sme/sme-state";
import { organisationSupervisor } from "@/components/sme/profile/profile-data";
import { mockVerifiedExperiences } from "@/components/student/portfolio/evidence-record-data";
import { mockMilestones } from "@/components/student/workspace/workspace-data";
import { milestoneTaskIds } from "@/components/sme/workspace/workspace-data";
import { inputClass, primaryButton, secondaryButton, WorkspaceDialog } from "@/components/student/workspace/workspace-ui";
import { emptyClosure, closureChecklist, canSubmitClosure, offerFields, recommendationFields, opportunityFields, responseText, statusText, salesProjectId, type ClosureRole, type ClosureAction, type OfferResponse } from "./post-project-data";
import { OutcomeEditor } from "./outcome-editor";
import { projectCancelled } from "./closure-data";

function Details({ items }: { items: Record<string,string> }) {
  return <dl className="grid gap-4 sm:grid-cols-2">{Object.entries(items).map(([label,value]) => <SMEDetail key={label} label={label}>{value || "Not recorded"}</SMEDetail>)}</dl>;
}
function displayFields<K extends string>(labels: Record<K,string>, values: Record<K,string>) {
  return Object.fromEntries((Object.keys(labels) as K[]).filter(key => values[key]).map(key => [labels[key], values[key]]));
}
function Shell({role,children,student}: {role: ClosureRole; children:ReactNode; student:string}) {
  if (role==="admin") return <AdminShell title="Project Closure Review" activeItem="Active Projects">{children}</AdminShell>;
  if (role==="sme") return <SMEDashboardShell title="Project Closure" activeItem="Projects" subtitle="Review the completed project, confirm the outcome and provide final student feedback.">{children}</SMEDashboardShell>;
  return <DashboardShell title="Project Closure" studentName={student} subtitle="Review your project, feedback and next steps.">{children}</DashboardShell>;
}
export function ProjectClosure({projectId,role}: {projectId:string;role:ClosureRole}) {
  const {progress,dispatch} = useDemoProgress();
  const {records,dispatch:manage} = useSMEWorkspaces();
  const {profile} = useSME();
  const {draft} = useSMEProjectDraft();
  const [ack,setAck] = useState(false);
  const [preview,setPreview] = useState(false);
  const sales = projectId === salesProjectId;
  const managed = records[projectId];
  const experience = mockVerifiedExperiences[0];
  if (!sales && !managed) return <Shell role={role} student=""><SMECard title="Project unavailable">This project has no demo record.</SMECard></Shell>;
  const accepted = sales ? progress.projectCompletion.smeApproved : managed.status === "completed";
  const submitted = sales ? progress.projectCompletion.finalSubmitted : accepted;
  const record = (sales ? progress.projectClosure : managed.projectClosure) ?? emptyClosure(accepted);
  const reviewing = accepted && ["closure_not_started","sme_review_pending"].includes(record.status);
  const closed = record.status === "closure_completed";
  const title = sales ? experience.project : managed.title;
  const student = sales ? experience.student : managed.student;
  const company = profile.companyName;
  const supervisor = organisationSupervisor(profile).name;
  const dates = sales ? experience.dates.start + " – " + experience.dates.end : "Dates not recorded";
  const duration = sales ? experience.duration : managed.totalWeeks + " weeks";
  const workload = sales ? experience.workload : "Not recorded";
  const deliverables = sales ? progress.submission.deliverables.map(item=>({title:item.title,file:submitted ? item.file : null, reviewed:progress.finalSMEReview.reviewedDeliverableIds.includes(item.id)})) : managed.files.map(file=>({title:file.name,file:file.name,reviewed:accepted}));
  const reviewed = sales ? submitted && deliverables.length > 0 && deliverables.every(item=>item.reviewed) : accepted;
  const milestones = sales ? mockMilestones.filter((_,i)=>milestoneTaskIds[i].every(id=>progress.workspaceTasks.some(task=>task.id===id && task.status==="Completed"))).map(m=>m.title) : managed.milestones.filter(m=>m.taskIds.every(id=>managed.tasks.some(t=>t.id===id && t.status==="Completed"))).map(m=>m.title);
  const contribution = sales ? submitted ? progress.submission.individualContribution : "" : managed.updates.at(-1)?.text ?? "";
  const assessment = sales ? progress.finalSMEReview.feedback.general : managed.feedback.at(-1) ?? "";
  const revision = sales && progress.projectCompletion.changesRequested;
  const delivery = accepted ? "Accepted" : record.unmetCriteria || revision ? "Not Accepted" : submitted ? "Awaiting SME Review" : "Awaiting Final Submission";
  const capability = !sales ? "Independent review not recorded" : progress.cancellation.partialApproved ? "Partial Experience Approved" : progress.verifiedExperience ? "Verified Experience Approved" : progress.capabilityReview.status==="not_approved" ? "Verification Not Approved" : progress.capabilityReview.status==="clarification_requested" ? "Further Evidence Required" : "Pending independent review";
  const evidence = {"Project Name":title,"SME Name":company,"Student Name":student,"Project Dates":dates,"Agreed Workload":workload,"Reviewed Deliverables":deliverables.filter(d=>d.reviewed).map(d=>d.title).join(", "),"Student Contribution":contribution,"SME Feedback":record.feedback || assessment,"Closure Status":statusText[record.status],"Reviewer Status":capability};
  const checks = closureChecklist(record,reviewed,accepted);
  const send = (action: ClosureAction) => sales ? dispatch({type:"closure",projectId,action}) : manage({type:"closure",projectId,action});
  function exportEvidence() {
    const text = ["EzraTech demo completion summary", ...Object.entries(evidence).map(([label,value])=>label+": "+value), "Simulated work record. Capability verification requires independent review."].join("\n\n");
    const url = URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));
    const link = document.createElement("a"); link.href=url; link.download=projectId+"-demo-completion.txt"; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <Shell role={role} student={student}>
    <SMECard title={title} action={<span className={closed ? "text-green-700" : "text-amber-800"}>{closed ? "Closed" : "Closure Pending"}</span>}>
      <Details items={{Company:company,Student:student,Supervisor:supervisor,Duration:duration,"Project Completion Status":accepted ? "Final Review Completed" : delivery,"Closure Status":statusText[record.status]}}/>
    </SMECard>
    <SMECard title="Closure Checklist" action={<span className="text-sm text-muted">{Object.values(checks).filter(Boolean).length} of 7 completed</span>}><ul className="divide-y divide-border">{Object.entries(checks).map(([label,done])=><li key={label} className="flex justify-between gap-4 py-2 text-sm">{label}<span className={done ? "text-green-700" : "text-muted"}>{done ? "Completed" : "Pending"}</span></li>)}</ul></SMECard>
    <SMECard title="Final Project Summary"><Details items={{"Project objectives":sales ? draft.objectives.join(" · ") : managed.tasks.map(t=>t.title).join(" · "),"Completed milestones":milestones.join(" · ") || "None recorded","Individual Contribution":contribution,"Final submission":sales ? submitted ? progress.submission.summary : "Pending" : managed.updates.at(-1)?.text ?? "Pending","SME assessment":accepted || revision ? assessment : "Pending","Outstanding matters":record.unmetCriteria || (revision ? progress.finalSMEReview.changeRequest?.text : "") || (sales ? "" : managed.issues.map(i=>i.title).join(" · ")) || "None recorded"}}/>
      <h3 className="mb-2 mt-5 font-semibold">Agreed Deliverables</h3><ul className="space-y-2">{deliverables.map(item=><li key={item.title} className="text-sm">{item.title} · {delivery}{item.file && <span className="block break-all text-xs text-muted">{item.file}</span>}</li>)}</ul>
    </SMECard>
    {!accepted && sales && submitted && role==="sme" && !projectCancelled(progress) && <SMECard title="Deliverables not accepted">
      <SMEAction href={`/sme/workspace/${projectId}/review`}>Review Work or Request Revisions</SMEAction>
      {record.status!=="admin_review_required" && <form className="mt-4 space-y-3" onSubmit={e=>{e.preventDefault();send({kind:(e.nativeEvent as SubmitEvent).submitter?.getAttribute("value")==="review" ? "requestReview" : "criteria",reason:String(new FormData(e.currentTarget).get("reason"))});}}><label className="grid gap-2 text-sm">Record Unmet Criteria<textarea required name="reason" className={inputClass} defaultValue={record.unmetCriteria}/></label><p className="text-xs text-muted">Closing without accepted deliverables requires independent Admin review.</p><div className="flex flex-wrap gap-2"><button className={secondaryButton} value="criteria">Record Unmet Criteria</button><button className={primaryButton} value="review">Request EzraTech Review</button></div></form>}
    </SMECard>}
    {sales && accepted && !reviewed && role==="sme" && <SMECard title="Review remaining deliverables"><p className="mb-3 text-sm">The saved acceptance record has outstanding deliverable reviews.</p>{progress.submission.deliverables.filter(d=>d.file && !progress.finalSMEReview.reviewedDeliverableIds.includes(d.id)).map(d=><button key={d.id} className={secondaryButton} onClick={()=>dispatch({type:"markFinalDeliverableReviewed",id:d.id})}>Confirm review of {d.title}</button>)}</SMECard>}
    <SMECard title="Final SME Feedback">{role==="sme" && reviewing ? <form className="space-y-3" onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);send({kind:"feedback",text:String(f.get("text")),materialsReviewed:f.has("materials"),contributionReviewed:f.has("contribution")});}}>
      <label className="grid gap-2 text-sm">Feedback for the student<textarea name="text" required defaultValue={record.feedback || assessment} className={inputClass}/></label>
      <label className="block text-sm"><input type="checkbox" name="contribution" defaultChecked={record.contributionReviewed}/> I reviewed the student’s individual contribution.</label>
      <label className="block text-sm"><input type="checkbox" name="materials" defaultChecked={record.materialsReviewed}/> I reviewed the required project materials.</label><button className={secondaryButton}>Save Final Feedback</button>
    </form> : <p className="text-sm">{record.feedback || record.unmetCriteria || "Awaiting final closure feedback."}</p>}</SMECard>
    {reviewing && role==="sme" && <OutcomeEditor record={record} send={send} reviewed={reviewed} title={title} student={student}/>}
    <SMECard title="Recorded Post-Project Outcome"><div className="space-y-4">
      {!record.offer && !record.opportunityFeedback && <p className="text-sm">Employment outcome · No offer recorded</p>}
      {record.offer && <section><h3 className="mb-3 font-semibold">{role==="student" ? "Employment Opportunity" : "Employment Offer Recorded"}</h3><Details items={{Company:company,...displayFields(offerFields,record.offer),"Offer Status":record.offerResponse ? responseText[record.offerResponse] : role==="student" ? "Offer Received (Demo)" : "Pending Student Response"}}/><p className="my-3 text-xs text-muted">Private demo invitation. Expressing interest creates no binding employment agreement.</p>{role==="student" && <div className="flex flex-wrap gap-2">{(Object.keys(responseText) as OfferResponse[]).map(value=><button key={value} className={secondaryButton} disabled={record.offerResponse===value} onClick={()=>send({kind:"response",value})}>{value==="declined" ? "Decline" : responseText[value]}</button>)}</div>}</section>}
      {record.opportunityFeedback && <section><h3 className="mb-2 font-semibold">No Further Employment Opportunity</h3><Details items={displayFields(opportunityFields,record.opportunityFeedback)}/></section>}
      {record.recommendation && <section><h3 className="mb-2 font-semibold">Recommendation Submitted</h3><Details items={displayFields(recommendationFields,record.recommendation)}/><p className="my-3 text-sm">{record.recommendationApproved ? "Approved for portfolio use" : "Awaiting Portfolio Approval"}</p>{role==="admin" && closed && !record.recommendationApproved && <button className={secondaryButton} onClick={()=>send({kind:"approveRecommendation"})}>Approve Recommendation for Portfolio</button>}</section>}
      {record.completionEvidenceAvailable && <p>Completion evidence recorded</p>}
      {!checks["Project Outcome Recorded"] && <p className="text-sm text-muted">Awaiting SME outcome.</p>}
    </div></SMECard>
    <SMECard title="Project Completion Evidence">{record.completionEvidenceAvailable ? <><Details items={evidence}/><div className="mt-4 flex flex-wrap gap-3"><button className={secondaryButton} onClick={()=>setPreview(true)}>Preview Completion Summary</button><button className={secondaryButton} onClick={exportEvidence}>Export Demo Evidence Summary</button></div></> : <p className="text-sm text-muted">Completion evidence has not been recorded.</p>}</SMECard>
    {(reviewing || record.status==="sme_closure_completed") && role==="sme" && <SMECard title="Project Closure Confirmation"><div className="space-y-4">
      <label className="flex gap-2 text-sm"><input type="checkbox" checked={record.status==="sme_closure_completed"} disabled={!canSubmitClosure(record,reviewed,accepted)} onChange={e=>send({kind:e.target.checked ? "confirm" : "edit"})}/> I confirm that the closure summary, feedback and outcome are ready for the student.</label>
      <button className={primaryButton} disabled={record.status!=="sme_closure_completed"} onClick={()=>send({kind:"submit"})}>Complete Project Closure</button></div></SMECard>}
    <SMECard title="Confirm Project Closure">{role==="student" && record.status==="student_acknowledgement_pending" ? <div className="space-y-4"><label className="block text-sm"><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/> I have reviewed the project closure summary and feedback.</label><p className="text-xs text-muted">Acknowledgement confirms receipt. You may still request clarification or challenge an assessment.</p><button disabled={!ack} className={primaryButton} onClick={()=>send({kind:"acknowledge"})}>Acknowledge Project Closure</button></div> : <p className="text-sm">Student acknowledgement · {closed ? "Completed" : "Pending"}</p>}
      {role==="student" && record.history.length>0 && <form className="my-4 space-y-2" onSubmit={e=>{e.preventDefault();send({kind:"clarification",reason:String(new FormData(e.currentTarget).get("question"))});e.currentTarget.reset();}}><label className="grid gap-2 text-sm">Question about your closure summary<textarea name="question" className={inputClass} required/></label><button className={secondaryButton}>Request Clarification</button></form>}
      {role==="student" && sales && <SMEAction href="/student/assessment/dispute">Challenge an Assessment Decision</SMEAction>}
    </SMECard>
    {role==="admin" && record.status==="admin_review_required" && <SMECard title="Review Closure Without Accepted Deliverables"><p className="mb-3">{record.unmetCriteria}</p><div className="flex flex-wrap gap-2"><button className={secondaryButton} onClick={()=>send({kind:"reviewException",approve:false})}>Return for Revisions</button><button className={primaryButton} onClick={()=>send({kind:"reviewException",approve:true})}>Approve Closure Without Acceptance</button></div></SMECard>}
    <SMECard title="Capability Verification Status"><p className="mb-3 text-sm">{capability}. Completion evidence records the work performed. Capability verification requires an independent evidence review.</p>{role==="admin" && sales && closed && <SMEAction primary href={capabilityRoute}>Open Capability Review</SMEAction>}</SMECard>
    <SMECard title="Closure History">{record.history.length ? <ol className="list-inside list-decimal space-y-2 text-sm">{record.history.map((text,i)=><li key={i}>{text}</li>)}</ol> : <p className="text-sm text-muted">No closure actions recorded.</p>}</SMECard>
    <details className="rounded-lg border border-border bg-white p-4"><summary className="cursor-pointer text-sm font-semibold">Demo role views</summary><div className="mt-3 flex flex-wrap gap-2">{(["sme","student","admin"] as const).filter(other=>other!==role).map(other=><SMEAction key={other} href={`/${other}/projects/${projectId}/closure`}>{other==="sme" ? "SME" : other==="admin" ? "Admin" : "Student"} closure view</SMEAction>)}</div></details>
    {preview && <WorkspaceDialog title="Demo Completion Summary" onClose={()=>setPreview(false)}><Details items={evidence}/></WorkspaceDialog>}
  </Shell>;
}
