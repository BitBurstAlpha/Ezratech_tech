import type { Metadata } from "next";
import { OutcomesDashboard } from "@/components/admin/outcomes/outcomes-dashboard";
export const metadata: Metadata = { title: "Pilot Outcomes & Follow-Up | EzraTech" };
export default function OutcomesPage() { return <OutcomesDashboard />; }
