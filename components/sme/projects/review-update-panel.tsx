import { useState, type FormEvent } from "react";
import { ProjectField, ProjectSelect, projectInputClass } from "./project-fields";
import { mockDataAccessUpdate, type DataAccessUpdate } from "./review-data";
import { smePrimary, smeSecondary } from "../sme-shell";
export function ReviewUpdatePanel({ initialUpdate, onSubmit, onCancel }: { initialUpdate: DataAccessUpdate | null; onSubmit: (update: DataAccessUpdate) => void; onCancel: () => void }) {
  const [update, setUpdate] = useState<DataAccessUpdate>(() => ({ ...(initialUpdate ?? mockDataAccessUpdate) }));
  const [error, setError] = useState("");
  function change(patch: Partial<DataAccessUpdate>) { setUpdate(current => ({ ...current, ...patch })); setError(""); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!update.notes.trim() || (update.accessMethod === "Other" && !update.otherAccessMethod.trim())) { setError("Add the data notes and describe any other access method before submitting."); return; }
    onSubmit(update);
  }
  return <section aria-labelledby="data-update-heading" className="mt-5 rounded-lg border border-border bg-white p-5 sm:p-6"><h3 id="data-update-heading" tabIndex={-1} className="text-lg font-semibold">Update Data Access & Confidentiality</h3><p className="mb-5 mt-2 text-sm leading-6 text-muted">Clarify how the anonymised dataset will be shared for this demo project.</p><form onSubmit={submit} className="space-y-5"><div><label htmlFor="review-data-type" className="mb-2 block text-sm font-semibold">Data Type</label><input id="review-data-type" readOnly value={update.dataType} className={`${projectInputClass} bg-section`} /></div><ProjectSelect label="Data Access Method" options={["Secure project workspace", "Approved shared folder", "Sample dataset", "Other"]} value={update.accessMethod} onChange={accessMethod => change({ accessMethod })} />{update.accessMethod === "Other" && <ProjectField label="Other Data Access Method" value={update.otherAccessMethod} onChange={otherAccessMethod => change({ otherAccessMethod })} />}<div><label htmlFor="review-identifiable-data" className="mb-2 block text-sm font-semibold">Will any customer-identifiable data be included?</label><input id="review-identifiable-data" readOnly value={update.customerIdentifiableData} className={`${projectInputClass} bg-section`} /></div><ProjectField label="Additional Data Notes" multiline value={update.notes} onChange={notes => change({ notes })} />{error && <p role="alert" className="text-sm text-amber-900">{error}</p>}<div className="flex flex-wrap gap-3"><button type="submit" className={smePrimary}>Submit Update for Review</button><button type="button" onClick={onCancel} className={smeSecondary}>Cancel</button></div></form></section>;
}
