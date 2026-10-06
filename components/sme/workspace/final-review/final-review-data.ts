import type { ProjectCompletion, ProjectSubmission } from "@/components/student/workspace/completion/completion-data";
export const finalCriteria = [
  { key: "datasetQuality", label: "Dataset quality issues documented" }, { key: "analysis", label: "Main sales trends analysed" },
  { key: "dashboard", label: "Dashboard includes agreed business measures" }, { key: "presentation", label: "Findings presented clearly" },
  { key: "deliverables", label: "Final deliverables submitted" },
] as const;
export type FinalCriterionKey = typeof finalCriteria[number]["key"];
export const finalFeedbackFields = [{ key: "quality", label: "Quality of Work" }, { key: "communication", label: "Communication" }, { key: "reliability", label: "Reliability" }, { key: "problemSolving", label: "Problem Solving" }, { key: "delivery", label: "Project Delivery" }] as const;
export type FinalFeedbackKey = typeof finalFeedbackFields[number]["key"];
export const portfolioPermissionFields = [{ key: "projectTitle", label: "Project Title" }, { key: "companyName", label: "Company Name" }, { key: "projectSummary", label: "Project Summary" }, { key: "skills", label: "Demonstrated Skills" }, { key: "feedback", label: "SME Feedback" }, { key: "deliverables", label: "Approved Redacted Deliverables" }] as const;
export type PortfolioPermissionKey = typeof portfolioPermissionFields[number]["key"];
export type FinalReviewStatus = "pending" | "changes_requested" | "resubmitted" | "accepted";
export type FinalSMEReview = {
  projectId: string; studentId: string; reviewedDeliverableIds: string[];
  acceptanceCriteria: Record<FinalCriterionKey, "met" | "needs_changes">;
  feedback: Record<FinalFeedbackKey, string> & { general: string };
  portfolioPermissions: Record<PortfolioPermissionKey, "Allowed" | "Not Allowed" | "Subject to Approval">;
  portfolioPermissionsReviewed: boolean;
  changeRequest: { categories: string[]; text: string; requestedDate: string } | null;
};
export const mockFinalSMEReview: FinalSMEReview = {
  projectId: "northstar-sales-analysis", studentId: "alex-morgan", reviewedDeliverableIds: [],
  acceptanceCriteria: { datasetQuality: "met", analysis: "met", dashboard: "met", presentation: "met", deliverables: "met" },
  feedback: { quality: "Positive", communication: "Positive", reliability: "Positive", problemSolving: "Positive", delivery: "Completed as Agreed", general: "Alex completed the agreed analysis and dashboard work and communicated clearly when data issues were identified.\n\nThe final dashboard addressed the agreed business requirements and the project was completed as expected." },
  portfolioPermissions: { projectTitle: "Allowed", companyName: "Allowed", projectSummary: "Allowed", skills: "Allowed", feedback: "Allowed", deliverables: "Subject to Approval" },
  portfolioPermissionsReviewed: false, changeRequest: null,
};
export const finalChangeCategories = ["Dataset", "Analysis", "Dashboard", "Presentation", "Documentation", "Other"];
export const defaultFinalChange = "Please add a comparison between the current month's sales and the previous month to the dashboard before final approval.";
export const finalNextSteps = ["Project completion is recorded.", "SME feedback is saved in the demo record.", "EzraTech reviews the relevant project evidence.", "Supported skills and capability evidence are recorded.", "The completed project can appear in the student's verified experience record."];
export const finalAcceptanceDistinction = "Project acceptance confirms that the agreed work was completed. EzraTech's reviewed experience record is prepared separately using the project evidence, student contribution and SME feedback. The SME is not automatically verifying every skill claimed by the student.";
export function finalReviewStatus(completion: ProjectCompletion): FinalReviewStatus { return completion.smeApproved ? "accepted" : completion.changesRequested ? "changes_requested" : completion.resubmitted ? "resubmitted" : "pending"; }
export function finalReviewReady(review: FinalSMEReview, submission: ProjectSubmission) {
  return submission.deliverables.length === 4 && submission.deliverables.every(item => item.file && review.reviewedDeliverableIds.includes(item.id))
    && finalCriteria.every(item => review.acceptanceCriteria[item.key] === "met")
    && Boolean(review.feedback.general.trim()) && finalFeedbackFields.every(item => !!review.feedback[item.key]) && review.portfolioPermissionsReviewed;
}
export const deliverablePreviews: Record<string, string> = {
  dataset: "Demo preview of an anonymised, cleaned sales dataset. Duplicate rows, missing values and inconsistent categories are documented in the cleaning notes.",
  analysis: "Demo preview of a sales analysis summary covering monthly trends, product categories and key findings for the business.",
  dashboard: "Demo preview of a Power BI dashboard with agreed sales measures, category comparisons and monthly performance views.",
  presentation: "Demo preview of the final presentation covering the student's contribution, analysis findings, dashboard walkthrough and recommendations.",
};
