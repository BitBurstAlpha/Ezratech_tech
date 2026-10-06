"use client";
import { useEffect, useState } from "react";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { primaryButton, secondaryButton, WorkspaceDialog } from "@/components/student/workspace/workspace-ui";
import { approvedPortfolioMaterials, experienceVerified, individualContributions, mockVerifiedExperiences, reviewedDeliverables, verifiedCapabilities } from "./evidence-record-data";
import { RecordDetails } from "./portfolio-record-ui";
export function EvidenceSummaryExport() {
  const { progress } = useDemoProgress();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(""), 5000); return () => clearTimeout(timer); }, [notice]);
  const record = mockVerifiedExperiences[0];
  if (!experienceVerified(progress)) return null;
  return <><button type="button" className={primaryButton} onClick={() => { setOpen(true); setPreview(false); setNotice(""); }}>Export Evidence Summary</button>
    {open && <WorkspaceDialog title="Export Verified Experience" onClose={() => setOpen(false)}><p className="mb-4 text-sm leading-7 text-muted">Summary would include:</p><ul className="grid list-inside list-disc gap-2 text-sm text-muted sm:grid-cols-2">{["Student name", "Career goal", "Project", "Company", "Dates", "Workload", "Individual contribution", "Deliverables", "SME feedback", "Verified capabilities", "Reviewer status", "Approved portfolio material"].map(item => <li key={item}>{item}</li>)}</ul><div className="mt-5 flex flex-wrap gap-3"><button type="button" className={secondaryButton} onClick={() => setPreview(true)}>Preview Summary</button><button type="button" className={primaryButton} onClick={() => { setNotice("Demo evidence summary prepared."); setOpen(false); }}>Download Demo PDF</button></div>
      {preview && <section aria-label="Evidence summary preview" className="mt-6 space-y-5 rounded-xl border border-border bg-section p-4"><h3 className="font-semibold">Verified Evidence Summary</h3><RecordDetails items={[{ label: "Student", value: record.student }, { label: "Career Goal", value: record.careerGoal }, { label: "Project", value: record.project }, { label: "Company", value: record.company }, { label: "Dates", value: `${record.dates.start} – ${record.dates.end}` }, { label: "Workload", value: record.workload }, { label: "Reviewer Status", value: `${record.reviewer} · Verified` }]} /><div><h4 className="text-sm font-semibold">Individual Contribution</h4><p className="mt-2 text-sm leading-7">{individualContributions(progress).join(" · ")}</p></div><div><h4 className="text-sm font-semibold">Reviewed Deliverables</h4><p className="mt-2 text-sm leading-7">{reviewedDeliverables(progress).map(item => `${item.title}: ${item.status}`).join(" · ")}</p></div><div><h4 className="text-sm font-semibold">SME Feedback</h4><p className="mt-2 whitespace-pre-wrap text-sm leading-7">{progress.finalSMEReview.feedback.general}</p></div><div><h4 className="text-sm font-semibold">Verified Capabilities</h4><ul className="mt-2 space-y-2 text-sm">{verifiedCapabilities(progress).map(item => <li key={item.key}>{item.name}: {item.level}</li>)}</ul></div><div><h4 className="text-sm font-semibold">Approved Portfolio Material</h4><ul className="mt-2 space-y-2 text-sm">{approvedPortfolioMaterials(progress).filter(item => item.status === "Approved").map(item => <li key={item.title}>{item.title}</li>)}</ul></div></section>}
      <p className="mt-5 text-xs leading-6 text-muted">Prototype preview only. No file is generated or downloaded. Confidential data and unapproved material are excluded.</p><p role="status" className="mt-4 rounded-lg bg-blue-light p-3 text-sm text-primary">{notice || "Demo export only"}</p>
    </WorkspaceDialog>}
    {notice && <div role="status" className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-xl border border-border bg-white p-4 text-sm shadow-lg">{notice}<button type="button" aria-label="Dismiss export message" onClick={() => setNotice("")} className="ml-3 text-primary">Dismiss</button></div>}
  </>;
}
