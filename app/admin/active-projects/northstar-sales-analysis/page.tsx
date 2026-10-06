import type { Metadata } from "next";
import { ProjectMonitoringDetail } from "@/components/admin/monitoring/project-monitoring-detail";
export const metadata: Metadata = { title: "Project Monitoring | EzraTech" };
export default function ProjectMonitoringPage() { return <ProjectMonitoringDetail />; }
