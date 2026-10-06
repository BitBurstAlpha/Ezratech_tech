"use client";
import { AdminShell } from "@/components/admin/admin-shell";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { SMECard, SMEAction } from "@/components/sme/dashboard-ui";
import { projectIssues } from "@/components/admin/monitoring/monitoring-data";
import { projectCancelled } from "./closure-data";
import { ClosurePrototypeNote } from "./rejected-project";
export function IssuesCentre() { const { progress } = useDemoProgress(); return <AdminShell activeItem="Issues" title="Issues Centre" subtitle="Review project issues and consider the appropriate support or closure action."><SMECard title="Sales Performance Analysis"><p className="mb-5 text-sm text-muted">Northstar Retail Ltd · Alex Morgan · {projectCancelled(progress) ? "Cancelled — evidence preserved" : "Project delivery"}</p><ul className="mb-5 space-y-3">{projectIssues(progress).map(issue => <li key={issue.id} className="rounded-lg border border-border p-4"><p className="text-sm font-semibold">{issue.title}</p><p className="mt-2 text-sm leading-7 text-muted">{issue.description}</p><p className="mt-2 text-xs text-muted">{issue.status} · {issue.owner}</p></li>)}</ul><div className="flex flex-wrap gap-3"><SMEAction href="/admin/active-projects/northstar-sales-analysis">Monitor Project</SMEAction><SMEAction href="/admin/active-projects/northstar-sales-analysis/cancel">{projectCancelled(progress) ? "View Cancellation Record" : "Cancel Project"}</SMEAction></div></SMECard><ClosurePrototypeNote /></AdminShell>; }
