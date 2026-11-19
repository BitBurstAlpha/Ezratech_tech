import { useState } from "react";
import { CandidateModal } from "../candidates/candidate-ui";
import { SMECard, SMEDetail } from "../dashboard-ui";
import { smePrimary, smeSecondary } from "../sme-shell";

export function StartProject({ checks, title, student, supervisor, duration, onStart }: {
  checks: boolean[]; title: string; student: string; supervisor: string; duration: string; onStart: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const count = checks.filter(Boolean).length;
  const ready = count === checks.length;
  return <SMECard title="Project Initiation Progress" action={<span className={ready ? "text-sm font-semibold text-green-700" : "text-sm font-semibold text-primary"}>{ready ? "Ready to Start" : "Initiation In Progress"}</span>}>
    <p role="status" className="text-sm">{count} of {checks.length} confirmations completed</p>
    <progress aria-label="Project Initiation Progress" max={checks.length} value={count} className="my-4 h-2 w-full accent-primary" />
    <div><button type="button" className={smePrimary} disabled={!ready} onClick={() => setConfirming(true)}>Start Project</button></div>
    {!ready && <p className="mt-3 text-sm text-muted">Complete all required confirmations before starting this project.</p>}
    {confirming && ready && <CandidateModal title={`Start ${title}?`} onDismiss={() => setConfirming(false)}>
      <p className="text-sm">All required project initiation checks have been completed.</p>
      <p className="mt-2 text-sm text-muted">Starting this project will activate the workspace for the student and SME.</p>
      <dl className="my-5 grid gap-4 sm:grid-cols-3"><SMEDetail label="Student">{student}</SMEDetail><SMEDetail label="Supervisor">{supervisor}</SMEDetail><SMEDetail label="Project Duration">{duration}</SMEDetail></dl>
      <div className="flex flex-wrap justify-end gap-2"><button type="button" className={smeSecondary} onClick={() => setConfirming(false)}>Cancel</button><button type="button" className={smePrimary} onClick={() => { setConfirming(false); onStart(); }}>Confirm &amp; Start Project</button></div>
    </CandidateModal>}
  </SMECard>;
}
