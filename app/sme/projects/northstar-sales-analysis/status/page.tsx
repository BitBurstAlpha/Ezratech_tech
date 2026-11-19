import type { Metadata } from "next";
import { SMEProjectSetupStatus } from "@/components/sme/setup/project-setup-status";
export const metadata: Metadata = { title: "Project Initiation Checklist | EzraTech" };
export default function SMEProjectSetupStatusPage() { return <SMEProjectSetupStatus />; }
