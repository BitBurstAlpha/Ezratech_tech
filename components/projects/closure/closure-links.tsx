"use client";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { useSMEWorkspaces } from "@/components/sme/workspace/workspace-manager-state";
import { SMEAction, SMECard } from "@/components/sme/dashboard-ui";
import { salesProjectId, statusText } from "./post-project-data";

export function ClosureLinks({ role, portfolio = false }: {role: "admin" | "student"; portfolio?: boolean}) {
  const {workspaces} = useSMEWorkspaces();
  const {progress} = useDemoProgress();
  const projects = workspaces.flatMap(project => {
    const record = project.projectId === salesProjectId ? progress.projectClosure : project.projectClosure;
    if (!record || role === "student" && project.student !== "Alex Morgan") return [];
    return [{project,record}];
  });
  if (!projects.length) return null;
  return <SMECard title={portfolio ? "Private Project Outcomes" : "Project Closure"}><div className="grid gap-4">{projects.map(({project,record})=><article key={project.projectId}>
    <h3 className="font-semibold">{project.title}</h3><p className="my-2 text-sm">{statusText[record.status]}{record.offer ? " · Demo employment offer" : record.opportunityFeedback ? " · No further employment opportunity" : ""}</p>
    {portfolio && record.recommendationApproved && <blockquote className="my-3 text-sm"><strong>SME Recommendation</strong><p>{record.recommendation?.written}</p></blockquote>}
    <SMEAction href={`/${role}/projects/${project.projectId}/closure`}>{record.status === "closure_completed" ? "View Closure Record" : role === "admin" ? "Review Closure" : "Review Project Closure"}</SMEAction>
  </article>)}</div></SMECard>;
}
