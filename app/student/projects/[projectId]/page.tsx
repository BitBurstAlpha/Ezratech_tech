import { notFound } from "next/navigation";
import { requireMarketplace } from "@/lib/learning/access";
import { mockProjects } from "@/components/student/projects/details/project-details-data";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { DashboardCard, DashboardLink } from "@/components/student/dashboard/dashboard-card";

export default async function ProjectPage({ params }: PageProps<"/student/projects/[projectId]">) {
  await requireMarketplace();
  const { projectId } = await params;
  const project = mockProjects.find(item => item.id === projectId);
  if (!project) notFound();

  return <DashboardShell activePath="/student/projects" title={project.title} subtitle={project.company}>
    <DashboardCard title="Project brief">
      <p>{project.description}</p>
      <p className="my-4 text-sm text-muted">{project.category} · {project.workingStyle} · {project.duration} weeks · {project.weeklyCommitment} hours per week</p>
      <p className="text-sm">Required skills · {project.requiredSkills.join(", ")}</p>
    </DashboardCard>
    <DashboardCard title="Why this project matches your profile">
      <ul className="list-inside list-disc space-y-2 text-sm">{project.matchReasons.map(reason => <li key={reason.text}>{reason.text}</li>)}</ul>
    </DashboardCard>
    <DashboardLink href="/student/projects">Back to Project Marketplace</DashboardLink>
  </DashboardShell>;
}
