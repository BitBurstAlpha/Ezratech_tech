export type ApplicationStatus = "sme_review" | "sme_accepted" | "closed";
export const mockApplication = {
  id: "northstar-sales-analysis", company: "Northstar Retail Ltd", project: "Sales Performance Analysis", student: "Alex Morgan",
  status: "sme_review" as ApplicationStatus, submittedAt: "Today", smeDecision: null as "accepted" | "declined" | null,
  studentConfirmed: false, preStartComplete: false, workspaceUnlocked: false,
};
export const mockApplicationReview = {
  careerGoal: "Data Analyst", skills: ["SQL", "Excel", "Power BI", "Data Analysis"], development: ["Stakeholder Communication", "Project Planning"], evidence: ["Skills Assessment", "Previous Project Evidence", "Readiness Status"], availability: "6–8 hours per week", workingPreference: "Remote / Hybrid",
  permissionNote: "This is simulated demo information. In a live service, access would depend on the student's permissions and the project requirements.",
  matchReasons: ["SQL capability demonstrated", "Data analysis capability demonstrated", "Power BI experience", "Weekly availability matches", "Project duration fits", "Career goal aligns with the project"],
  checks: [{ label: "Profile Review", status: "In Progress" }, { label: "Skills Evidence", status: "Available" }, { label: "Availability", status: "Confirmed" }, { label: "SME Decision", status: "Pending" }],
  nextSteps: ["The SME reviews your relevant profile and evidence.", "The SME decides whether they would like to continue.", "If selected, you review the final project arrangement.", "Both sides confirm participation.", "Required checks and agreements are completed.", "The project workspace opens."],
};
export function applicationJourney(status: ApplicationStatus) {
  return [
    { label: "Student Interest", status: "Completed" },
    { label: "SME Review", status: status === "sme_review" ? "Current" : "Completed" },
    { label: "SME Decision", status: status === "sme_review" ? "Pending" : status === "sme_accepted" ? "Accepted" : "Application Closed" },
    { label: "Student Confirmation", status: status === "sme_accepted" ? "Current" : "Pending" },
    { label: "Pre-Start Checks", status: "Locked" },
    { label: "Project Workspace", status: "Locked" },
  ];
}
