import type { Metadata } from "next";
import { MatchingDashboard } from "@/components/admin/matching/matching-dashboard";
export const metadata: Metadata = { title: "Matching Oversight | EzraTech" };
export default function MatchingPage() { return <MatchingDashboard />; }
