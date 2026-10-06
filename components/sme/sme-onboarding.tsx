"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSME } from "./sme-state";
import { smeSteps, setupConfirmations, validateSMEStep, type SMEProfile } from "./sme-data";
import { smePrimary, smeSecondary } from "./sme-shell";
import { OrganisationStep, ContactStep, BusinessNeedsStep, CapacityStep } from "./onboarding-steps";
import { OnboardingReview } from "./onboarding-review";
const headings = ["Tell us about your organisation", "Primary company contact", "How would you like to use EzraTech?", "Project Capacity", "Review Your SME Profile"];
export function SMEOnboarding() {
  const { profile, onboarding, updateProfile, setStep, setConfirmations, completeSetup } = useSME();
  const router = useRouter();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(onboarding.step);
  const step = onboarding.step;
  useEffect(() => { if (previousStep.current !== step) { heading.current?.focus(); previousStep.current = step; } }, [step]);
  function update(patch: Partial<SMEProfile>) { updateProfile(patch); setError(""); }
  function navigate(next: number) { setError(""); setStep(next); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 4) { const issue = validateSMEStep(profile, step); if (issue) { setError(issue); return; } navigate(editing ? 4 : step + 1); setEditing(false); return; }
    for (let index = 0; index < 4; index++) { const issue = validateSMEStep(profile, index); if (issue) { setStep(index); setError(issue); return; } }
    if (!completeSetup()) { setError("Confirm all three statements before completing SME setup."); return; }
    router.push("/sme/dashboard");
  }
  return <div className="mx-auto max-w-4xl"><div className="mb-7"><span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />For SMEs</span><h1 className="mt-3 text-3xl font-semibold tracking-tight">Set up your SME profile</h1><p className="mt-3 text-sm leading-7 text-muted">Introduce your organisation and tell us how you could support a student project.</p></div><nav aria-label="SME setup progress" className="mb-7"><ol className="grid grid-cols-2 gap-3 sm:grid-cols-5">{smeSteps.map((item, index) => <li key={item} aria-current={index === step ? "step" : undefined} className={`flex gap-2 rounded-lg border p-3 text-xs ${index === step ? "border-primary bg-blue-light text-primary" : "border-border bg-white text-muted"}`}><span aria-hidden="true" className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${index === step ? "bg-primary text-white" : "bg-section text-primary"}`}>{index < step ? "✓" : index + 1}</span><span>Step {index + 1}<span className="mt-1 block font-semibold">{item}</span></span></li>)}</ol></nav><section className="rounded-xl border border-border bg-white p-6 shadow-[0_3px_20px_rgba(51,52,56,0.04)] sm:p-8"><h2 ref={heading} tabIndex={-1} className="mb-6 text-2xl font-semibold tracking-tight">{headings[step]}</h2><form key={step} onSubmit={submit} className="space-y-6">{step === 0 && <OrganisationStep profile={profile} update={update} />}{step === 1 && <ContactStep profile={profile} update={update} />}{step === 2 && <BusinessNeedsStep profile={profile} update={update} />}{step === 3 && <CapacityStep profile={profile} update={update} />}{step === 4 && <><OnboardingReview profile={profile} onEdit={index => { setEditing(true); navigate(index); }} /><fieldset className="space-y-4"><legend className="mb-4 text-base font-semibold">Final Confirmation</legend>{setupConfirmations.map(item => <label key={item} className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" required checked={onboarding.confirmations.includes(item)} onChange={() => { setConfirmations(onboarding.confirmations.includes(item) ? onboarding.confirmations.filter(value => value !== item) : [...onboarding.confirmations, item]); setError(""); }} className="mt-1 h-4 w-4 shrink-0 accent-primary" />{item}</label>)}</fieldset></>}{error && <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{error}</p>}<div className="flex flex-wrap justify-between gap-3 border-t border-border pt-6">{step > 0 ? <button type="button" onClick={() => { setEditing(false); navigate(step - 1); }} className={smeSecondary}>Back</button> : <span /> }<button type="submit" className={smePrimary}>{step === 4 ? "Complete SME Setup" : "Continue"}</button></div></form></section><p className="mt-6 text-xs leading-6 text-muted">Prototype Demo · Organisation details and setup are simulated. No business is verified and no project is approved. Information stays in front-end state until you refresh.</p></div>;
}
