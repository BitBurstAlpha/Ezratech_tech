"use client";
import { useRef, useState } from "react";
import { Icon } from "@/components/landing/icon";
const acceptedExtensions = /\.(pdf|docx|xlsx|pptx|png|jpg|jpeg|gif|webp|svg|bmp|avif|heic)$/i;
export function EvidencePicker({ file, onSelect }: { file: File | null; onSelect: (file: File | null) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  function select(candidate?: File) {
    if (!candidate) return;
    if (!acceptedExtensions.test(candidate.name) && !candidate.type.startsWith("image/")) { setError("Choose a PDF, DOCX, XLSX, PPTX or image file."); return; }
    setError(""); onSelect(candidate);
  }
  return <div><div onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); select(event.dataTransfer.files[0]); }} className={`rounded-xl border-2 border-dashed p-6 text-center ${dragging ? "border-primary bg-blue-light" : "border-border bg-section"}`}><Icon name="project" className="mx-auto mb-3 h-7 w-7 text-primary" /><p className="text-sm font-medium">Drag and drop a file</p><p className="my-2 text-xs text-muted">or</p><button type="button" onClick={() => input.current?.click()} className="rounded-lg border border-primary/30 bg-white px-4 py-2.5 text-sm font-semibold text-primary hover:bg-blue-light">Choose File</button><input ref={input} type="file" aria-label="Choose previous work evidence" accept=".pdf,.docx,.xlsx,.pptx,image/*" className="sr-only" tabIndex={-1} onChange={event => { select(event.target.files?.[0]); event.target.value = ""; }} /><p className="mt-4 text-xs text-muted">PDF, DOCX, XLSX, PPTX, Image</p><p className="mt-2 text-xs text-muted">Demo only · Files stay in this browser and are not uploaded.</p></div>{file && <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-white px-4 py-3"><p className="min-w-0 break-all text-sm" aria-live="polite">{file.name}<span className="ml-2 text-xs text-muted">Selected for demo</span></p><button type="button" onClick={() => { onSelect(null); setError(""); }} className="shrink-0 text-xs font-semibold text-primary">Remove</button></div>}{error && <p role="alert" className="mt-3 text-sm text-ink">{error}</p>}</div>;
}
