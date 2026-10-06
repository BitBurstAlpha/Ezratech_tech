import type { DemoProgress } from "@/components/student/progress/progress-state";
import { capabilityDefinitions, capabilityLevels, type CapabilityKey } from "@/components/admin/capability/capability-data";
import { projectCancelled } from "@/components/projects/closure/closure-data";
import { learningComplete } from "@/components/student/progress/progress-state";
import type { PortfolioPermissionKey } from "@/components/sme/workspace/final-review/final-review-data";
import { mockStudentPortfolio } from "./portfolio-data";
import { mockVerifiedExperience } from "./experience-data";

export const mockPortfolio = mockStudentPortfolio;
export const mockVerifiedExperiences = [{ ...mockVerifiedExperience, id: "northstar-sales-analysis", studentId: "alex-morgan", category: "Data Analysis", role: "Data Analysis Project Contributor", dates: { start: "1 September 2026", end: "15 October 2026" }, workload: "Approx. 6 hours/week", estimatedHours: 36, reviewer: "EzraTech Capability Reviewer" }];
export const mockCapabilityEvidence = capabilityDefinitions;
export const mockApprovedPortfolioMaterials: { title: string; permission?: PortfolioPermissionKey; prohibited?: boolean }[] = [
  { title: "Power BI Dashboard Screenshot", permission: "deliverables" },
  { title: "Redacted Findings Summary", permission: "deliverables" },
  { title: "Project Description", permission: "projectSummary" },
  { title: "Student Contribution Summary", permission: "projectSummary" },
  { title: "Customer / confidential data", prohibited: true },
  { title: "Raw SME Dataset", prohibited: true },
];
export const evidenceSources = ["Skills Assessment", "Learning Plan", "Reassessment", "Project Tasks", "Weekly Updates", "Project Messages", "Final Submission", "SME Feedback", "Capability Review"];
export function experienceVerified(progress: DemoProgress) {
  return !projectCancelled(progress) && progress.verifiedExperience && progress.projectCompletion.smeApproved && progress.capabilityReview.status === "approved" && progress.capabilityReview.verifiedExperienceReady;
}
export function verifiedExperiences(progress: DemoProgress) { return experienceVerified(progress) ? mockVerifiedExperiences : []; }
export function verifiedCapabilities(progress: DemoProgress) {
  if (!experienceVerified(progress)) return [];
  return capabilityDefinitions.filter(item => progress.capabilityReview.capabilities[item.key].decision !== "not_evidenced" && progress.capabilityReview.capabilities[item.key].evidence.length > 0).map(item => ({ key: item.key as CapabilityKey, name: item.name, decision: progress.capabilityReview.capabilities[item.key].decision, level: capabilityLevels[progress.capabilityReview.capabilities[item.key].decision], evidence: progress.capabilityReview.capabilities[item.key].evidence.join(" · ") }));
}
export function approvedPortfolioMaterials(progress: DemoProgress) {
  return mockApprovedPortfolioMaterials.map(material => {
    const permission = material.permission ? progress.finalSMEReview.portfolioPermissions[material.permission] : "Not Allowed";
    const status = material.prohibited || permission === "Not Allowed" ? "Not Approved" : !experienceVerified(progress) || !progress.finalSMEReview.portfolioPermissionsReviewed || permission === "Subject to Approval" ? "Approval Pending" : "Approved";
    return { ...material, status };
  });
}
export function portfolioNextStep(progress: DemoProgress) {
  if (progress.projectCompletion.smeApproved && !experienceVerified(progress)) return { label: "View Project Status", href: "/student/workspace/northstar-sales-analysis/complete" };
  if (progress.activeProject || projectCancelled(progress)) return { label: "Open Workspace", href: "/student/workspace/northstar-sales-analysis" };
  if (!learningComplete(progress)) return { label: "Continue Learning", href: "/student/learning-plan" };
  if (progress.projectReady) return { label: "Explore Projects", href: "/student/projects" };
  return { label: "Continue to Readiness", href: "/student/readiness" };
}
export function reviewedDeliverables(progress: DemoProgress) {
  const accepted = experienceVerified(progress) && progress.projectCompletion.smeApproved;
  return [...progress.submission.deliverables.map(item => ({ title: item.title, status: accepted && !!item.file ? "Accepted" : "Review Pending", source: item.title })), { title: "Findings & Recommendations", status: accepted && !!progress.submission.deliverables.find(item => item.id === "analysis")?.file ? "Accepted" : "Review Pending", source: "Sales Analysis Summary and Final Presentation" }];
}
export function individualContributions(progress: DemoProgress) {
  const completed = (id: string) => progress.workspaceTasks.some(task => task.id === id && task.status === "Completed");
  return [
    { text: "Reviewing the dataset structure", supported: completed("review") },
    { text: "Identifying data-quality issues", supported: completed("cleaning") },
    { text: "Cleaning duplicate and inconsistent records", supported: completed("cleaning") && progress.submission.contributions.includes("Data Cleaning") },
    { text: "Writing SQL queries", supported: progress.submission.contributions.includes("SQL Queries") && !!progress.capabilityReview.capabilities.sql.evidence.length },
    { text: "Analysing sales performance", supported: completed("analysis") },
    { text: "Developing a Power BI dashboard", supported: completed("dashboard") },
    { text: "Preparing findings and recommendations", supported: progress.submission.contributions.includes("Business Recommendations") },
    { text: "Presenting final project outputs", supported: completed("presentation") },
    { text: "Communicating progress and blockers", supported: !!progress.workspace.studentUpdates.length && !!progress.workspace.messages.length },
  ].filter(item => item.supported).map(item => item.text);
}
