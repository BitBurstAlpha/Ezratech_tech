import { useState, type ChangeEvent } from "react";
import type { EvidenceMetadata } from "./options";

const mimeByExtension: Record<string, string> = {
  pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
};
const maxBytes = 5 * 1024 * 1024;

function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString(undefined, { maximumFractionDigits: 2 })} MB`;
}

export function SupportingEvidence({ id, evidence, onChange }: {
  id: string; evidence?: EvidenceMetadata; onChange: (value?: EvidenceMetadata) => void;
}) {
  const [error, setError] = useState("");

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    const extension = /\.([^.]+)$/.exec(file.name)?.[1].toLowerCase();
    const expectedType = extension && Object.hasOwn(mimeByExtension, extension) && mimeByExtension[extension];
    if (!expectedType || (file.type && file.type !== expectedType)) {
      setError("Choose a PDF, JPG or PNG file.");
      return;
    }
    if (file.size > maxBytes) {
      setError("Choose a file that is 5 MB or smaller.");
      return;
    }
    setError("");
    onChange({ name: file.name, size: file.size });
  }

  return <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium">Supporting Evidence (Optional)</label>
    <p id={`${id}-description`} className="text-sm leading-6 text-muted">Upload a document that supports this experience, such as an experience letter, internship certificate, volunteering certificate, reference letter or project evidence.</p>
    <div className="space-y-3 rounded-lg border border-border bg-white p-4">
      <p id={`${id}-limits`} className="text-xs text-muted">PDF, JPG or PNG · One file, up to 5 MB</p>
      <div role="status" className="text-sm">
        {evidence && <div className="flex flex-wrap items-center gap-2">
          <span className="break-all font-medium">{evidence.name}</span>
          <span className="text-muted">{fileSize(evidence.size)}</span>
          <span className="rounded-full bg-section px-2.5 py-1 text-xs font-medium text-muted">Not Yet Verified</span>
        </div>}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <input id={id} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="peer sr-only" aria-describedby={`${id}-description ${id}-limits ${id}-privacy`}
          onChange={selectFile} />
        <label htmlFor={id} className="cursor-pointer rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary hover:bg-blue-light peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
          {evidence ? "Replace file" : "Choose file"}
        </label>
        {evidence && <button type="button" className="text-sm font-medium text-muted underline underline-offset-4 hover:text-primary" onClick={() => { setError(""); onChange(undefined); }}>Remove file</button>}
      </div>
      {error && <p role="alert" className="text-sm text-amber-800">{error}</p>}
    </div>
    <p id={`${id}-privacy`} className="text-xs leading-5 text-muted">Evidence may be reviewed by authorised EzraTech reviewers. In this prototype, your document stays on your device. Only its name and size appear during onboarding.</p>
  </div>;
}
