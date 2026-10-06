import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/landing/brand";
import { Icon } from "@/components/landing/icon";
import { RoleCard } from "@/components/role-selection/role-card";

export const metadata: Metadata = {
  title: "Get Started | EzraTech",
  description: "Choose how you would like to use EzraTech as a student or an SME.",
};

export default function GetStartedPage() {
  return (
    <>
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex min-h-22 max-w-7xl items-center justify-between gap-4 px-6 lg:px-10">
          <Brand />
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-primary sm:text-sm">
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            Back to Home
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-20 lg:px-10">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Get started with EzraTech</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-[40px]">How would you like to use EzraTech?</h1>
          <p className="mt-4 text-base leading-7 text-muted">Choose the option that best describes you.</p>
        </div>
        <div className="grid items-stretch gap-6 md:grid-cols-2">
          <RoleCard
            title="I’m a Student"
            description="Assess your skills, build practical experience, and work on real SME projects."
            points={[
              "Understand your current skills",
              "Receive targeted learning recommendations",
              "Build verified experience through real projects",
            ]}
            buttonLabel="Continue as Student"
            href="/student/register"
            icon="student"
          />
          <RoleCard
            title="I’m an SME"
            description="Submit real business projects, review suitable candidates, and work with emerging talent."
            points={[
              "Submit structured project briefs",
              "Review matched student candidates",
              "Track projects and provide feedback",
            ]}
            buttonLabel="Continue as SME"
            href="/sme/register"
            icon="project"
          />
        </div>
      </main>
    </>
  );
}
