"use client";
import { useEffect, useRef } from "react";
import type { demoAgreements } from "./pre-start-data";
export function AgreementDialog({ agreement, onClose, onReviewed }: { agreement: typeof demoAgreements[number]; onClose: () => void; onReviewed: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = dialog.current; element?.showModal(); return () => element?.close(); }, []);
  return <dialog ref={dialog} aria-labelledby="agreement-title" onCancel={event => {event.preventDefault();onClose();}} onClick={event => {if(event.target===event.currentTarget)onClose();}} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border border-border bg-white p-7 text-ink shadow-xl"><div className="mb-5 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-primary">Prototype Demo</span><button type="button" aria-label="Close agreement preview" onClick={onClose} className="rounded-lg bg-section px-3 py-1 text-xl">×</button></div><h2 id="agreement-title" className="text-2xl font-semibold">{agreement.title}</h2><p className="my-5 text-sm leading-7 text-muted">{agreement.text}</p><p className="mb-6 text-xs leading-6 text-muted">This is a demonstration preview, not a legal document or signature.</p><button type="button" onClick={onReviewed} className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover">I Have Reviewed This</button></dialog>;
}
