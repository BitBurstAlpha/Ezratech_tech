import { notFound } from "next/navigation";
import { mockSMEWorkspaces } from "@/components/sme/workspace/workspace-manager-data";
import { ManagedProjectWorkspace } from "@/components/sme/workspace/managed-project-workspace";
export function generateStaticParams() { return Object.keys(mockSMEWorkspaces).map(projectId => ({ projectId })); }
export default async function WorkspacePage({ params }: { params: Promise<{ projectId: string }> }) { const { projectId } = await params; if (!Object.hasOwn(mockSMEWorkspaces, projectId)) notFound(); return <ManagedProjectWorkspace key={projectId} projectId={projectId} />; }
