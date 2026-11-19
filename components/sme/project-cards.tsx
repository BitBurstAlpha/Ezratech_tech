"use client";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { SMEAction, SMEDetail } from "./dashboard-ui";
import { mockReviewProject, type ProjectReviewStatus } from "./projects/review-data";
import { useSMEProjectDraft } from "./projects/project-state";
import { statusLabels, type ManagedWorkspace } from "./workspace/workspace-manager-data";
import { useSMEWorkspaces } from "./workspace/workspace-manager-state";

type DashboardProject = {
  id: string; title: string; stage: string; status: string; week: string;
  student?: string; action: string; href: string; needsAction: boolean;
};

function reviewCard(status: ProjectReviewStatus): DashboardProject {
  const { id, title } = mockReviewProject;
  const approved = status === "approved";
  const changes = status === "changes_requested";
  return {
    id, title, stage: approved ? "Candidate matching" : "Project review",
    status: approved ? "Approved" : changes ? "Changes Requested" : status === "rejected" ? "Rejected" : "Awaiting Approval",
    week: "Not started", needsAction: approved || changes,
    action: approved ? "Review Candidates" : changes ? "Review Requested Changes" : "View Review Status",
    href: `/sme/projects/${id}/${approved ? "candidates" : "review"}`,
  };
}

function workspaceCard(project: ManagedWorkspace): DashboardProject {
  const { projectId: id, title, status } = project;
  const initiation = status === "prestart";
  const closed = status === "completed" || status === "cancelled";
  const northstar = id === mockReviewProject.id;
  let href = `/sme/workspace/${id}`;
  if (northstar && initiation) href = `/sme/projects/${id}/status`;
  if (northstar && closed) href += status === "completed" ? "/review" : "/cancelled";
  return {
    id, title, stage: initiation ? "Project initiation" : closed ? "Closure" : "Delivery",
    status: initiation ? "Initiation Pending" : statusLabels[status],
    week: initiation ? "Not started" : `${project.currentWeek} of ${project.totalWeeks}`,
    student: project.setup.student ? project.student : undefined,
    action: initiation ? "Complete Project Initiation Checklist" : status === "completed" ? "View Completed Project" : status === "cancelled" ? "View Cancelled Project" : "Open Workspace",
    href, needsAction: initiation || status === "needs_attention",
  };
}

export function ProjectCards({ projects }: { projects: DashboardProject[] }) {
  return <div className="grid gap-4 xl:grid-cols-2">{projects.map(project =>
    <article key={project.id} className="flex min-w-0 flex-col rounded-lg border border-border p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-semibold">{project.title}</h3>
        <span className="rounded-full bg-blue-light px-3 py-1 text-xs font-semibold text-primary">{project.status}</span>
      </div>
      <dl className="grid grid-cols-2 gap-4">
        <SMEDetail label="Project stage">{project.stage}</SMEDetail>
        <SMEDetail label="Project week">{project.week}</SMEDetail>
        {project.student && <SMEDetail label="Assigned student">{project.student}</SMEDetail>}
      </dl>
      <div className="mt-auto pt-5"><SMEAction primary href={project.href}>{project.action}</SMEAction></div>
    </article>
  )}</div>;
}

export function useDashboardProjects() {
  const { workspaces } = useSMEWorkspaces();
  const { review } = useSMEProjectDraft();
  const { progress } = useDemoProgress();
  const projects = workspaces.map(project => {
    const card = workspaceCard(project);
    if (project.projectId !== review.projectId) return card;
    if (project.status === "prestart") card.needsAction = !project.setup.sme;
    if (progress.cancellation.week === 3) card.week = "3 of " + project.totalWeeks;
    if (["active", "needs_attention"].includes(project.status) && progress.projectCompletion.finalSubmitted) {
      card.stage = progress.projectCompletion.changesRequested ? "Revision requested" : "Final review";
      card.needsAction ||= !progress.projectCompletion.changesRequested;
    }
    return card;
  });
  if (!projects.some(project => project.id === review.projectId)) projects.unshift(reviewCard(review.status));
  return projects;
}
