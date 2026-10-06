"use client";
import { useSME } from "../sme-state";
import { CompanyContext } from "../profile/company-context";
import { companyProfileComplete, organisationContact } from "../profile/profile-data";
import { SMEAction } from "../dashboard-ui";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SMEDashboardShell } from "../dashboard-shell";
import { smePrimary, smeSecondary } from "../sme-shell";
import { projectConfirmations, projectSteps, validateProjectStep, type ProjectDraft } from "./project-data";
import { useSMEProjectDraft } from "./project-state";
import { ProjectBasics, ProjectBusinessProblem, ProjectDataConfidentiality, ProjectDeliverables, ProjectDelivery } from "./project-steps";
import { ProjectReview } from "./project-review";
import { ProjectSubmitted } from "./project-submitted";
const headings = ["Project Basics", "Business Problem", "Deliverables & Skills", "Project Delivery Setup", "Data & Confidentiality", "Review Your Project"];
const stepComponents = [ProjectBasics, ProjectBusinessProblem, ProjectDeliverables, ProjectDelivery, ProjectDataConfidentiality];

export function SMEProjectCreation() {
  const { profile } = useSME();
  const profileComplete = companyProfileComplete(profile);
  const { draft, updateDraft, saveDraft } = useSMEProjectDraft();
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [editingReview, setEditingReview] = useState(false);
  const [confirmations, setConfirmations] = useState<string[]>([]);
  const [phase, setPhase] = useState<"editing" | "submitting" | "submitted">(draft.status === "under-review" ? "submitted" : "editing");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  const previousPhase = useRef(phase);
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (submitTimer.current) clearTimeout(submitTimer.current); if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  useEffect(() => {
    if (previousStep.current !== step || previousPhase.current !== phase) {
      heading.current?.focus(); previousStep.current = step; previousPhase.current = phase;
    }
  }, [step, phase]);
  function update(patch: Partial<ProjectDraft>) { updateDraft({ ...patch, status: "draft" }); setError(""); }
  function navigate(next: number) { setError(""); setStep(next); setFurthestStep(current => Math.max(current, next)); }
  function save() {
    saveDraft(); setToast("Project saved as draft for demo.");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 5000);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase !== "editing") return;
    if (step < 5) {
      const issue = validateProjectStep(draft, step);
      if (issue) { setError(issue); return; }
      navigate(editingReview ? 5 : step + 1); setEditingReview(false); return;
    }
    if (!profileComplete) { setError("Profile completion required. Complete essential company and supervisor information before submitting."); return; }
    for (let index = 0; index < 5; index++) {
      const issue = validateProjectStep(draft, index);
      if (issue) { setEditingReview(true); navigate(index); setError(issue); return; }
    }
    if (!projectConfirmations.every(item => confirmations.includes(item))) { setError("Confirm all three statements before submitting your project for review."); return; }
    setPhase("submitting"); setToast("");
    submitTimer.current = setTimeout(() => { updateDraft({ status: "under-review" }); setPhase("submitted"); }, 1200);
  }
  const StepComponent = stepComponents[step];
  return <SMEDashboardShell activeItem="Projects" title="Create a New Project" subtitle="Define a clear business project for EzraTech review.">
    <div className="flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center gap-2 rounded-full bg-blue-light px-3 py-1.5 text-xs font-semibold text-primary"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />SME Project Submission</span><span className="text-xs text-muted">{profile.companyName} · {organisationContact(profile)}</span></div>
    <CompanyContext />
    {!profileComplete && <section className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h2 className="text-sm font-semibold">Profile completion required</h2><p className="my-3 text-sm">Complete essential company and supervisor information before project submission.</p><SMEAction href="/sme/profile">Complete Profile</SMEAction></section>}
    <p className="rounded-lg border border-amber-200/70 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-amber-900">Your project will not be visible to students until it has been reviewed and approved.</p>
    {phase === "submitted" ? <><h2 ref={heading} tabIndex={-1} className="sr-only">Project Submitted</h2><ProjectSubmitted draft={draft} /></> : <>
      <nav aria-label="Project creation progress"><ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{projectSteps.map((label, index) => {
        const complete = index < step && !validateProjectStep(draft, index);
        return <li key={label}><button type="button" disabled={index > furthestStep || phase === "submitting"} aria-current={index === step ? "step" : undefined} onClick={() => { setEditingReview(false); navigate(index); }} className={`flex h-full w-full gap-2 rounded-lg border p-3 text-left text-xs disabled:cursor-default ${index === step ? "border-primary bg-blue-light text-primary" : complete ? "border-green-100 bg-green-50/50 text-green-700" : "border-border bg-white text-muted"}`}><span aria-hidden="true" className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${index === step ? "bg-primary text-white" : complete ? "bg-green-100 text-green-700" : "bg-section"}`}>{complete ? "✓" : index + 1}</span><span>Step {index + 1}<span className="mt-1 block font-semibold leading-5">{label}</span></span></button></li>;
      })}</ol></nav>
      <section className="mx-auto max-w-4xl rounded-xl border border-border bg-white p-5 shadow-[0_3px_20px_rgba(51,52,56,0.04)] sm:p-8"><div className="mb-6 flex flex-wrap items-start justify-between gap-3"><div><p className="mb-2 text-xs font-medium text-muted">Step {step + 1} of 6</p><h2 ref={heading} tabIndex={-1} className="text-2xl font-semibold tracking-tight">{headings[step]}</h2></div><span className="rounded-full bg-section px-3 py-1 text-xs text-muted">Draft</span></div>
        <form onSubmit={submit} aria-busy={phase === "submitting"} className="space-y-7"><fieldset disabled={phase === "submitting"} className="min-w-0 space-y-7">
          {step < 5 ? <StepComponent draft={draft} update={update} /> : <><ProjectReview draft={draft} onEdit={index => { setEditingReview(true); navigate(index); }} /><fieldset className="space-y-4"><legend className="mb-4 text-base font-semibold">Final Confirmation</legend>{projectConfirmations.map(item => <label key={item} className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" required checked={confirmations.includes(item)} onChange={() => { setConfirmations(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item]); setError(""); }} className="mt-1 h-4 w-4 shrink-0 accent-primary" />{item}</label>)}</fieldset></>}
          {error && <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6"><div className="flex flex-wrap gap-3">{step > 0 && <button type="button" onClick={() => { setEditingReview(false); navigate(step - 1); }} className={smeSecondary}>Back</button>}<button type="button" onClick={save} className={smeSecondary}>{step === 5 ? "Save as Draft" : "Save Draft"}</button></div><button type="submit" className={smePrimary}>{phase === "submitting" ? "Submitting project..." : step === 5 ? "Submit for EzraTech Review" : editingReview ? "Return to Review" : "Continue"}</button></div>
        </fieldset>{phase === "submitting" && <p role="status" className="text-sm font-medium text-primary">Submitting project...</p>}</form>
      </section>
    </>}
    <footer className="flex flex-wrap gap-x-3 gap-y-1 text-xs leading-6 text-muted"><span className="font-medium">Prototype Demo</span><p>Project submission, review and approval shown here use simulated data.</p><p className="w-full">Demo draft details stay in front-end state until you refresh.</p></footer>
    {toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-xl border border-border bg-white p-4 text-sm shadow-lg"><span>{toast}</span><button type="button" aria-label="Dismiss draft notification" onClick={() => setToast("")} className="text-xs font-semibold text-primary">Dismiss</button></div>}
  </SMEDashboardShell>;
}
