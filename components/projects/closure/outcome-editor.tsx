import { useState, type FormEvent } from "react";
import { SMECard } from "@/components/sme/dashboard-ui";
import { primaryButton, inputClass } from "@/components/student/workspace/workspace-ui";
import { offerFields, recommendationFields, opportunityFields, type ClosureAction, type ClosureRecord, type Offer, type Recommendation, type OpportunityFeedback } from "./post-project-data";

function values<T>(event: FormEvent<HTMLFormElement>): T {
  event.preventDefault();
  return Object.fromEntries(new FormData(event.currentTarget)) as T;
}
function Fields({ labels, saved }: { labels: Record<string,string>; saved?: Record<string,string> | null }) {
  return <div className="grid gap-4 sm:grid-cols-2">{Object.entries(labels).map(([key,label]) =>
    <label key={key} className="grid gap-2 text-sm font-medium">{label}
      {key === "employmentType" ? <select aria-label={label} className={inputClass} name={key} defaultValue={saved?.[key] ?? ""} required><option value="">Select employment type</option>{["Full-time","Part-time","Fixed-term","Other"].map(type => <option key={type}>{type}</option>)}</select>
      : ["title","location","pay","start"].includes(key) ? <input className={inputClass} type={key === "start" ? "date" : "text"} name={key} defaultValue={saved?.[key]} required={key !== "pay"} />
      : <textarea className={inputClass} name={key} rows={2} defaultValue={saved?.[key]} required />}
    </label>)}</div>;
}
export function OutcomeEditor({ record, send, reviewed, student, title }: { record: ClosureRecord; send: (action: ClosureAction) => void; reviewed: boolean; student: string; title: string }) {
  const [choice, setChoice] = useState("");
  return <SMECard title="Post-Project Outcome"><label className="grid gap-2 text-sm font-medium">Choose an outcome to record<select className={inputClass} value={choice} onChange={e => setChoice(e.target.value)}><option value="">Select an outcome</option>{["Employment Offer","Recommendation","Completion Evidence Only","No Further Opportunity"].map(item => <option key={item}>{item}</option>)}</select></label>
    <p className="my-3 text-xs text-muted">You can add completion evidence and a recommendation alongside either employment decision.</p>
    {choice === "Employment Offer" && <form className="space-y-4" onSubmit={e => send({ kind:"offer", offer:values<Offer>(e) })}><h3 className="font-semibold">Employment Offer (Demo)</h3><p className="text-sm text-muted">This simulated invitation creates no employment contract.</p><Fields labels={offerFields} saved={record.offer}/><button className={primaryButton}>Record Demo Employment Offer</button></form>}
    {choice === "Recommendation" && <form className="space-y-4" onSubmit={e => send({ kind:"recommendation", recommendation:values<Recommendation>(e) })}><h3 className="font-semibold">Recommendation Form</h3><p>{student} · {title}</p><Fields labels={recommendationFields} saved={record.recommendation}/><button className={primaryButton}>Save Recommendation</button></form>}
    {choice === "No Further Opportunity" && <form className="space-y-4" onSubmit={e => send({ kind:"noOpportunity", feedback:values<OpportunityFeedback>(e) })}><h3 className="font-semibold">No Further Employment Opportunity</h3><p className="text-sm">The company is not offering employment following this project.</p><Fields labels={opportunityFields} saved={record.opportunityFeedback}/><button className={primaryButton}>Record Employment Outcome</button></form>}
    {choice === "Completion Evidence Only" && <button className={primaryButton} disabled={!reviewed || record.completionEvidenceAvailable} onClick={() => send({kind:"evidence"})}>{record.completionEvidenceAvailable ? "Completion Evidence Recorded" : "Record Completion Evidence"}</button>}
  </SMECard>;
}
