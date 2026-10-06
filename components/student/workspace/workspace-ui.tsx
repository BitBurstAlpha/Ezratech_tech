"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";

export const primaryButton = "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-muted";
export const secondaryButton = "inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-primary hover:bg-blue-light disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white";
export const inputClass = "w-full rounded-lg border border-border bg-white p-3 text-sm leading-6 placeholder:text-muted";

export function StatusBadge({ status }: { status: string }) {
  const color = ["Completed", "Active Project", "Positive", "On Track", "Good", "Available", "Resolved", "Strong", "Ready", "Accepted", "Recorded", "Project Work Complete", "Completed as agreed", "Verified Experience", "SME Project Completed", "Reviewed", "Verified", "Complete", "Configured", "Project Ready", "Ready to Share"].includes(status) ? "bg-green-50 text-green-700" : ["In Progress", "Current", "Under Review", "Next Step"].includes(status) ? "bg-blue-light text-primary" : status === "Changes Requested" || status === "Needs Clarification" || status === "Needs Support" || status === "Missing" ? "bg-amber-50 text-amber-800" : "bg-section text-muted";
  return <span className={`inline-flex h-fit shrink-0 self-start items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{status}</span>;
}

export function WorkspaceDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = ref.current; element?.showModal(); return () => element?.close(); }, []);
  return <dialog ref={ref} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl border border-border bg-white p-6 text-ink shadow-xl sm:p-8"><div className="mb-5 flex items-start justify-between gap-4"><h2 id={titleId} className="text-xl font-semibold">{title}</h2><button type="button" aria-label={`Close ${title}`} onClick={onClose} className="rounded-lg bg-section px-3 py-1 text-xl">×</button></div>{children}</dialog>;
}
