import type { Metadata } from "next";
import { DisputeCase } from "@/components/admin/assessment-disputes/dispute-case";
export const metadata: Metadata = { title: "Assessment Review Case | EzraTech" };
export default function Page() { return <DisputeCase />; }
