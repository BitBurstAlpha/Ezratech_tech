import { notFound } from "next/navigation";
import { ProjectClosure } from "@/components/projects/closure/project-closure";
import { salesProjectId } from "@/components/projects/closure/post-project-data";
import { mockSMEWorkspaces } from "@/components/sme/workspace/workspace-manager-data";

export function generateStaticParams() {
  return [salesProjectId, ...Object.keys(mockSMEWorkspaces)].map(projectId => ({ projectId }));
}
export default async function ClosurePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  if (projectId !== salesProjectId && !Object.hasOwn(mockSMEWorkspaces, projectId)) notFound();
  return <ProjectClosure key={projectId} projectId={projectId} role="student" />;
}
