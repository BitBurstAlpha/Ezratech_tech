import type { Metadata } from "next";
import { SMEShell } from "@/components/sme/sme-shell";
import { SMEOnboarding } from "@/components/sme/sme-onboarding";
export const metadata: Metadata = { title: "SME Onboarding | EzraTech" };
export default function SMEOnboardingPage() { return <SMEShell><main className="min-h-screen bg-section px-5 py-10 sm:py-12"><SMEOnboarding /></main></SMEShell>; }
