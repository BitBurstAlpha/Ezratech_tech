"use client";
import { useState } from "react";
import type { SharedMessage } from "./message-data";
import { WorkspaceDialog } from "@/components/student/workspace/workspace-ui";
export function MessageContent({ message }: { message: SharedMessage }) {
  const [preview, setPreview] = useState(false);
  return <><p className="whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-7">{message.text}</p>{message.attachment && <div className="mt-3 rounded-lg border border-border bg-white/80 p-3"><p className="break-all text-xs font-semibold">{message.attachment}</p><p className="mt-2 text-[11px] text-muted">Uploaded by: {message.author} · Size: Demo</p><button type="button" onClick={() => setPreview(true)} className="mt-2 text-xs font-semibold text-primary">Preview</button></div>}<p className="mt-2 text-[11px] text-muted">{message.timestamp ?? "Earlier"}{message.status && ` · ${message.status === "read" ? "Read" : "Sent"}`}</p>{preview && <WorkspaceDialog title="Demo Attachment Preview" onClose={() => setPreview(false)}><p className="break-all text-sm font-semibold">{message.attachment}</p><p className="mt-4 text-sm leading-7 text-muted">Mock attachment preview only. No file is uploaded, opened or downloaded.</p></WorkspaceDialog>}</>;
}
