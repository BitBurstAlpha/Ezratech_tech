"use client";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { SMECard, SMEAction } from "@/components/sme/dashboard-ui";
import { monitoringRoute } from "./monitoring-data";
export function PausedProject() {
  const { progress } = useDemoProgress();
  return <SMECard title="Project Paused"><p className="text-sm leading-7 text-muted">Project activity is temporarily paused while the issue is reviewed.</p><p className="mt-3 text-sm leading-7">{progress.monitoring.pauseReason}</p><p className="mt-3 text-xs text-muted">Workspace updates are paused. EzraTech can resume the project once a resolution note is recorded.</p><div className="mt-5"><SMEAction href={monitoringRoute}>View Admin Monitoring Demo</SMEAction></div></SMECard>;
}
export function SharedMonitoringNotice() {
  const { progress } = useDemoProgress();
  const intervention = progress.monitoring.interventions.at(-1);
  const scope = Object.entries(progress.monitoring.scopeReviews);
  if (!intervention && !scope.length && !progress.monitoring.resumeNote) return null;
  return <SMECard title="EzraTech Project Support">{intervention && <p className="text-sm leading-7"><span className="font-semibold">{intervention.type}:</span> {intervention.notes}</p>}{progress.monitoring.resumeNote && <p className="mt-3 text-sm leading-7">Project resumed: {progress.monitoring.resumeNote}</p>}{scope.map(([index, review]) => <p key={index} className="mt-3 text-sm leading-7">Scope change review: {review.decision.replaceAll("_", " ")} · {review.notes}</p>)}<div className="mt-4"><SMEAction href={monitoringRoute}>View Admin Monitoring Demo</SMEAction></div></SMECard>;
}
