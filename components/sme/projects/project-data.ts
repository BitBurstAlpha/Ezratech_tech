export const projectSteps = ["Project Basics", "Business Problem", "Deliverables & Skills", "Delivery Setup", "Data & Confidentiality", "Review & Submit"];
export const projectCategories = ["Data Analysis", "Business Analysis", "Dashboard / Reporting", "Market Research", "Process Improvement", "Digital Operations", "Software / Technology", "Marketing", "Other"];
export const requiredSkillOptions = ["SQL", "Excel", "Power BI", "Python", "Data Analysis", "Business Analysis", "Research", "Communication", "Project Management", "Presentation", "JavaScript", "Other"];
export const optionalSkillOptions = ["Business Analysis", "Presentation", "Retail Knowledge", "Research"];
export const restrictionOptions = ["No production system access", "No customer personal data", "No live payment system access", "No direct customer contact", "No external publishing without approval", "Other"];
export const projectConfirmations = [
  "I confirm that this project description is accurate for this prototype.",
  "I understand that submitting a project does not automatically make it available to students.",
  "I understand that EzraTech would review scope, supervision, data requirements and project arrangements before approval.",
];
export type ProjectDraft = {
  id: string; company: string; title: string; category: string; status: "draft" | "under-review";
  summary: string; workingStyle: string; duration: string; customDuration: string; weeklyCommitment: string; customCommitment: string;
  businessProblem: string; businessValue: string; successfulOutcome: string;
  objectives: string[]; deliverables: string[]; requiredSkills: string[]; optionalSkills: string[]; otherSkill: string;
  supervisor: { usePrimaryContact: string; name: string; jobTitle: string; email: string };
  supervisionTime: string; meetingFrequency: string; meetingFormat: string;
  timeline: { week: string; label: string }[]; acceptanceCriteria: string[];
  dataRequirements: { access: string; type: string; description: string; sensitive: string };
  confidentiality: { nda: string; portfolioPermission: string }; restrictions: string[]; otherRestriction: string;
};
export const mockSMEProjectDraft: ProjectDraft = {
  id: "northstar-sales-analysis", company: "Northstar Retail Ltd", title: "Sales Performance Analysis", category: "Data Analysis", status: "draft",
  summary: "Analyse anonymised sales data, identify key trends and create a simple performance dashboard for the business.",
  workingStyle: "Remote", duration: "4–6 weeks", customDuration: "", weeklyCommitment: "6–8 hours", customCommitment: "",
  businessProblem: "Northstar Retail currently reviews sales data manually and wants a clearer way to understand product performance, customer activity and monthly sales trends.",
  businessValue: "The project should help the business turn raw sales data into clearer information for monthly decision-making.",
  successfulOutcome: "A cleaned dataset, clear sales analysis and a simple Power BI dashboard that the team can review during monthly reporting.",
  objectives: ["Review the provided sales dataset", "Identify data quality issues", "Analyse important sales trends", "Define useful business measures", "Build a simple dashboard", "Present findings clearly"],
  deliverables: ["Cleaned sales dataset", "Short analysis summary", "Power BI dashboard prototype", "Key findings and recommendations", "Final presentation"],
  requiredSkills: ["SQL", "Excel", "Power BI", "Data Analysis", "Communication"], optionalSkills: [], otherSkill: "",
  supervisor: { usePrimaryContact: "Yes", name: "", jobTitle: "", email: "" }, supervisionTime: "Around 1 hour", meetingFrequency: "Weekly", meetingFormat: "Online",
  timeline: ["Orientation and Data Review", "Data Cleaning", "Exploratory Analysis", "Dashboard Development", "Review and Refinement", "Final Presentation"].map((label, index) => ({ week: `Week ${index + 1}`, label })),
  acceptanceCriteria: ["Dataset has been reviewed and key quality issues documented", "Main sales trends have been analysed", "Dashboard includes agreed business measures", "Findings are presented clearly", "Final deliverables are submitted"],
  dataRequirements: { access: "Yes", type: "Anonymised business data", description: "An anonymised sales dataset containing product category, sales amount, transaction date and store location.", sensitive: "No" },
  confidentiality: { nda: "Yes", portfolioPermission: "Subject to approval" },
  restrictions: ["No customer personal data", "No live payment system access", "No external publishing without approval"], otherRestriction: "",
};
const populated = (values: string[]) => values.length > 0 && values.every(value => value.trim());
export function validateProjectStep(draft: ProjectDraft, step: number): string {
  if (step === 0 && (![draft.title, draft.summary].every(value => value.trim()) || !draft.category || !draft.workingStyle || !draft.duration || !draft.weeklyCommitment || (draft.duration === "Custom" && !draft.customDuration.trim()) || (draft.weeklyCommitment === "Custom" && !draft.customCommitment.trim()))) return "Complete the project basics, including any custom duration or weekly commitment.";
  if (step === 1 && (![draft.businessProblem, draft.businessValue, draft.successfulOutcome].every(value => value.trim()) || !populated(draft.objectives))) return "Describe the business need and outcome, and add at least one complete objective.";
  if (step === 2 && (!populated(draft.deliverables) || !draft.requiredSkills.length || (draft.requiredSkills.includes("Other") && !draft.otherSkill.trim()))) return "Add at least one complete deliverable and choose the required skills. Describe any other required skill.";
  if (step === 3) {
    if (draft.supervisor.usePrimaryContact === "No" && (![draft.supervisor.name, draft.supervisor.jobTitle].every(value => value.trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.supervisor.email))) return "Add the supervisor’s name, job title and valid work email.";
    if (!draft.supervisionTime || !draft.meetingFrequency || !draft.meetingFormat || !populated(draft.timeline.map(stage => stage.label)) || !populated(draft.acceptanceCriteria)) return "Complete the supervision details, timeline and at least one acceptance criterion.";
  }
  if (step === 4 && (draft.dataRequirements.access !== "No" && (!draft.dataRequirements.type || !draft.dataRequirements.description.trim()))) return "Record the type of data and describe what students will need access to.";
  if (step === 4 && draft.restrictions.includes("Other") && !draft.otherRestriction.trim()) return "Describe the other project restriction.";
  return "";
}
export function projectQualityChecks(draft: ProjectDraft) {
  return [
    { label: "Project has a clear business problem", complete: !!draft.businessProblem.trim() },
    { label: "Project has defined deliverables", complete: populated(draft.deliverables) },
    { label: "Required skills identified", complete: draft.requiredSkills.length > 0 && (!draft.requiredSkills.includes("Other") || !!draft.otherSkill.trim()) },
    { label: "Supervisor identified", complete: draft.supervisor.usePrimaryContact === "Yes" || (!!draft.supervisor.name.trim() && !!draft.supervisor.jobTitle.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.supervisor.email)) },
    { label: "Time commitment defined", complete: !!draft.weeklyCommitment && (draft.weeklyCommitment !== "Custom" || !!draft.customCommitment.trim()) },
    { label: "Data requirements recorded", complete: draft.dataRequirements.access === "No" || (!!draft.dataRequirements.type && !!draft.dataRequirements.description.trim()) },
    { label: "Acceptance criteria defined", complete: populated(draft.acceptanceCriteria) },
  ];
}
export const projectNextSteps = ["EzraTech reviews the project scope", "Supervision and project capacity are reviewed", "Data and confidentiality requirements are checked", "Required skills and deliverables are reviewed", "EzraTech may request changes", "Once approved, the project can move into student matching"];
