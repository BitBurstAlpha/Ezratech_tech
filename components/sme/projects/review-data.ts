export type ProjectReviewStatus = "under_review" | "changes_requested" | "reviewing_update" | "approved" | "rejected";
export type ReviewCheckStatus = "approved" | "changes_requested" | "pending";
export const mockReviewProject = {
  id: "northstar-sales-analysis", company: "Northstar Retail Ltd", title: "Sales Performance Analysis",
  submittedBy: "Sarah Collins", category: "Data Analysis", duration: "6 weeks", weeklyCommitment: "6 hours",
  workingStyle: "Remote", supervisor: "Sarah Collins", data: "Anonymised sales dataset",
  confidentiality: "NDA may be required", portfolioPermission: "Subject to approval", submitted: "Today",
};
export const reviewCategories = ["Project Scope", "Business Problem", "Deliverables", "Required Skills", "Supervision", "Time Commitment", "Data & Confidentiality", "Acceptance Criteria"];
export const reviewChecklist = [
  { key: "scope", title: "Project Scope", details: "The project has a defined business problem and bounded project scope." },
  { key: "deliverables", title: "Deliverables", details: "Expected outputs are clearly defined." },
  { key: "skills", title: "Required Skills", details: "Required skills are relevant to the proposed work." },
  { key: "supervision", title: "Supervision", details: "Sarah Collins is identified as the project supervisor with approximately one hour of weekly support." },
  { key: "timeCommitment", title: "Time Commitment", details: "The proposed six-week duration and approximately six hours per week are defined." },
  { key: "dataConfidentiality", title: "Data & Confidentiality", details: "The project states that anonymised sales data will be used, but the data access process should be clarified before approval." },
  { key: "acceptanceCriteria", title: "Acceptance Criteria", details: "The project includes clear criteria for determining whether agreed work has been completed." },
] as const;
export type ReviewCheckKey = typeof reviewChecklist[number]["key"];
export type DataAccessUpdate = { dataType: string; accessMethod: string; otherAccessMethod: string; customerIdentifiableData: "No"; notes: string };
export const mockDataAccessUpdate: DataAccessUpdate = {
  dataType: "Anonymised business data", accessMethod: "Secure project workspace", otherAccessMethod: "", customerIdentifiableData: "No",
  notes: "The project will use an anonymised sales dataset. No customer names, email addresses, addresses or payment information will be included.",
};
export type ProjectReview = {
  projectId: string; status: ProjectReviewStatus; checks: Record<ReviewCheckKey, ReviewCheckStatus>;
  reviewerComments: { id: string; reviewer: string; comment: string; date: string }[];
  changesRequested: { id: string; title: string; request: string }[];
  matchingUnlocked: boolean; submittedUpdate: DataAccessUpdate | null;
};
export const mockProjectReview: ProjectReview = {
  projectId: "northstar-sales-analysis", status: "under_review",
  checks: { scope: "approved", deliverables: "approved", skills: "approved", supervision: "approved", timeCommitment: "approved", dataConfidentiality: "changes_requested", acceptanceCriteria: "approved" },
  reviewerComments: [{ id: "initial-review", reviewer: "EzraTech Project Reviewer", comment: "The project is well scoped overall.\n\nBefore approval, please clarify how the anonymised sales dataset will be shared with the student and confirm that no customer-identifiable information will be included.", date: "Today" }],
  changesRequested: [{ id: "data-access", title: "Data Access & Confidentiality", request: "Please confirm that the dataset will contain anonymised business data only and explain how students will receive access." }],
  matchingUnlocked: false, submittedUpdate: null,
};
export const reviewStatusLabels: Record<ProjectReviewStatus, string> = {
  under_review: "Under EzraTech Review", changes_requested: "Changes Requested", reviewing_update: "Reviewing Update", approved: "Approved", rejected: "Project Not Approved",
};
export const matchingNextSteps = [
  "EzraTech identifies project-ready students with relevant demonstrated skills.",
  "Suitable students can view the approved project.", "Students may express interest.",
  "Northstar Retail Ltd reviews relevant student evidence.", "Both sides must agree before the project begins.",
  "Pre-start checks are completed before workspace access.",
];
export function transitionProjectReview(review: ProjectReview, status: ProjectReviewStatus, update?: DataAccessUpdate): ProjectReview {
  if (status === "under_review") return structuredClone(mockProjectReview);
  if (status === "approved") return {
    ...review, status, matchingUnlocked: true,
    checks: { scope: "approved", deliverables: "approved", skills: "approved", supervision: "approved", timeCommitment: "approved", dataConfidentiality: "approved", acceptanceCriteria: "approved" },
  };
  return { ...review, status, matchingUnlocked: false, checks: { ...(status === "reviewing_update" ? review.checks : mockProjectReview.checks), dataConfidentiality: status === "reviewing_update" ? "pending" : "changes_requested" }, submittedUpdate: update ? { ...update } : null };
}
