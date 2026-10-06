import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/landing/brand";
import { Icon } from "@/components/landing/icon";
import { OnboardingForm } from "@/components/student/onboarding/onboarding-form";
export const metadata: Metadata = { title: "Set up your student profile | EzraTech", description: "Build your EzraTech profile with your background, education, goals, experience and skills." };
export default function StudentOnboardingPage() {
  return <><header className="border-b border-border bg-white"><div className="mx-auto flex min-h-22 max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10"><Brand /><Link href="/get-started" className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-primary sm:text-sm"><Icon name="arrow" className="h-4 w-4 rotate-180" />Back to role selection</Link></div></header><main className="mx-auto w-full max-w-[1000px] px-5 py-10 sm:px-8 sm:py-14"><div className="mb-7"><p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Student profile setup</p><p className="text-sm leading-6 text-muted">A few simple steps to get ready for your skills assessment.</p></div><OnboardingForm /></main></>;
}
