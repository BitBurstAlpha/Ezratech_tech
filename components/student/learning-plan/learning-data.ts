export type LearningActivity = { id: string; title: string; description: string; minutes: number; duration: string; type: string; button: string; scenario: string; question: string };
export const mockLearningPlan = {
  student: "Alex Morgan", careerGoal: "Data Analyst", estimatedTime: "2 hrs 30 mins",
  strengths: ["Data Handling", "Analytical Thinking", "Structured Problem Solving"],
  sources: ["Assessment responses", "Career goal", "Previous experience", "Demonstrated skills"],
  rationale: "EzraTech uses your available evidence to recommend targeted learning rather than asking you to complete unnecessary training.",
  strengthsDescription: "You have already demonstrated evidence in these areas, so they are not included in your current learning plan.",
  completionDescription: "You have completed all learning activities recommended from your skills assessment.",
  areas: [
    { title: "Stakeholder Communication", reason: "Your assessment showed strong technical reasoning, but your response could have explained the business impact and next action more clearly.", activities: [
      { id: "communication", title: "Communicating Technical Findings", description: "Learn how to explain technical issues clearly to non-technical stakeholders.", minutes: 30, duration: "30 minutes", type: "Short lesson", button: "Start Learning", scenario: "You discover duplicate customer records that may affect a sales report.", question: "How would you explain this issue to the business owner?" },
      { id: "updates", title: "Writing Professional Project Updates", description: "Practise writing concise updates that explain progress, risks and next steps.", minutes: 30, duration: "30 minutes", type: "Practical exercise", button: "Start Exercise", scenario: "You are preparing a customer sales report. Duplicate customer records are being reviewed, and the final figures may change.", question: "Write a short project update explaining progress, risks and your next steps." },
    ] },
    { title: "Project Planning", reason: "Your assessment identified the blocker correctly, but your response did not include a clear recovery plan or milestone adjustment.", activities: [
      { id: "planning", title: "Planning Tasks and Managing Milestones", description: "Learn how to organise work, identify blockers early and communicate changes to a project plan.", minutes: 90, duration: "1 hour 30 minutes", type: "Interactive module", button: "Start Learning", scenario: "Cleaning duplicate records is taking longer than expected and could delay the final sales dashboard.", question: "Outline how you would update the task plan, communicate the blocker and manage the milestone." },
    ] },
  ] satisfies { title: string; reason: string; activities: LearningActivity[] }[],
};
export const mockAIFeedback: Record<string, { strengths: string[]; improvement: string; example: string }> = {
  communication: { strengths: ["Identified the issue affecting the milestone", "Explained the need for an early update"], improvement: "Add the proposed next action, recovery plan and expected next update.", example: "I am waiting for information from the SME supervisor, which may affect the milestone due in two days. I will continue other available work, request clarification today and share an updated plan before the deadline." },
  updates: { strengths: ["Summarised the current progress", "Highlighted the risk to the report"], improvement: "Include a clear next step and when the stakeholder can expect another update.", example: "The sales report is drafted, and I am checking duplicate customer records before confirming the totals. I will share corrected figures and a progress update tomorrow." },
  planning: { strengths: ["Identified the blocker affecting the milestone", "Recognised the need to communicate changes"], improvement: "Add a recovery plan with task priorities and an updated milestone.", example: "I will prioritise reviewing the duplicate records today and confirm the corrected totals tomorrow. I will notify the supervisor of the blocker now and propose moving the dashboard review to Friday." },
};
export const prototypeNote = "Learning recommendations and AI feedback are simulated for demonstration purposes.";
