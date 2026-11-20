import "server-only";
import type { MockProject } from "../project-data";
export const mockProjects: MockProject[] = [
  { id: "northstar-sales-analysis", company: "Northstar Retail Ltd", title: "Sales Performance Analysis", category: "Data Analysis", projectTypes: ["Data Analysis"], workingStyle: "Remote", duration: 6, weeklyCommitment: 6, description: "Analyse anonymised sales data, identify key trends and create a simple performance dashboard for the business.", requiredSkills: ["SQL", "Excel", "Power BI", "Data Analysis"], matchReasons: [{text: "SQL capability demonstrated"}, {text: "Data analysis capability demonstrated"}, {text: "Power BI listed in your profile"}, {text: "Weekly commitment matches your availability"}, {text: "Project duration matches your preference"}], status: "Recommended" },
  { id: "brightpath-feedback-analysis", company: "BrightPath Services Ltd", title: "Customer Feedback Analysis", category: "Business Analysis / Research", projectTypes: ["Business Analysis", "Research"], workingStyle: "Hybrid", duration: 4, weeklyCommitment: 5, description: "Review customer feedback, identify recurring themes and prepare a concise findings report with recommendations.", requiredSkills: ["Excel", "Research", "Communication", "Analysis"], matchReasons: [{text: "Analytical thinking demonstrated"}, {text: "Communication learning completed"}, {text: "Weekly availability fits"}, {text: "Research experience would be developed through this project", development: true}], status: "New" },
  { id: "oakwell-dashboard", company: "Oakwell Digital Ltd", title: "Marketing Dashboard Prototype", category: "Dashboard / Reporting", projectTypes: ["Dashboard / Reporting"], workingStyle: "Remote", duration: 5, weeklyCommitment: 7, description: "Create a prototype dashboard using sample marketing data to help the company monitor campaign performance.", requiredSkills: ["Excel", "Power BI", "Data Visualisation", "Communication"], matchReasons: [{text: "Power BI experience"}, {text: "Data handling demonstrated"}, {text: "Availability matches"}, {text: "Project supports your Data Analyst career goal"}], status: "Recommended" },
];
const northstar = mockProjects.find(project => project.id === "northstar-sales-analysis")!;
export const mockProjectDetails = {
  ...northstar,
  status: "Open", location: "UK Remote",
  description: ["Northstar Retail Ltd wants to better understand its recent sales performance.", "The student will work with an anonymised sample dataset, identify key trends and create a simple performance dashboard that can support business decision-making.", "This is demo content only."],
  businessProblem: ["The company currently reviews sales data manually and wants a clearer way to identify changes in product performance, customer activity and monthly sales trends.", "The project should help the business turn raw data into useful information."],
  objectives: ["Review and understand the provided sales dataset", "Identify data quality issues", "Analyse important sales trends", "Identify useful business measures", "Build a simple Power BI dashboard", "Present key findings clearly"],
  deliverables: ["Cleaned sales dataset", "Short analysis summary", "Power BI dashboard prototype", "Key findings and recommendations", "Final project presentation"],
  skills: ["SQL", "Excel", "Power BI", "Data Analysis", "Communication"],
  usefulSkills: ["Business Analysis", "Presentation", "Retail knowledge"],
  matchReasons: ["SQL capability demonstrated", "Data handling capability demonstrated", "Power BI listed in your skills profile", "Your 6–8 hour weekly availability matches the project", "Your preferred 4–6 week project duration is suitable", "Project aligns with your Data Analyst career goal"],
  development: ["Stakeholder Communication", "Presentation Skills", "Commercial Data Analysis", "Business Reporting"],
  timeline: ["Project orientation and data review", "Data cleaning and validation", "Exploratory analysis", "Dashboard development", "Review and refinement", "Final presentation and submission"],
  supervisor: { name: "Sarah Collins", initials: "SC", role: "Operations Manager", company: northstar.company, contact: "Approximately 1 meeting per week", support: "Available during the project" },
  information: [
    { label: "Data type", value: "Anonymised sample sales data" },
    { label: "Sensitive customer information", value: "No" },
    { label: "Confidentiality requirement", value: "Project NDA may be required before workspace access" },
    { label: "Portfolio permission", value: "Selected redacted outputs may be permitted after approval" },
  ],
  commitment: [ { label: "Duration", value: "6 weeks" }, { label: "Weekly commitment", value: "Approximately 6 hours" }, { label: "Working style", value: "Remote" }, { label: "Meetings", value: "Approximately once per week" } ],
  submission: { title: "Interest Submitted", description: "Your interest has been recorded for this demo.", nextStep: "Northstar Retail Ltd will review your relevant profile and demonstrated skills.", statuses: [ { label: "Student Interest", value: "Submitted" }, { label: "SME Review", value: "Pending" }, { label: "Mutual Acceptance", value: "Pending" } ] },
};

export type ProjectDetailsData = typeof mockProjectDetails;
