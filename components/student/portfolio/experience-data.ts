import { mockSMEFeedback } from "@/components/student/workspace/completion/completion-data";

export const mockPortfolioVisibility = { title: true, company: true, summary: true, skills: true, feedback: true, deliverables: false };
export type PortfolioVisibility = typeof mockPortfolioVisibility;
export const visibilityOptions: { key: keyof PortfolioVisibility; label: string }[] = [
  { key: "title", label: "Show project title" }, { key: "company", label: "Show company name" },
  { key: "summary", label: "Show project summary" }, { key: "skills", label: "Show demonstrated skills" },
  { key: "feedback", label: "Show SME feedback" }, { key: "deliverables", label: "Show approved deliverables" },
];
export const mockVerifiedExperience = {
  student: "Alex Morgan", careerGoal: "Data Analyst", company: "Northstar Retail Ltd", project: "Sales Performance Analysis", duration: "6 weeks", status: "verified", role: "Student Project Contributor", workingStyle: "Remote", supervisor: "Sarah Collins", portfolioAdded: false,
  brief: ["Northstar Retail Ltd wanted to better understand its sales performance and improve how monthly sales information was reported.", "Alex worked with an anonymised sales dataset, reviewed data quality issues, analysed sales trends and created a Power BI dashboard prototype."],
  contribution: ["Reviewed and cleaned the sales dataset", "Identified duplicate records and inconsistent categories", "Performed exploratory sales analysis", "Created SQL queries for analysis", "Built a Power BI dashboard", "Prepared findings and recommendations", "Presented the completed work"],
  reviewedDeliverables: ["Cleaned Sales Dataset", "Sales Analysis Summary", "Power BI Dashboard", "Final Presentation"],
  demonstratedSkills: [
    { name: "SQL", evidence: "Demonstrated through project work" },
    { name: "Data Analysis", evidence: "Demonstrated through project work" },
    { name: "Power BI", evidence: "Demonstrated through project work" },
    { name: "Data Handling", evidence: "Demonstrated through project work" },
    { name: "Communication", evidence: "Demonstrated through project updates and presentation" },
    { name: "Project Delivery", evidence: "Demonstrated through milestones and completed deliverables" },
    { name: "Problem Solving", evidence: "Demonstrated through handling data quality issues" },
  ],
  capabilityEvidence: [
    { name: "Data Handling", level: "Can perform independently on bounded tasks", evidence: "Cleaned project dataset and documented data quality issues" },
    { name: "Data Analysis", level: "Can perform independently on bounded tasks", evidence: "Completed sales analysis and identified key business trends" },
    { name: "Communication", level: "Can perform independently on bounded tasks", evidence: "Weekly project updates and final presentation" },
    { name: "Project Delivery", level: "Can perform with guidance", evidence: "Completed agreed tasks and milestones within a supervised project" },
  ],
  reviewer: "EzraTech Reviewer", smeFeedback: mockSMEFeedback,
  timeline: ["Project Started", "Data Review Completed", "Analysis Completed", "Dashboard Developed", "Final Review", "Project Completed"],
  previewSkills: ["SQL", "Power BI", "Data Analysis", "Communication", "Project Delivery"],
  summary: "Analysed anonymised retail sales data, resolved data quality issues and developed a Power BI dashboard to support business reporting.",
  recordDetails: [{ label: "Project Brief", status: "Available" }, { label: "Project Dates", status: "Recorded" }, { label: "Individual Contribution", status: "Recorded" }, { label: "Reviewed Deliverables", status: "Recorded" }, { label: "Assessment Criteria", status: "Recorded" }, { label: "SME Reviewer", status: "Recorded" }, { label: "Capability Review", status: "Recorded" }, { label: "Portfolio Permission", status: "Recorded" }],
};
