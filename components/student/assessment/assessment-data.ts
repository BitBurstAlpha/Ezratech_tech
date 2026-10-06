export type AssessmentQuestion = { id: string; category: string; question: string; scenario?: string; options: string[] };
export const assessmentAreas = ["Data Handling", "Analytical Thinking", "Communication", "Project Delivery", "Previous Work Evidence"];
export const assessmentQuestions: AssessmentQuestion[] = [
  { id: "data", category: "Data Handling", question: "A small business gives you a spreadsheet containing duplicate customer records and missing values. What would you do first?", options: ["Delete every row containing missing values", "Review the data structure, identify duplicate and missing-value patterns, and decide how each issue should be handled", "Create a dashboard immediately", "Replace all missing values with zero"] },
  { id: "analysis", category: "Analytical Thinking", question: "A company reports that sales increased by 20% this month. What additional information would you want before deciding whether performance has improved?", options: ["Compare with previous months and the same period last year", "Only look at this month's total", "Ask how many employees the company has", "Change the report colour"] },
  { id: "communication", category: "Communication", scenario: "You discover an issue in a dataset that may affect the final report.", question: "What is the most appropriate action?", options: ["Ignore it and continue", "Correct it without telling anyone", "Explain the issue, its likely impact, and your proposed next step to the project supervisor", "Wait until the final presentation"] },
  { id: "delivery", category: "Project Delivery", question: "A project task is taking longer than expected and may delay a milestone. What should you do?", options: ["Wait until the deadline passes", "Inform the relevant person early, explain the blocker, and suggest an updated plan", "Mark the task as complete", "Remove the milestone"] },
];
export const evidenceQuestion = { category: "Evidence of Experience", title: "Show us something you have worked on", description: "Upload or describe a previous project, university assignment, portfolio item, or work sample.", skills: ["SQL", "Excel", "Power BI", "Python", "Communication", "Project Management", "Other"] };
export const capabilityLevels = ["Not yet evidenced", "Can perform with guidance", "Can perform independently on bounded tasks", "Can explain or review others' work"] as const;
export const mockAssessmentResult = {
  title: "Assessment Complete",
  description: "Your assessment has been reviewed for this demo.",
  badge: "AI-assisted analysis",
  status: "Human review pending",
  capabilities: [
    { area: "Data Handling", level: capabilityLevels[2] },
    { area: "Analytical Thinking", level: capabilityLevels[2] },
    { area: "Communication", level: capabilityLevels[1] },
    { area: "Project Delivery", level: capabilityLevels[1] },
  ],
  strengths: ["Data Handling", "Analytical Thinking", "Structured Problem Solving"],
  developmentAreas: [
    { title: "Stakeholder Communication", description: "Develop clearer professional communication when explaining issues, risks and next steps." },
    { title: "Project Planning", description: "Strengthen task planning, milestone management and early escalation of blockers." },
  ],
  recommendationSources: ["Assessment responses", "Previous experience", "Evidence submitted", "Career goal"],
  explanation: "These recommendations are simulated for this prototype and are intended to demonstrate the proposed EzraTech workflow.",
};
