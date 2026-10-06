import type { Metadata } from "next";
import { ActiveProjectsDashboard } from "@/components/admin/monitoring/active-projects-dashboard";
export const metadata: Metadata = { title: "Active Project Monitoring | EzraTech" };
export default function ActiveProjectsPage() { return <ActiveProjectsDashboard />; }
