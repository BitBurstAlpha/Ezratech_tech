"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/forms/form-field";
import { Icon } from "@/components/landing/icon";
import { Choice, SelectField, TextareaField } from "./controls";
import { StepProgress } from "./step-progress";
import { blankExperience, descriptions, experienceTypes, goals, headings, roles, skillGroups, statuses, steps, studyLevels, type Experience } from "./options";

import { useDemoProgress } from "../progress/demo-progress";

const initialProfile = { firstName: "", lastName: "", status: "", city: "", country: "", linkedIn: "", institution: "", degree: "", subject: "", level: "", startYear: "", graduationYear: "", studying: false, roles: [] as string[], goal: "", goalDetails: "", hasExperience: "" as "" | "yes" | "no", skills: [] as string[], otherSkill: "" };
export function OnboardingForm() {
  const router = useRouter();
  const { dispatch } = useDemoProgress();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(initialProfile);
  const [experiences, setExperiences] = useState<Experience[]>([blankExperience(1)]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const nextExperienceId = useRef(2);
  const previousStep = useRef(0);

  useEffect(() => {
    if (step !== previousStep.current) { heading.current?.focus(); previousStep.current = step; }
  }, [step]);
  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 3500);
    return () => clearTimeout(timer);
  }, [saved, saveCount]);

  function update<K extends keyof typeof initialProfile>(key: K, value: typeof initialProfile[K]) { setProfile(current => ({ ...current, [key]: value })); setError(""); }
  function toggle(key: "roles" | "skills", value: string) { setProfile(current => ({ ...current, [key]: current[key].includes(value) ? current[key].filter(item => item !== value) : [...current[key], value] })); setError(""); }
  function updateExperience(id: number, key: keyof Omit<Experience, "id">, value: string) { setExperiences(current => current.map(item => item.id === id ? { ...item, [key]: value } : item)); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1 && Number(profile.graduationYear) < Number(profile.startYear)) { setError("Graduation year must be the same as or later than your start year."); return; }
    if (step === 2 && (!profile.roles.length || !profile.goal)) { setError("Choose at least one role and your main goal to continue."); return; }
    if (step === 3 && !profile.hasExperience) { setError("Please choose Yes or No to continue."); return; }
    setError("");
    if (step === 4) { dispatch({ type: "completeOnboarding" }); router.push("/student/dashboard"); return; }
    setStep(current => current + 1);
  }
  function back() { setError(""); setStep(current => Math.max(0, current - 1)); }
  const textField = (key: keyof typeof initialProfile, label: string, required = true, type = "text") => <FormField id={key} label={label} type={type} required={required} value={String(profile[key])} onChange={event => update(key, event.target.value)} />;
  return <>
    <StepProgress currentStep={step} />
    <section aria-labelledby="onboarding-heading" className="rounded-xl border border-border bg-white p-6 shadow-[0_3px_20px_rgba(51,52,56,0.04)] sm:p-9">
      <div className="mb-8"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary">Step {step + 1} of 5 · {steps[step]}</p><h1 id="onboarding-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold leading-tight tracking-tight focus:outline-none sm:text-3xl">{headings[step]}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">{descriptions[step]}</p></div>
      <form onSubmit={submit}>
        {step === 0 && <div className="space-y-6"><div className="grid gap-5 sm:grid-cols-2">{textField("firstName", "First Name")}{textField("lastName", "Last Name")}</div><SelectField id="status" label="Current Status" options={statuses} required value={profile.status} onChange={event => update("status", event.target.value)} /><fieldset><legend className="mb-3 text-sm font-semibold">Location</legend><div className="grid gap-5 sm:grid-cols-2">{textField("city", "City")}{textField("country", "Country")}</div></fieldset>{textField("linkedIn", "LinkedIn Profile URL (optional)", false, "url")}</div>}
        {step === 1 && <div className="space-y-6">{textField("institution", "University / Institution")}{textField("degree", "Degree or Qualification")}{textField("subject", "Subject / Course")}<SelectField id="level" label="Study Level" options={studyLevels} required value={profile.level} onChange={event => update("level", event.target.value)} /><div className="grid gap-5 sm:grid-cols-2"><FormField id="startYear" label="Start Year" type="number" min={1900} max={2100} required value={profile.startYear} onChange={event => update("startYear", event.target.value)} /><FormField id="graduationYear" label="Graduation Year / Expected Graduation Year" type="number" min={1900} max={2100} required value={profile.graduationYear} onChange={event => update("graduationYear", event.target.value)} /></div><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={profile.studying} onChange={event => update("studying", event.target.checked)} className="h-4 w-4 accent-primary" />I am currently studying</label></div>}
        {step === 2 && <div className="space-y-7"><fieldset><legend className="mb-2 text-base font-semibold">What type of role are you interested in?</legend><p className="mb-4 text-xs text-muted">Select all that apply.</p><div className="grid gap-3 sm:grid-cols-2">{roles.map(role => <Choice key={role} label={role} selected={profile.roles.includes(role)} onChange={() => toggle("roles", role)} />)}</div></fieldset><fieldset><legend className="mb-4 text-base font-semibold">What is your main goal right now?</legend><div className="grid gap-3 sm:grid-cols-2">{goals.map(goal => <Choice key={goal} type="radio" name="main-goal" label={goal} selected={profile.goal === goal} onChange={() => update("goal", goal)} />)}</div></fieldset><TextareaField id="goalDetails" label="Tell us more about your career goals (optional)" value={profile.goalDetails} onChange={event => update("goalDetails", event.target.value)} /></div>}
        {step === 3 && <div className="space-y-6"><fieldset><legend className="mb-4 text-base font-semibold leading-7">Do you have previous work, internship, freelance, volunteering, or project experience?</legend><div className="grid max-w-xs grid-cols-2 gap-3">{(["yes", "no"] as const).map(value => <Choice key={value} type="radio" name="has-experience" label={value === "yes" ? "Yes" : "No"} selected={profile.hasExperience === value} onChange={() => update("hasExperience", value)} />)}</div></fieldset>{profile.hasExperience === "no" && <p className="rounded-lg bg-blue-light p-4 text-sm leading-6 text-muted">That’s okay. EzraTech will help you start building practical experience through learning and projects.</p>}{profile.hasExperience === "yes" && <div className="space-y-5">{experiences.map((experience, index) => <fieldset key={experience.id} className="rounded-xl border border-border bg-section p-5"><legend className="px-2 text-sm font-semibold">Experience {index + 1}</legend><div className="space-y-5"><SelectField id={`experience-type-${experience.id}`} label="Experience Type" options={experienceTypes} required value={experience.type} onChange={event => updateExperience(experience.id, "type", event.target.value)} /><FormField id={`experience-title-${experience.id}`} label="Role / Project Title" required value={experience.title} onChange={event => updateExperience(experience.id, "title", event.target.value)} /><FormField id={`experience-organisation-${experience.id}`} label="Organisation" value={experience.organisation} onChange={event => updateExperience(experience.id, "organisation", event.target.value)} /><TextareaField id={`experience-description-${experience.id}`} label="What did you work on?" required value={experience.description} onChange={event => updateExperience(experience.id, "description", event.target.value)} /><FormField id={`experience-skills-${experience.id}`} label="Skills used" value={experience.skills} onChange={event => updateExperience(experience.id, "skills", event.target.value)} />{experiences.length > 1 && <button type="button" onClick={() => setExperiences(current => current.filter(item => item.id !== experience.id))} className="text-sm font-medium text-muted underline underline-offset-4 hover:text-primary" aria-label={`Remove experience ${index + 1}`}>Remove experience</button>}</div></fieldset>)}<button type="button" onClick={() => { const id = nextExperienceId.current++; setExperiences(current => [...current, blankExperience(id)]); }} className="rounded-lg border border-primary/30 px-4 py-3 text-sm font-semibold text-primary hover:bg-blue-light">+ Add another experience</button></div>}</div>}
        {step === 4 && <div className="space-y-7"><p className="text-xs text-muted">Select all that apply. You can continue without selecting skills if you are just getting started.</p>{skillGroups.map(group => <fieldset key={group.title}><legend className="mb-4 text-base font-semibold">{group.title}</legend><div className="flex flex-wrap gap-2.5">{group.skills.map(skill => <button key={skill} type="button" aria-pressed={profile.skills.includes(skill)} onClick={() => toggle("skills", skill)} className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${profile.skills.includes(skill) ? "border-primary bg-blue-light font-medium text-primary" : "border-border bg-white text-muted hover:border-primary/50"}`}>{profile.skills.includes(skill) && <span aria-hidden="true">✓</span>}{skill}</button>)}</div></fieldset>)}{textField("otherSkill", "Other skill (optional)", false)}</div>}
        {error && <p role="alert" className="mt-6 rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm text-ink">{error}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"><div>{step > 0 && <button type="button" onClick={back} className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:bg-section"><Icon name="arrow" className="h-4 w-4 rotate-180" />Back</button>}</div><button type="submit" className="inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover">{step === 4 ? "Complete Profile" : "Continue"}<Icon name="arrow" className="h-4 w-4" /></button></div>
      </form>
    </section>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1"><button type="button" onClick={() => { setSaved(true); setSaveCount(current => current + 1); }} className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:text-primary-hover">Save and continue later</button><p className="text-xs text-muted">Your profile is the first step. Assessment comes next.</p></div>
    <div role="status" aria-live="polite" className={saved ? "fixed bottom-6 left-1/2 z-50 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-lg border border-border bg-white px-5 py-4 text-sm font-medium shadow-lg" : "sr-only"}>{saved && <><span aria-hidden="true" className="text-primary">✓</span>Progress saved for demo</>}</div>
  </>;
}
