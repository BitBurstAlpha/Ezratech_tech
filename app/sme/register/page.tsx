import type { Metadata } from "next";
import { SMEShell } from "@/components/sme/sme-shell";
import { SMERegistration } from "@/components/sme/sme-registration";
export const metadata: Metadata = { title: "Create your SME account | EzraTech" };
export default function SMERegistrationPage() { return <SMEShell><main className="mx-auto max-w-[640px] px-5 py-10 sm:py-14"><SMERegistration /></main></SMEShell>; }
