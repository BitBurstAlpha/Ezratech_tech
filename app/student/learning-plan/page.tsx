import { packageAccess } from "@/components/packages/access";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { LearningPlan } from "@/components/student/learning-plan/learning-plan";
export const metadata: Metadata = { title: "Your Personalised Learning Plan | EzraTech", description: "Targeted learning recommendations based on Alex Morgan's demo skills assessment." };
export default async function StudentLearningPlanPage() {
  const { allowed, name } = await packageAccess("student");
  return <DashboardShell studentName={name} activePath="/student/learning-plan" title="Your Personalised Learning Plan" subtitle="Based on your assessment, EzraTech has identified a small number of areas to strengthen before you move into suitable SME projects."><LearningPlan paidAccess={allowed} studentName={name} /></DashboardShell>;
}
