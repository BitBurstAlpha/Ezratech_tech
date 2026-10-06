import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { VerifiedExperience } from "@/components/student/portfolio/verified-experience";

export const metadata: Metadata = { title: "Verified Experience | EzraTech", description: "Reviewed project evidence and Alex Morgan’s practical experience portfolio." };
export default function VerifiedExperiencePage() {
  return <DashboardShell activePath="/student/portfolio" title="Verified Experience" subtitle="Sales Performance Analysis · Northstar Retail Ltd"><VerifiedExperience /></DashboardShell>;
}
