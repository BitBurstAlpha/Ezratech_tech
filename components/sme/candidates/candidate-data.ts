export const candidateProject = { id: "northstar-sales-analysis", company: "Northstar Retail Ltd", title: "Sales Performance Analysis", category: "Data Analysis", duration: "6 weeks", commitment: "6 hours/week", workingStyle: "Remote", requiredSkills: ["SQL", "Excel", "Power BI", "Data Analysis", "Communication"], status: "Approved for Matching" };
export const candidatesRoute = "/sme/projects/northstar-sales-analysis/candidates";
export type MatchReason = { text: string; attention?: boolean };
export type Candidate = {
  id: string; name: string; careerGoal: string; availability: string; availabilityFit: "Matches project" | "Partial match";
  workingPreference: string; workingStyles: string[]; skills: string[]; reasons: MatchReason[];
  evidence: { label: string; status: string }[]; evidenceTypes: string[];
};
export const mockCandidates: Candidate[] = [
  { id: "alex-morgan", name: "Alex Morgan", careerGoal: "Data Analyst", availability: "6–8 hours/week", availabilityFit: "Matches project", workingPreference: "Remote / Hybrid", workingStyles: ["Remote", "Hybrid"], skills: ["SQL", "Excel", "Power BI", "Data Analysis", "Communication", "Project Delivery"],
    reasons: ["SQL capability demonstrated", "Data analysis capability demonstrated", "Power BI experience available", "Weekly availability matches", "Working preference matches", "Career goal aligns with the project"].map(text => ({ text })),
    evidence: [{ label: "Skills Assessment", status: "Available" }, { label: "Northstar-style Data Analysis Practice", status: "Available" }, { label: "Learning Plan", status: "Completed" }, { label: "Project Readiness", status: "Confirmed" }], evidenceTypes: ["Project evidence available", "Assessment evidence available"] },
  { id: "emma-clarke", name: "Emma Clarke", careerGoal: "Business / Data Analyst", availability: "5–7 hours/week", availabilityFit: "Matches project", workingPreference: "Remote", workingStyles: ["Remote"], skills: ["Excel", "Power BI", "Research", "Communication"],
    reasons: [{ text: "Power BI evidence available" }, { text: "Communication capability demonstrated" }, { text: "Availability broadly matches" }, { text: "SQL is not yet strongly evidenced", attention: true }],
    evidence: [{ label: "Skills Assessment", status: "Available" }, { label: "Reporting Practice Project", status: "Available" }, { label: "Project Readiness", status: "Confirmed" }], evidenceTypes: ["Project evidence available", "Assessment evidence available"] },
  { id: "daniel-lee", name: "Daniel Lee", careerGoal: "Junior Data Analyst", availability: "8 hours/week", availabilityFit: "Matches project", workingPreference: "Remote", workingStyles: ["Remote"], skills: ["SQL", "Python", "Data Analysis", "Excel"],
    reasons: [{ text: "SQL demonstrated" }, { text: "Data analysis demonstrated" }, { text: "Availability matches" }, { text: "Power BI evidence is limited", attention: true }],
    evidence: [{ label: "Skills Assessment", status: "Available" }, { label: "SQL Data Analysis Practice", status: "Available" }, { label: "Project Readiness", status: "Confirmed" }], evidenceTypes: ["Project evidence available", "Assessment evidence available"] },
];
export const independentCapability = "Can perform independently on bounded tasks";
export const guidedCapability = "Can perform with guidance";
export const mockCandidateEvidence = {
  "alex-morgan": {
    overview: "Alex Morgan is preparing for Data Analyst opportunities and has demonstrated capability in data handling, SQL, Power BI and analytical problem solving through EzraTech assessment and learning activities.",
    recommendation: ["Required SQL skill evidenced", "Data analysis capability demonstrated", "Power BI included in skills evidence", "Communication development completed", "Weekly availability matches the project", "Preferred working style is suitable", "Career goal aligns with the project"].map(text => ({ text })),
    skills: [
      { name: "SQL", capability: independentCapability, evidence: "Skills Assessment" },
      { name: "Data Analysis", capability: independentCapability, evidence: "Assessment + practical evidence" },
      { name: "Power BI", capability: "Evidence available", evidence: "Dashboard practice evidence" },
      { name: "Communication", capability: "Can perform with guidance / developed through learning plan", evidence: "Completed communication development" },
      { name: "Project Delivery", capability: guidedCapability, evidence: "Task planning and milestone activities" },
      { name: "Excel", capability: "Evidence available", evidence: "Data analysis practice" },
    ],
    assessment: [{ name: "Data Handling", capability: independentCapability }, { name: "Analytical Thinking", capability: independentCapability }, { name: "Communication", capability: guidedCapability }, { name: "Project Delivery", capability: guidedCapability }],
    development: ["Stakeholder Communication", "Professional Project Updates", "Task Planning & Milestones"],
    experience: { title: "Data Analysis Project", type: "University / Portfolio Project", contributions: ["Cleaned data", "Analysed trends", "Created dashboard"], skills: ["Excel", "SQL", "Power BI"] },
    location: "London, UK", preferredDuration: "4–6 weeks", commitment: "Confirmed",
  },
};
export type CandidateDecision = {
  projectId: string; candidateId: string; studentInterest: boolean; smeReviewStatus: "reviewing" | "accepted" | "not_selected" | "withdrawn";
  smeDecision: null | "accepted" | "declined"; candidateDecision: null | "accepted" | "declined";
  studentConfirmation: boolean; preStartComplete: boolean; workspaceUnlocked: boolean; notes: string; declineReason: string;
};
export const mockCandidateDecision: CandidateDecision = {
  projectId: candidateProject.id, candidateId: "alex-morgan", studentInterest: true, smeReviewStatus: "reviewing", smeDecision: null, candidateDecision: null,
  studentConfirmation: false, preStartComplete: false, workspaceUnlocked: false, notes: "", declineReason: "",
};
export const declineReasons = ["Skills do not match project requirements", "Availability does not fit", "Selected another candidate", "Project circumstances changed", "Other"];
export const matchingFactors = ["demonstrated project skills", "relevant assessment evidence", "availability", "project requirements", "working preference", "student interest"];
export const candidateFilters = {
  skills: ["SQL", "Excel", "Power BI", "Data Analysis", "Communication", "Python"],
  availability: ["Matches project", "Partial match"], evidence: ["Project evidence available", "Assessment evidence available"], workingStyle: ["Remote", "Hybrid"],
};
export type CandidateFilters = { skills: string[]; availability: string; evidence: string; workingStyle: string };
export const emptyCandidateFilters: CandidateFilters = { skills: [], availability: "", evidence: "", workingStyle: "" };
export function filterCandidates(candidates: Candidate[], filters: CandidateFilters) {
  return candidates.filter(candidate => filters.skills.every(skill => candidate.skills.includes(skill)) && (!filters.availability || candidate.availabilityFit === filters.availability) && (!filters.evidence || candidate.evidenceTypes.includes(filters.evidence)) && (!filters.workingStyle || candidate.workingStyles.includes(filters.workingStyle)));
}
