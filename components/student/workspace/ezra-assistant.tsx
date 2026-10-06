"use client";
import { useEffect, useState } from "react";
import { mockEzraResponses as responses, type WeeklyDraft } from "./workspace-data";
import { inputClass, primaryButton, secondaryButton, WorkspaceDialog } from "./workspace-ui";

const actions = [
  { id: "task", label: "Help me understand my current task" },
  { id: "draft", label: "Draft my weekly progress update" },
  { id: "questions", label: "Help me prepare questions for my supervisor" },
  { id: "feedback", label: "Summarise recent project feedback" },
  { id: "nextSteps", label: "Help me plan my next steps" },
] as const;
type Action = typeof actions[number]["id"];

export function EzraAssistant({ onClose, onUseDraft }: { onClose: () => void; onUseDraft: (draft: WeeklyDraft) => void }) {
  const [action, setAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<WeeklyDraft>({ ...responses.draft });
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, [loading]);
  function choose(next: Action) { setAction(next); setEditing(false); setLoading(next === "task"); }
  return <WorkspaceDialog title="Ezra Project Assistant" onClose={onClose}>
    <p className="mb-6 text-sm leading-6 text-muted">Get help understanding tasks, preparing updates and organising your project work.</p>
    {!action ? <div className="space-y-3">{actions.map(item => <button key={item.id} type="button" onClick={() => choose(item.id)} className={`${secondaryButton} w-full justify-start text-left`}>{item.label}</button>)}</div> : <>
      <button type="button" onClick={() => { setAction(null); setLoading(false); }} className="mb-5 text-sm font-semibold text-primary">← Suggested actions</button>
      {loading ? <p role="status" className="rounded-lg bg-blue-light p-5 text-sm text-primary">Ezra is reviewing the task...</p> : <div className="rounded-xl border border-border bg-section p-5 text-sm leading-7">
        {action === "task" && <><h3 className="font-semibold">{responses.task.title}</h3><p className="mt-4 font-semibold">Your goal</p><p className="text-muted">{responses.task.goal}</p><p className="mt-4 font-semibold">Suggested steps</p><ol className="list-decimal space-y-2 pl-5 text-muted">{responses.task.steps.map(step => <li key={step}>{step}</li>)}</ol></>}
        {action === "draft" && <><h3 className="mb-4 font-semibold">AI Draft</h3>{editing ? <div className="space-y-4">{([{ key: "completed", label: "What did you complete this week?" }, { key: "next", label: "What are you working on next?" }, { key: "blockers", label: "Current blocker" }] as const).map(field => <label key={field.key} className="block font-medium">{field.label}<textarea rows={4} value={draft[field.key]} onChange={event => setDraft(current => ({ ...current, [field.key]: event.target.value }))} className={`${inputClass} mt-2 font-normal`} /></label>)}</div> : <><p className="whitespace-pre-line text-muted">{draft.completed}</p><p className="mt-4 text-muted">{draft.next}</p><p className="mt-4 font-semibold">Current blocker:</p><p className="text-muted">{draft.blockers}</p></>}<p className="mt-4 text-xs text-muted">Use Draft fills your weekly update form for review. Submit it when you are ready.</p><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => onUseDraft(draft)} className={primaryButton}>Use Draft</button><button type="button" onClick={() => setEditing(current => !current)} className={secondaryButton}>{editing ? "Done Editing" : "Edit"}</button><button type="button" onClick={onClose} className={secondaryButton}>Close</button></div></>}
        {action === "questions" && <><h3 className="mb-3 font-semibold">Suggested Questions</h3><ol className="list-decimal space-y-3 pl-5 text-muted">{responses.questions.map(question => <li key={question}>{question}</li>)}</ol></>}
        {action === "feedback" && <><h3 className="mb-3 font-semibold">Recent project feedback</h3><p className="text-muted">{responses.feedback}</p></>}
        {action === "nextSteps" && <><h3 className="mb-3 font-semibold">Your next steps</h3><ol className="list-decimal space-y-2 pl-5 text-muted">{responses.nextSteps.map(step => <li key={step}>{step}</li>)}</ol></>}
      </div>}
      {!loading && <p className="mt-4 text-xs text-muted">AI-assisted demo response</p>}
    </>}
  </WorkspaceDialog>;
}
