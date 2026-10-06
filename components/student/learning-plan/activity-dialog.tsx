"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { TextareaField } from "@/components/student/onboarding/controls";
import { Icon } from "@/components/landing/icon";
import { mockAIFeedback, type LearningActivity } from "./learning-data";
const primary = "rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover";
export function ActivityDialog({ activity, onClose, onComplete }: { activity: LearningActivity; onClose: () => void; onComplete: (id: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [response, setResponse] = useState("");
  const [stage, setStage] = useState<"response" | "reviewing" | "feedback">("response");
  const [error, setError] = useState("");
  const feedback = mockAIFeedback[activity.id];
  useEffect(() => { const element = dialog.current; element?.showModal(); return () => element?.close(); }, []);
  useEffect(() => {
    if (stage !== "reviewing") return;
    const timer = setTimeout(() => setStage("feedback"), 2000);
    return () => clearTimeout(timer);
  }, [stage]);
  useEffect(() => { if (stage !== "response") content.current?.focus(); }, [stage]);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!response.trim()) { setError("Write a short response before submitting."); return; } setError(""); setStage("reviewing"); }
  return <dialog ref={dialog} aria-labelledby="activity-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-xl border border-border bg-white p-6 text-ink shadow-xl sm:p-8"><div className="mb-5 flex items-center justify-between gap-4"><span className="text-xs font-semibold uppercase tracking-widest text-primary">{activity.type} · {activity.duration}</span><button type="button" aria-label="Close learning activity" onClick={onClose} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-section text-xl">×</button></div><h2 id="activity-title" className="text-2xl font-semibold tracking-tight">{activity.title}</h2><div ref={content} tabIndex={-1} className="mt-6 focus:outline-none">
    {stage === "response" && <form onSubmit={submit}><div className="mb-5 rounded-lg bg-blue-light p-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Scenario</p><p className="text-sm leading-6">{activity.scenario}</p></div><TextareaField id="learning-response" label={activity.question} placeholder="Write a short professional update..." required value={response} onChange={event => { setResponse(event.target.value); setError(""); }} />{error && <p role="alert" className="mt-3 text-sm">{error}</p>}<button type="submit" className={`${primary} mt-5`}>Submit Response</button></form>}
    {stage === "reviewing" && <div role="status" aria-live="polite" aria-busy="true" className="py-10 text-center"><span aria-hidden="true" className="mx-auto mb-5 block h-9 w-9 animate-spin rounded-full border-[3px] border-blue-light border-t-primary motion-reduce:animate-none" /><p className="text-lg font-semibold">EzraTech AI is reviewing your response...</p><p className="mt-3 text-xs text-muted">Simulated feedback for this prototype.</p></div>}
    {stage === "feedback" && <div><span className="inline-flex rounded-full bg-blue-light px-3 py-1.5 text-xs font-semibold text-primary">AI-assisted feedback</span><h3 className="mb-3 mt-6 text-sm font-semibold">What you did well:</h3><ul className="space-y-2">{feedback.strengths.map(strength => <li key={strength} className="flex items-start gap-2 text-sm leading-6 text-muted"><Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-primary" />{strength}</li>)}</ul><h3 className="mb-2 mt-5 text-sm font-semibold">Consider improving:</h3><p className="text-sm leading-6 text-muted">{feedback.improvement}</p><h3 className="mb-2 mt-5 text-sm font-semibold">Example improvement:</h3><blockquote className="rounded-lg border border-primary/10 bg-blue-light p-4 text-sm leading-7">“{feedback.example}”</blockquote><p className="mt-4 text-xs leading-5 text-muted">This is fixed demo feedback, not an evaluation of your response.</p><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => { setStage("response"); setError(""); }} className="rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:bg-section">Try Again</button><button type="button" onClick={() => onComplete(activity.id)} className={primary}>Continue</button></div></div>}
  </div></dialog>;
}
