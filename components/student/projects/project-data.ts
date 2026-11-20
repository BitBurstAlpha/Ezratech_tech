export type ProjectStatus = "Recommended" | "New" | "Saved" | "Interest Submitted";
export type MockProject = {
  id: string; company: string; title: string; category: string; projectTypes: string[];
  description: string; workingStyle: string; duration: number; weeklyCommitment: number;
  requiredSkills: string[]; matchReasons: { text: string; development?: boolean }[]; status: ProjectStatus;
};
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
