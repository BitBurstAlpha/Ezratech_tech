"use client";
import { useRouter } from "next/navigation";
import { SMEAction } from "../dashboard-ui";
import { useSMEWorkspaces } from "./workspace-manager-state";
import { workspaceStatusLabel } from "./workspace-manager-data";
export function ProjectSwitcher({ projectId }: { projectId: string }) {
  const { workspaces } = useSMEWorkspaces();
  const router = useRouter();
  return <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-white p-4"><label className="flex min-w-0 flex-1 flex-col gap-2 text-xs font-semibold text-muted">Current Project<select aria-label="Current Project" value={projectId} onChange={event => router.push(event.target.value === "northstar-sales-analysis" && workspaces.find(item => item.projectId === event.target.value)?.status === "prestart" ? "/sme/projects/northstar-sales-analysis/status" : `/sme/workspace/${event.target.value}`)} className="w-full max-w-xl rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink">{!workspaces.some(project => project.projectId === projectId) && <option value={projectId}>Sales Performance Analysis · Alex Morgan · Not Started</option>}{workspaces.map(project => <option key={project.projectId} value={project.projectId}>{project.title} · {project.student} · {workspaceStatusLabel(project)}</option>)}</select></label><SMEAction href="/sme/workspace">All Workspaces</SMEAction></div>;
}
