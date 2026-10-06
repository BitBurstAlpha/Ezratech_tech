import type { Metadata } from "next";
import { DisputesDashboard } from "@/components/admin/assessment-disputes/disputes-dashboard";
export const metadata: Metadata = { title: "Assessment Review Requests | EzraTech" };
export default function Page() { return <DisputesDashboard />; }
