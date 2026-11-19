"use client";
import { useSMEWorkspaces } from "@/components/sme/workspace/workspace-manager-state";
import { statusLabels } from "@/components/sme/workspace/workspace-manager-data";
import { useSME } from "@/components/sme/sme-state";
import { useState } from "react";
import { AdminShell } from "../admin-shell";
import { SMECard, SMEAction } from "@/components/sme/dashboard-ui";
import { ProjectSelect } from "@/components/sme/projects/project-fields";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { WorkspaceDialog, secondaryButton } from "@/components/student/workspace/workspace-ui";
import { mockActiveProjects, monitoringValues, monitoringRoute, issueTypes } from "./monitoring-data";
import { MonitoringBadge, MonitoringPrototypeNote } from "./monitoring-ui";
export function ActiveProjectsDashboard() {
  const { progress } = useDemoProgress();
  const values = monitoringValues(progress);
  const [status, setStatus] = useState("All");
  const [stage, setStage] = useState("All");
  const [issueType, setIssueType] = useState("All");
  const [preview, setPreview] = useState<string | null>(null);
  const { workspaces, records } = useSMEWorkspaces();
  const { profile } = useSME();
  const projects = mockActiveProjects.filter(project => project.id !== "northstar-sales-analysis" && !records[project.id]);
  for (const project of workspaces) {
    if (project.status === "prestart") continue;
    const northstar = project.projectId === "northstar-sales-analysis";
    projects.push({
      id: project.projectId, title: project.title, student: project.student, company: profile.companyName,
      week: `${northstar ? values.week : project.currentWeek} of ${project.totalWeeks}`,
      progress: northstar ? values.progress : project.progress,
      status: northstar ? values.status : project.status === "active" ? "On Track" : statusLabels[project.status],
      openIssues: northstar ? values.openIssues : project.issues.length,
      stage: northstar ? values.stage : project.currentWeek < 3 ? "Early" : "Mid Project",
      issueTypes: northstar ? values.issues.filter(issue => issue.status !== "resolved").map(issue => issueTypes.includes(issue.type) ? issue.type : issue.type.includes("Scope") ? "Scope" : "Other") : project.issues.map(() => "Other"),
    });
  }
  const filtered = projects.filter(project => (status === "All" || project.status === status) && (stage === "All" || project.stage === stage) && (issueType === "All" || project.issueTypes.includes(issueType)));
  const pendingScope = progress.workspace.scopeChanges.filter((_, index) => !progress.monitoring.scopeReviews[index] || progress.monitoring.scopeReviews[index].decision === "revision_requested").length;
  return <AdminShell activeItem="Active Projects" title="Active Project Monitoring" subtitle="Monitor live SME projects, review issues and support project delivery.">
    <section aria-label="Monitoring summary" className="grid grid-cols-2 gap-4 xl:grid-cols-5">{[{ label: "Active Projects", value: projects.filter(project => ["On Track", "Needs Attention"].includes(project.status)).length }, { label: "On Track", value: projects.filter(project => project.status === "On Track").length }, { label: "Needs Attention", value: projects.filter(project => ["Needs Attention", "Paused"].includes(project.status)).length }, { label: "Open Issues", value: projects.reduce((total, project) => total + project.openIssues, 0) }, { label: "Scope Change Requests", value: pendingScope }].map(item => <div key={item.label} className="rounded-xl border border-border bg-white p-5"><p className="text-xs text-muted">{item.label}</p><p className="mt-4 text-3xl font-semibold">{item.value}</p></div>)}</section><p className="text-xs text-muted">Platform totals and other projects are simulated. Northstar progress and issues follow the shared demo workflow.</p>
    <SMECard title="Filters"><div className="grid gap-5 sm:grid-cols-3"><ProjectSelect label="Status" value={status} options={["All", "On Track", "Needs Attention", "Paused", "Completed", "Cancelled"]} onChange={setStatus} /><ProjectSelect label="Project Stage" value={stage} options={["All", "Early", "Mid Project", "Final Review"]} onChange={setStage} /><ProjectSelect label="Issue Type" value={issueType} options={["All", ...issueTypes]} onChange={setIssueType} /></div><button type="button" className={`${secondaryButton} mt-4`} onClick={() => { setStatus("All"); setStage("All"); setIssueType("All"); }}>Clear Filters</button></SMECard>
    <SMECard title="Project Monitoring List"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="border-b border-border bg-section"><tr>{["Project", "SME", "Student", "Current Week", "Progress", "Status", "Open Issues", "Admin Action"].map(label => <th key={label} scope="col" className="p-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map(project => <tr key={project.id}><th scope="row" className="p-3 text-sm font-semibold">{project.title}</th><td className="p-3">{project.company}</td><td className="p-3">{project.student}</td><td className="p-3">{project.week}</td><td className="p-3">{project.progress}%</td><td className="p-3"><MonitoringBadge>{project.status}</MonitoringBadge></td><td className="p-3">{project.openIssues}</td><td className="p-3">{project.id === "northstar-sales-analysis" ? <SMEAction href={monitoringRoute}>Monitor Project</SMEAction> : <button type="button" className={secondaryButton} onClick={() => setPreview(project.title)}>Monitor Project</button>}</td></tr>)}</tbody></table></div>{!filtered.length && <p role="status" className="mt-5 text-sm text-muted">No projects match these filters. Try clearing the filters.</p>}</SMECard>
    <SMECard title="Needs Attention">{progress.preStart.workspaceUnlocked && values.openIssues ? <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5"><h3 className="font-semibold">Sales Performance Analysis</h3><p className="mt-3 text-sm">Issue: {values.issues.find(item => item.status !== "resolved")?.description}</p><p className="mt-2 text-xs text-muted">Reported By: {values.issues.find(item => item.status !== "resolved")?.reportedBy} · Age: Today</p><p className="my-4"><MonitoringBadge>{values.issues.find(item => item.status !== "resolved")?.status}</MonitoringBadge></p><SMEAction href={`${monitoringRoute}#issues`}>Review Issue</SMEAction></div> : <p className="text-sm text-muted">No unresolved Northstar issues. {values.status === "Cancelled" ? "The project is closed and evidence is preserved." : values.completed ? "The project has been completed." : progress.preStart.workspaceUnlocked ? "The project is on track." : "The project has not started."}</p>}</SMECard><SMEAction href="/admin/issues">View All Issues</SMEAction><MonitoringPrototypeNote />
    {preview && <WorkspaceDialog title={preview} onClose={() => setPreview(null)}><p className="text-sm leading-7 text-muted">{projects.find(project => project.title === preview)?.status} · {projects.find(project => project.title === preview)?.openIssues} open issues</p></WorkspaceDialog>}
  </AdminShell>;
}
