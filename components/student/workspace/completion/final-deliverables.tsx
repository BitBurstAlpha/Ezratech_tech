"use client";
import { useState } from "react";
import { DashboardCard } from "@/components/student/dashboard/dashboard-card";
import { inputClass, primaryButton, secondaryButton, StatusBadge } from "../workspace-ui";
import { type Deliverable } from "./completion-data";

export function FinalDeliverables({ deliverables, onChange, notify, readOnly = false }: { deliverables: Deliverable[]; onChange: (files: Deliverable[]) => void; notify: (message: string) => void; readOnly?: boolean }) {
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  function openUpload(target: string) { setUploadTarget(target); setFilename(""); }
  function addFile() {
    const name = filename.trim();
    if (!name || readOnly || !uploadTarget) return;
    if (uploadTarget === "additional") onChange([...deliverables, { id: `additional-${Date.now()}`, title: "Additional File", file: name, required: false }]);
    else onChange(deliverables.map(file => file.id === uploadTarget ? { ...file, file: name } : file));
    setUploadTarget(null); setFilename(""); notify("Demo file updated. No file was uploaded.");
  }
  return <DashboardCard title="Final Deliverables"><div className="space-y-4">{deliverables.map((file, index) => <article key={file.id} className="rounded-lg border border-border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-sm font-semibold">{index + 1}. {file.title}</h3><p className="mt-2 break-all text-sm text-muted">{file.file ?? "No demo file attached"}</p></div><StatusBadge status={file.file ? "Ready" : "Missing"} /></div><div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={!file.file} onClick={() => notify("Demo file action only")} className={`${secondaryButton} disabled:cursor-not-allowed disabled:opacity-50`} aria-label={`View ${file.title}`}>View</button>{!readOnly && <><button type="button" onClick={() => openUpload(file.id)} className={secondaryButton} aria-label={`Replace ${file.title}`}>{file.file ? "Replace" : "Add Demo File"}</button><button type="button" disabled={!file.file} onClick={() => { onChange(file.required ? deliverables.map(item => item.id === file.id ? { ...item, file: null } : item) : deliverables.filter(item => item.id !== file.id)); notify("Demo file removed from this submission."); }} className={`${secondaryButton} disabled:opacity-50`} aria-label={`Remove ${file.title}`}>Remove</button></>}</div></article>)}</div>
    {!readOnly && <button type="button" onClick={() => openUpload("additional")} className={`${secondaryButton} mt-5`}>Upload Additional File</button>}
    {uploadTarget && !readOnly && <div className="mt-5 rounded-lg border border-dashed border-primary/30 bg-blue-light p-5"><h3 className="text-sm font-semibold">Mock file upload area</h3><p className="my-3 text-xs leading-6 text-muted">Enter a demo filename. This only updates the mock file list.</p><label className="block text-sm font-medium">Demo filename<input value={filename} onChange={event => setFilename(event.target.value)} placeholder="e.g. Updated_Sales_Dashboard.pbix" className={`${inputClass} mt-2`} /></label><div className="mt-4 flex gap-3"><button type="button" disabled={!filename.trim()} onClick={addFile} className={primaryButton}>Add Demo File</button><button type="button" onClick={() => setUploadTarget(null)} className={secondaryButton}>Cancel</button></div></div>}
  </DashboardCard>;
}
