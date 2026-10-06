export type MatchingPreferences = { availability: string; duration: string; workingStyle: string; projectAreas: string[] };
export type MatchingAvailability = {
  supply: "available" | "no_match";
  waitlistStatus: "active" | "inactive";
  preferencesActive: boolean;
  preferences: MatchingPreferences;
  newProjectStatus: "pending_approval" | "approved";
  suggestions: string[];
  log: { text: string; date: string }[];
};
export const mockMatchingAvailability: MatchingAvailability = {
  supply: "available", waitlistStatus: "inactive", preferencesActive: true,
  preferences: { availability: "6–8 hours/week", duration: "4–6 weeks", workingStyle: "Remote / Hybrid", projectAreas: ["Data Analysis", "Dashboard / Reporting", "Business Analysis"] },
  newProjectStatus: "pending_approval", suggestions: [], log: [],
};
export function createMatchingAvailability(): MatchingAvailability { return { ...mockMatchingAvailability, preferences: { ...mockMatchingAvailability.preferences, projectAreas: [...mockMatchingAvailability.preferences.projectAreas] }, suggestions: [], log: [] }; }
export function newMatchAvailable(state: MatchingAvailability, projectAccess: boolean) { return projectAccess && state.preferencesActive && state.newProjectStatus === "approved"; }
export const demonstratedAreas = ["SQL", "Excel", "Power BI", "Data Analysis", "Communication"];
export const optionalDevelopment = [{ title: "Marketing Analytics Basics", time: "45 minutes" }, { title: "Business Dashboard Design", time: "1 hour" }, { title: "Research & Insight Communication", time: "30 minutes" }];
export const mockUpcomingProject = { id: "retail-reporting-dashboard", title: "Retail Reporting Dashboard", company: "Demo Retail Ltd", duration: "4–6 weeks", availability: "6–8 hours/week", workingStyle: "Remote / Hybrid", skills: demonstratedAreas };
export const mockUnmatchedStudents = [
  { id: "demo-2", name: "Demo Student 2", goal: "Business Analyst", evidence: ["Excel", "Research"], availability: "6 hours/week", waitlist: "Active", reason: "No suitable approved project" },
  { id: "demo-3", name: "Demo Student 3", goal: "Data Analyst", evidence: ["SQL", "Data Analysis"], availability: "5 hours/week", waitlist: "Active", reason: "Working-style requirements differ" },
  { id: "demo-4", name: "Demo Student 4", goal: "Research Analyst", evidence: ["Research", "Communication"], availability: "4 hours/week", waitlist: "Active", reason: "Preferences need review" },
  { id: "demo-5", name: "Demo Student 5", goal: "Junior Developer", evidence: ["JavaScript", "Project Delivery"], availability: "8 hours/week", waitlist: "Active", reason: "No suitable project capacity" },
  { id: "demo-6", name: "Demo Student 6", goal: "Data Analyst", evidence: ["Power BI", "Excel"], availability: "6 hours/week", waitlist: "Active", reason: "No suitable approved project" },
];
