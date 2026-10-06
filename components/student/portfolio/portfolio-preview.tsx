"use client";
import { mockVerifiedExperience as experience, type PortfolioVisibility } from "./experience-data";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { approvedPortfolioMaterials, experienceVerified, verifiedCapabilities } from "./evidence-record-data";
import { EvidenceBadge } from "./portfolio-record-ui";
export function PortfolioPreview({ visibility }: { visibility: PortfolioVisibility }) {
  const { progress } = useDemoProgress();
  if (!experienceVerified(progress)) return <p className="text-sm text-muted">Verified evidence is not yet available for preview.</p>;
  const permissions = progress.finalSMEReview.portfolioPermissions;
  const allowed = (key: keyof typeof permissions) => progress.finalSMEReview.portfolioPermissionsReviewed && permissions[key] === "Allowed";
  return <article aria-label="Portfolio preview card" className="overflow-hidden rounded-xl border border-border bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-blue-light p-5"><div><p className="text-lg font-semibold">{experience.student}</p><p className="mt-1 text-xs text-muted">{experience.careerGoal}</p></div><EvidenceBadge>Verified Experience</EvidenceBadge></div><div className="space-y-5 p-5">
    <div>{visibility.title && allowed("projectTitle") && <h3 className="text-xl font-semibold">{experience.project}</h3>}{visibility.company && allowed("companyName") && <p className="mt-2 text-sm text-primary">{experience.company}</p>}<p className="mt-2 text-xs text-muted">6-week supervised SME project · Remote</p></div>
    {visibility.summary && allowed("projectSummary") && <p className="text-sm leading-7 text-muted">{experience.summary}</p>}
    {visibility.skills && allowed("skills") && <div><h4 className="mb-3 text-sm font-semibold">Verified Skills</h4><ul className="flex flex-wrap gap-2">{verifiedCapabilities(progress).map(skill => <li key={skill.key}><EvidenceBadge>{skill.name}</EvidenceBadge></li>)}</ul></div>}
    {visibility.feedback && allowed("feedback") && <div className="rounded-lg bg-section p-4"><h4 className="text-sm font-semibold">SME Feedback</h4><blockquote className="mt-2 whitespace-pre-wrap text-sm leading-7">“{progress.finalSMEReview.feedback.general}”</blockquote><p className="mt-2 text-xs text-muted">Sarah Collins · Operations Manager</p></div>}
    {visibility.deliverables && <div><h4 className="mb-3 text-sm font-semibold">Approved Portfolio Material</h4>{approvedPortfolioMaterials(progress).filter(item => item.permission === "deliverables" && item.status === "Approved").length ? <ul className="space-y-2 text-sm">{approvedPortfolioMaterials(progress).filter(item => item.permission === "deliverables" && item.status === "Approved").map(item => <li key={item.title}>{item.title}</li>)}</ul> : <p className="text-xs text-muted">No redacted deliverables approved for portfolio use yet.</p>}</div>}
    <p className="border-t border-border pt-4 text-xs text-muted">Reviewed through EzraTech · Mock preview only</p>
  </div></article>;
}
