import type { Metadata } from "next";
import { SMEProjectWorkspace } from "@/components/sme/workspace/sme-project-workspace";
export const metadata: Metadata = { title: "SME Project Workspace | EzraTech" };
export default function SMEWorkspacePage() { return <SMEProjectWorkspace />; }
