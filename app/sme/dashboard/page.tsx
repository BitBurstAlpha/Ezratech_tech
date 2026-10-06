import type { Metadata } from "next";
import { SMEDashboard } from "@/components/sme/sme-dashboard";

export const metadata: Metadata = { title: "SME Dashboard | EzraTech" };
export default function SMEDashboardPage() { return <SMEDashboard />; }
