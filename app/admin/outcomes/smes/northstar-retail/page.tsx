import type { Metadata } from "next";
import { SMEOutcome } from "@/components/admin/outcomes/sme-outcome";
export const metadata: Metadata = { title: "SME Outcome Record | EzraTech" };
export default function SMEOutcomePage() { return <SMEOutcome />; }
