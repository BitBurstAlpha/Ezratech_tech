"use client";
import { DashboardCard, DashboardLink } from "@/components/student/dashboard/dashboard-card";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { projectCancelled } from "@/components/projects/closure/closure-data";
import { portfolioNextStep } from "./evidence-record-data";
import { RecordDetails } from "./portfolio-record-ui";
export function PortfolioEmpty() {
  const { progress, learningComplete } = useDemoProgress();
  const next = portfolioNextStep(progress);
  const cancelled = projectCancelled(progress);
  return <><DashboardCard title="Build Your Verified Portfolio"><p className="mb-6 text-sm leading-7 text-muted">Your verified experience will appear here after you complete an SME project and EzraTech reviews your project evidence.</p><RecordDetails items={[{ label: "Assessment", value: progress.assessmentComplete ? "Complete" : "In Progress" }, { label: "Learning", value: learningComplete ? "Complete" : "In Progress" }, { label: "Project Ready", value: progress.projectReady ? "Yes" : "No" }, { label: "SME Project", value: cancelled ? "Cancelled" : progress.projectCompletion.smeApproved ? "Completed" : progress.activeProject ? "Active" : "Not Started" }, { label: "Capability Review", value: progress.capabilityReview.status === "approved" ? "Complete" : "Pending" }]} /><div className="mt-6"><DashboardLink primary href={next.href}>{next.label}</DashboardLink></div></DashboardCard>
    {cancelled && <DashboardCard title={progress.cancellation.partialApproved ? "Partial Experience Reviewed" : "Partial Experience Under Review"}><h3 className="font-semibold">Sales Performance Analysis</h3><p className="mt-2 text-sm text-muted">Northstar Retail Ltd</p><p className="mt-4 text-sm font-medium text-primary">{progress.cancellation.partialApproved ? "Partial Evidence Approved" : "Evidence Review Pending"}</p><p className="my-4 text-xs leading-6 text-muted">Valid work is preserved from the cancelled project. This is a partial record, not a verified completed project.</p><DashboardLink href="/student/portfolio/northstar-sales-analysis">View Preserved Evidence</DashboardLink></DashboardCard>}</>;
}
