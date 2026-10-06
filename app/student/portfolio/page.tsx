import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { StudentPortfolio } from "@/components/student/portfolio/student-portfolio";

export const metadata: Metadata = { title: "My Portfolio | EzraTech", description: "Alex Morgan’s demonstrated skills, completed projects and reviewed experience." };
export default function PortfolioPage() {
  return <DashboardShell activePath="/student/portfolio" title="My Portfolio" subtitle="A record of your verified skills, SME project experience and approved evidence."><StudentPortfolio /></DashboardShell>;
}
