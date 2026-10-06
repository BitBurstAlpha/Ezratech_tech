import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { LearningPlan } from "@/components/student/learning-plan/learning-plan";
export const metadata: Metadata = { title: "Your Personalised Learning Plan | EzraTech", description: "Targeted learning recommendations based on Alex Morgan's demo skills assessment." };
export default function StudentLearningPlanPage() {
  return <DashboardShell activePath="/student/learning-plan" title="Your Personalised Learning Plan" subtitle="Based on your assessment, EzraTech has identified a small number of areas to strengthen before you move into suitable SME projects."><LearningPlan /></DashboardShell>;
}
