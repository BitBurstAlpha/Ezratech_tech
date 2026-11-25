import { packageAccess } from "@/components/packages/access";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { LearningPlan } from "@/components/student/learning-plan/learning-plan";
export const metadata: Metadata = { title: "Your Personalised Learning Plan | EzraTech", description: "Targeted learning recommendations based on Alex Morgan's demo skills assessment." };
export default async function StudentLearningPlanPage({ searchParams }: PageProps<"/student/learning-plan">) {
  const { allowed, name } = await packageAccess("student");
  const { marketplace } = await searchParams;
  return <DashboardShell studentName={name} activePath="/student/learning-plan" title="Your Personalised Learning Plan" subtitle="Based on your assessment, EzraTech has identified a small number of areas to strengthen before you move into suitable SME projects.">{!name && <p role="status" className="mb-4">Project Marketplace is locked. <a className="underline" href="/demo#payment-demo">Select a student identity in the Demo Control Centre</a> before starting courses to record verified progress.</p>}{marketplace === "courses" && <p role="status" className="mb-4">Complete every required course below to continue towards Project Marketplace access.</p>}<LearningPlan paidAccess={allowed} studentName={name} /></DashboardShell>;
}
