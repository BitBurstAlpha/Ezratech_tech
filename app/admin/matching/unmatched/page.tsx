import type { Metadata } from "next";
import { UnmatchedDashboard } from "@/components/admin/matching/unmatched/unmatched-dashboard";
export const metadata: Metadata = { title: "Unmatched Project-Ready Students | EzraTech" };
export default function UnmatchedPage() { return <UnmatchedDashboard />; }
