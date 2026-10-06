export type Deliverable = { id: string; title: string; file: string | null; required: boolean };
export const mockDeliverables: Deliverable[] = [
  { id: "dataset", title: "Cleaned Sales Dataset", file: "Northstar_Cleaned_Sales_Data.xlsx", required: true },
  { id: "analysis", title: "Sales Analysis Summary", file: "Sales_Analysis_Summary.pdf", required: true },
  { id: "dashboard", title: "Power BI Dashboard", file: "Northstar_Sales_Dashboard.pbix", required: true },
  { id: "presentation", title: "Final Presentation", file: "Northstar_Final_Presentation.pptx", required: true },
];
export const mockStudentReflection = {
  learned: "I improved my ability to explain technical findings in a business context and became more confident in planning analysis work around project milestones.",
  challenging: "Clarifying inconsistent product categories before completing the analysis.",
  differently: "I would confirm business definitions earlier in the project before beginning the full analysis.",
};
export const mockSMEFeedback = {
  reviewer: "Sarah Collins", role: "Operations Manager",
  feedback: "Alex completed the agreed analysis and dashboard work and communicated clearly when data issues were identified.",
  categories: [{ label: "Quality of Work", value: "Positive" }, { label: "Communication", value: "Positive" }, { label: "Reliability", value: "Positive" }, { label: "Problem Solving", value: "Positive" }, { label: "Project Delivery", value: "Completed as agreed" }],
  changesMessage: "The dashboard is clear, but please add a short comparison between this month's sales and the previous month before final approval.",
  changes: ["Add previous month comparison", "Update final dashboard", "Resubmit dashboard file"],
};
export type ProjectCompletion = { resubmitted: boolean; tasksComplete: boolean; milestonesComplete: boolean; finalSubmitted: boolean; smeReviewStatus: "pending" | "changes_requested" | "approved"; changesRequested: boolean; smeApproved: boolean; capabilityReviewReady: boolean; verifiedExperienceReady: boolean };
export const mockProjectCompletion: ProjectCompletion = { resubmitted: false, tasksComplete: true, milestonesComplete: true, finalSubmitted: false, smeReviewStatus: "pending", changesRequested: false, smeApproved: false, capabilityReviewReady: false, verifiedExperienceReady: false };
export const contributionOptions = ["Data Cleaning", "Data Analysis", "SQL Queries", "Power BI Dashboard", "Business Recommendations", "Final Presentation"];
export const skillOptions = ["SQL", "Excel", "Power BI", "Data Analysis", "Communication", "Project Delivery", "Problem Solving", "Presentation"];
export const finalConfirmations = ["I confirm that this submission represents my own contribution to the project.", "I have identified any AI-assisted work where appropriate.", "I understand that the SME will review the submitted work.", "I understand that submission does not automatically mean every skill will be verified."];
export const mockSubmission = {
  deliverables: mockDeliverables,
  summary: "During this project, I reviewed and cleaned the sales dataset, analysed key sales trends and created a Power BI dashboard to help Northstar Retail Ltd understand monthly performance.\n\nI also identified duplicate customer records and inconsistent product categories and documented the changes made during the analysis.",
  contributions: [...contributionOptions],
  individualContribution: "I completed the data cleaning and analysis, created the Power BI dashboard and prepared the final findings presentation.",
  skills: [...skillOptions],
  reflection: { ...mockStudentReflection },
  confirmations: [] as string[],
};
export type ProjectSubmission = typeof mockSubmission;
export function submissionReady(submission: ProjectSubmission) {
  return submission.deliverables.filter(file => file.required).length === 4
    && submission.deliverables.every(file => !file.required || Boolean(file.file?.trim()))
    && Boolean(submission.summary.trim() && submission.individualContribution.trim())
    && submission.contributions.length > 0 && submission.skills.length > 0
    && Object.values(submission.reflection).every(value => value.trim())
    && finalConfirmations.every(confirmation => submission.confirmations.includes(confirmation));
}
export const acceptanceDistinction = "Project acceptance confirms that the agreed work was completed. Verified skill evidence is recorded separately based on the student's contribution, reviewed deliverables and project feedback.";
