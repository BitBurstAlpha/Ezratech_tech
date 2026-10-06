import { mockProjects } from "../project-data";
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
