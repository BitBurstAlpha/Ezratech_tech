import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { AccessGate } from "@/components/student/progress/access-gate";
import { NewOpportunity } from "@/components/student/projects/availability/new-opportunity";
export default function NewOpportunityPage() { return <DashboardShell activePath="/student/projects" title="Retail Reporting Dashboard" subtitle="Review this newly approved demo project opportunity."><AccessGate kind="projects"><NewOpportunity /></AccessGate></DashboardShell>; }
