"use client";
import { SMEDashboardShell } from "./dashboard-shell";
import { SMEAction, SMECard } from "./dashboard-ui";
import { ProjectCards, useDashboardProjects } from "./project-cards";
import { useSME } from "./sme-state";

export function SMEDashboard() {
  const { profile } = useSME();
  const projects = useDashboardProjects();
  const attention = projects.filter(project => project.needsAction);
  const remaining = projects.filter(project => !project.needsAction);

  return <SMEDashboardShell title={`Welcome back, ${profile.primaryContact.firstName}`} subtitle={profile.companyName}>
    <SMECard title="Projects requiring action" id="attention">
      {attention.length ? <ProjectCards projects={attention} /> : <p className="text-sm text-muted">You’re up to date. No projects require action.</p>}
    </SMECard>
    <SMECard title="Project overview" id="projects" action={<SMEAction href="/sme/projects/new">Create New Project</SMEAction>}>
      {remaining.length ? <ProjectCards projects={remaining} /> : <p className="text-sm text-muted">All your projects are listed above.</p>}
    </SMECard>
  </SMEDashboardShell>;
}
