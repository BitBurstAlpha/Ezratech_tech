import { mockVerifiedExperience } from "./experience-data";

export const mockStudentPortfolio = {
  name: "Alex Morgan", careerGoal: "Data Analyst", location: "London, United Kingdom", shortLocation: "London, UK", profileStatus: "Complete", readiness: "Ready",
  summary: "Aspiring data analyst with demonstrated experience in data handling, SQL, Power BI and business reporting through supervised SME project work.",
  availability: "6–8 hours per week", preferredWork: "Remote / Hybrid",
  profileSkills: ["SQL", "Excel", "Power BI", "Python", "Data Analysis", "Communication", "Project Delivery"],
  learningAreas: ["Stakeholder Communication", "Professional Project Updates", "Task Planning & Milestone Management"],
  projectAreas: ["Data Analysis", "Dashboard / Reporting", "Business Analysis", "Research"],
  careerInterests: ["Data Analytics", "Business Intelligence", "Reporting", "Decision Support"],
  overview: [{ label: "Verified Projects", value: 1 }, { label: "Demonstrated Skills", value: 7 }, { label: "Completed Learning Activities", value: 3 }, { label: "Verified Experience Records", value: 1 }],
};
export const mockPortfolioSkills = [
  { name: "SQL", evidence: "Northstar Sales Performance Analysis", capability: "Can perform independently on bounded tasks" },
  { name: "Power BI", evidence: "Northstar Dashboard Project", capability: "Can perform independently on bounded tasks" },
  { name: "Data Analysis", evidence: "Skills Assessment + SME Project", capability: "Can perform independently on bounded tasks" },
  { name: "Data Handling", evidence: "Assessment + Project Data Cleaning", capability: "Can perform independently on bounded tasks" },
  { name: "Communication", evidence: "Learning Activities + Project Updates + Final Presentation", capability: "Can perform independently on bounded tasks" },
  { name: "Project Delivery", evidence: "Completed SME project tasks and milestones", capability: "Can perform with guidance" },
  { name: "Problem Solving", evidence: "Resolved data quality issues during SME project", capability: "Can perform independently on bounded tasks" },
];
export const mockPortfolioProjects = [{ company: mockVerifiedExperience.company, title: mockVerifiedExperience.project, status: "Verified", duration: "6 weeks", workingStyle: "Remote", summary: "Analysed anonymised retail sales data, resolved data quality issues and created a Power BI dashboard to support business reporting.", skills: mockVerifiedExperience.previewSkills, href: "/student/portfolio/northstar-sales-analysis" }];
export const mockPortfolioEvidence = [
  { title: "Sales Analysis Summary", type: "Reviewed Project Evidence" }, { title: "Power BI Dashboard", type: "Reviewed Project Evidence" },
  { title: "Final Presentation", type: "Reviewed Project Evidence" }, { title: "Weekly Project Updates", type: "Project Delivery Evidence" },
  { title: "Skills Assessment", type: "Assessment Evidence" },
];
export const mockEmployerFeedback = { company: mockVerifiedExperience.company, reviewer: mockVerifiedExperience.smeFeedback.reviewer, text: mockVerifiedExperience.smeFeedback.feedback, categories: mockVerifiedExperience.smeFeedback.categories.filter(item => item.label !== "Project Delivery") };
export const mockFullPortfolioVisibility = { summary: true, projects: true, skills: true, feedback: true, evidence: false, location: true, availability: false };
export type FullPortfolioVisibility = typeof mockFullPortfolioVisibility;
export const fullVisibilityOptions: { key: keyof FullPortfolioVisibility; label: string }[] = [
  { key: "summary", label: "Show professional summary" }, { key: "projects", label: "Show verified projects" }, { key: "skills", label: "Show demonstrated skills" },
  { key: "feedback", label: "Show employer feedback" }, { key: "evidence", label: "Show project evidence" }, { key: "location", label: "Show location" }, { key: "availability", label: "Show availability" },
];
export const mockPortfolioStatus = [{ label: "Profile", status: "Complete" }, { label: "Skills Evidence", status: "Available" }, { label: "Verified Project", status: "Available" }, { label: "Employer Feedback", status: "Available" }, { label: "Learning Record", status: "Available" }, { label: "Portfolio Visibility", status: "Configured" }];
