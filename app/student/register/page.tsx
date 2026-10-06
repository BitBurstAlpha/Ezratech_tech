import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/landing/brand";
import { Icon } from "@/components/landing/icon";
import { RegistrationForm } from "@/components/student/registration-form";

export const metadata: Metadata = {
  title: "Create your student account | EzraTech",
  description: "Start building your EzraTech skills profile and prepare for real project opportunities.",
};

const nextSteps = [
  "Complete your profile",
  "Add your education and experience",
  "Take a practical skills assessment",
  "Receive your personalised learning plan",
  "Become ready for suitable SME projects",
];

export default function StudentRegistrationPage() {
  return (
    <>
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex min-h-22 max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <Brand />
          <Link href="/get-started" className="inline-flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-primary sm:text-sm">
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            Back to role selection
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[640px] px-5 py-10 sm:px-6 sm:py-14">
        <section aria-labelledby="registration-title" className="rounded-xl border border-border bg-white p-6 shadow-[0_3px_20px_rgba(51,52,56,0.04)] sm:p-9">
          <div className="mb-7">
            <div className="mb-5 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              <Icon name="student" className="h-5 w-5" />
              Student registration
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
            <h1 id="registration-title" className="text-[28px] font-semibold leading-tight tracking-tight sm:text-[32px]">Create your student account</h1>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">Start building your skills profile and prepare for real project opportunities.</p>
          </div>
          <RegistrationForm />
        </section>
        <aside aria-labelledby="next-steps-title" className="mt-6 rounded-xl border border-[#dceaf3] bg-blue-light p-6 sm:px-8">
          <h2 id="next-steps-title" className="mb-4 text-base font-semibold">What happens next?</h2>
          <ol className="space-y-3">
            {nextSteps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm leading-6 text-muted">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold text-primary">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </aside>
      </main>
    </>
  );
}
