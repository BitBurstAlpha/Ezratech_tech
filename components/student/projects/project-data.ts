export type ProjectStatus = "Recommended" | "New" | "Saved" | "Interest Submitted";
export type MockProject = {
  id: string; company: string; title: string; category: string; projectTypes: string[];
  description: string; workingStyle: string; duration: number; weeklyCommitment: number;
  requiredSkills: string[]; matchReasons: { text: string; development?: boolean }[]; status: ProjectStatus;
};
export const mockProjects: MockProject[] = [
  { id: "northstar-sales-analysis", company: "Northstar Retail Ltd", title: "Sales Performance Analysis", category: "Data Analysis", projectTypes: ["Data Analysis"], workingStyle: "Remote", duration: 6, weeklyCommitment: 6, description: "Analyse anonymised sales data, identify key trends and create a simple performance dashboard for the business.", requiredSkills: ["SQL", "Excel", "Power BI", "Data Analysis"], matchReasons: [{text: "SQL capability demonstrated"}, {text: "Data analysis capability demonstrated"}, {text: "Power BI listed in your profile"}, {text: "Weekly commitment matches your availability"}, {text: "Project duration matches your preference"}], status: "Recommended" },
  { id: "brightpath-feedback-analysis", company: "BrightPath Services Ltd", title: "Customer Feedback Analysis", category: "Business Analysis / Research", projectTypes: ["Business Analysis", "Research"], workingStyle: "Hybrid", duration: 4, weeklyCommitment: 5, description: "Review customer feedback, identify recurring themes and prepare a concise findings report with recommendations.", requiredSkills: ["Excel", "Research", "Communication", "Analysis"], matchReasons: [{text: "Analytical thinking demonstrated"}, {text: "Communication learning completed"}, {text: "Weekly availability fits"}, {text: "Research experience would be developed through this project", development: true}], status: "New" },
  { id: "oakwell-dashboard", company: "Oakwell Digital Ltd", title: "Marketing Dashboard Prototype", category: "Dashboard / Reporting", projectTypes: ["Dashboard / Reporting"], workingStyle: "Remote", duration: 5, weeklyCommitment: 7, description: "Create a prototype dashboard using sample marketing data to help the company monitor campaign performance.", requiredSkills: ["Excel", "Power BI", "Data Visualisation", "Communication"], matchReasons: [{text: "Power BI experience"}, {text: "Data handling demonstrated"}, {text: "Availability matches"}, {text: "Project supports your Data Analyst career goal"}], status: "Recommended" },
];
export const mockMarketplaceStudent = { name: "Alex Morgan", careerGoal: "Data Analyst", strengths: ["Data Handling", "Analytical Thinking", "SQL", "Excel", "Power BI"], developmentCompleted: ["Stakeholder Communication", "Project Planning"], availability: "6–8 hours per week", duration: "4–6 weeks", workingStyle: "Remote or Hybrid" };
export const projectFilterOptions = { types: ["Data Analysis", "Business Analysis", "Dashboard / Reporting", "Research", "Digital Operations", "Technology"], durations: ["2–4 weeks", "4–6 weeks", "6–8 weeks"], styles: ["Remote", "Hybrid", "On-site"], commitments: ["3–5 hours", "6–8 hours", "9–12 hours"] };
export const matchExplanation = { factors: ["demonstrated skills", "relevant evidence", "project requirements", "availability", "working preference", "development goals"], note: "The match explanation is simulated for this prototype and should not be treated as a final automated decision." };
export type ProjectFilters = { search: string; type: string; duration: string; style: string; commitment: string };
export const initialProjectFilters: ProjectFilters = { search: "", type: "", duration: "", style: "", commitment: "" };
function inRange(value: number, range: string) {
  if (!range) return true;
  const [minimum, maximum] = range.match(/\d+/g)?.map(Number) ?? [];
  return value >= minimum && value <= maximum;
}
export function filterProjects(projects: MockProject[], filters: ProjectFilters) {
  const search = filters.search.trim().toLowerCase();
  return projects.filter(project => (!search || [project.title, project.company, project.category, project.description, ...project.requiredSkills].join(" ").toLowerCase().includes(search)) && (!filters.type || project.projectTypes.includes(filters.type)) && (!filters.style || project.workingStyle === filters.style) && inRange(project.duration, filters.duration) && inRange(project.weeklyCommitment, filters.commitment));
}
