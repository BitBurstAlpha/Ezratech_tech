import type { Metadata } from "next";
import { SMEProjectSetupStatus } from "@/components/sme/setup/project-setup-status";
export const metadata: Metadata = { title: "Project Setup Status | EzraTech" };
export default function SMEProjectSetupStatusPage() { return <SMEProjectSetupStatus />; }
