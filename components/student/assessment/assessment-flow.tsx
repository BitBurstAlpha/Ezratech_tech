"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { FormField } from "@/components/forms/form-field";
import { Icon } from "@/components/landing/icon";
import { TextareaField } from "@/components/student/onboarding/controls";
import { assessmentAreas, assessmentQuestions, evidenceQuestion } from "./assessment-data";
import { AssessmentResults } from "./assessment-results";
import { EvidencePicker } from "./evidence-picker";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
const primary = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover";
export function AssessmentFlow() {
  const { dispatch } = useDemoProgress();
  const [stage, setStage] = useState<"intro" | "questions" | "processing" | "results">("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [evidence, setEvidence] = useState({ title: "", description: "", skills: [] as string[] });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const content = useRef<HTMLDivElement>(null);
  const previousStage = useRef("intro-0");
  const question = assessmentQuestions[questionIndex];
  const total = assessmentQuestions.length + 1;
  const progress = Math.round(((questionIndex + 1) / total) * 100);
  useEffect(() => {
    if (stage !== "processing") return;
    const timer = setTimeout(() => { dispatch({ type: "completeAssessment" }); setStage("results"); }, 2000);
    return () => clearTimeout(timer);
  }, [stage, dispatch]);
  useEffect(() => {
    const current = `${stage}-${questionIndex}`;
    if (current !== previousStage.current) { content.current?.focus(); previousStage.current = current; }
  }, [stage, questionIndex]);
  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (question && answers[question.id] === undefined) { setError("Select one answer to continue."); return; }
    if (!question && !file && !evidence.description.trim()) { setError("Choose a file or describe your contribution to continue."); return; }
    setError("");
    if (!question) setStage("processing");
    else setQuestionIndex(current => current + 1);
  }
  function back() { setError(""); setQuestionIndex(current => current - 1); }
  function toggleSkill(skill: string) { setEvidence(current => ({ ...current, skills: current.skills.includes(skill) ? current.skills.filter(value => value !== skill) : [...current.skills, skill] })); }
  return <div ref={content} tabIndex={-1} className="mx-auto max-w-4xl focus:outline-none" aria-label={stage === "questions" ? `Question ${questionIndex + 1} of ${total}` : stage === "results" ? "Assessment Complete" : stage === "processing" ? "Reviewing your assessment" : "Assessment introduction"}>
    {stage === "intro" && <section className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-9"><p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Understand your practical capability</p><h2 className="text-2xl font-semibold">Skills Assessment</h2><p className="mt-4 text-sm leading-7 text-muted sm:text-base">Complete a short practical assessment so EzraTech can understand your current capabilities and identify any areas that may need further development.</p><p className="mt-6 inline-flex items-center gap-2 rounded-lg bg-section px-3 py-2 text-sm text-muted"><Icon name="clock" className="h-4 w-4 text-primary" />Estimated time: 15–20 minutes</p><h3 className="mb-3 mt-7 text-sm font-semibold">Assessment areas</h3><ul className="grid gap-3 sm:grid-cols-2">{assessmentAreas.map(area => <li key={area} className="flex items-center gap-2 text-sm text-muted"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{area}</li>)}</ul><div className="my-7 rounded-lg border border-primary/10 bg-blue-light p-4 text-sm leading-6 text-ink">This assessment is designed to understand your current capabilities. It is not a pass or fail test.</div><div className="flex flex-wrap items-center gap-5"><button type="button" onClick={() => setStage("questions")} className={primary}>Start Assessment<Icon name="arrow" className="h-4 w-4" /></button><Link href="/student/dashboard" className="text-sm font-medium text-primary hover:text-primary-hover">Back to Dashboard</Link></div></section>}
    {stage === "questions" && <><div className="mb-5"><div className="mb-3 flex items-center justify-between gap-3 text-sm"><p className="font-semibold">Question {questionIndex + 1} of {total}</p><span className="text-muted">{progress}% Complete</span></div><div role="progressbar" aria-label="Assessment progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div></div><section className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-9"><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">{question?.category ?? evidenceQuestion.category}</p><form onSubmit={next}>{question ? <fieldset><legend className="w-full">{question.scenario && <span className="mb-5 block rounded-lg bg-blue-light p-4 text-sm leading-6 text-muted">{question.scenario}</span>}<span className="block text-xl font-semibold leading-8">{question.question}</span></legend><div className="mt-6 space-y-3">{question.options.map((option, index) => <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm leading-6 ${answers[question.id] === index ? "border-primary bg-blue-light" : "border-border hover:border-primary/40"}`}><input type="radio" name={question.id} checked={answers[question.id] === index} onChange={() => { setAnswers(current => ({ ...current, [question.id]: index })); setError(""); }} className="mt-1 h-4 w-4 shrink-0 accent-primary" /><span className="font-semibold text-primary">{String.fromCharCode(65 + index)}.</span><span>{option}</span></label>)}</div></fieldset> : <div className="space-y-6"><div><h2 className="text-xl font-semibold">{evidenceQuestion.title}</h2><p className="mt-3 text-sm leading-6 text-muted">{evidenceQuestion.description}</p></div><EvidencePicker file={file} onSelect={value => { setFile(value); setError(""); }} /><FormField id="evidence-title" label="Project Title" required value={evidence.title} onChange={event => setEvidence(current => ({ ...current, title: event.target.value }))} /><TextareaField id="evidence-description" label="Short Description: What did you personally contribute?" value={evidence.description} onChange={event => { setEvidence(current => ({ ...current, description: event.target.value })); setError(""); }} /><fieldset><legend className="mb-3 text-sm font-semibold">Skills Demonstrated</legend><div className="flex flex-wrap gap-2">{evidenceQuestion.skills.map(skill => <button type="button" key={skill} aria-pressed={evidence.skills.includes(skill)} onClick={() => toggleSkill(skill)} className={`rounded-lg border px-3.5 py-2.5 text-sm ${evidence.skills.includes(skill) ? "border-primary bg-blue-light font-medium text-primary" : "border-border text-muted hover:border-primary/40"}`}>{skill}</button>)}</div></fieldset></div>}{error && <p role="alert" className="mt-5 rounded-lg bg-blue-light p-3 text-sm text-ink">{error}</p>}<div className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-6">{questionIndex > 0 ? <button type="button" onClick={back} className="rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:bg-section">Back</button> : <Link href="/student/dashboard" className="text-sm text-primary">Back to Dashboard</Link>}<button type="submit" className={primary}>{question ? "Next" : "Submit Assessment"}<Icon name="arrow" className="h-4 w-4" /></button></div></form></section></>}
    {stage === "processing" && <section role="status" aria-live="polite" aria-busy="true" className="rounded-xl border border-border bg-white px-6 py-20 text-center shadow-sm"><span aria-hidden="true" className="mx-auto mb-6 block h-10 w-10 animate-spin rounded-full border-[3px] border-blue-light border-t-primary motion-reduce:animate-none" /><h2 className="text-2xl font-semibold">Reviewing your assessment...</h2><p className="mt-4 text-sm leading-6 text-muted">EzraTech is analysing your responses and evidence.</p><p className="mt-3 text-xs text-muted">Simulated review for this prototype.</p></section>}
    {stage === "results" && <AssessmentResults />}
  </div>;
}
