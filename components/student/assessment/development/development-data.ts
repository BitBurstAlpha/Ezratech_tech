import type { DemoProgress } from "@/components/student/progress/progress-state";
import { capabilityLevels, type CapabilityLevel } from "@/components/admin/capability/capability-data";
import { mockLearningPlan, type LearningActivity } from "@/components/student/learning-plan/learning-data";
export { capabilityLevels };
export const assessmentCapabilities = [{ key: "dataHandling", name: "Data Handling", suggested: "independent" }, { key: "analyticalThinking", name: "Analytical Thinking", suggested: "independent" }, { key: "communication", name: "Communication", suggested: "guidance" }, { key: "projectDelivery", name: "Project Delivery", suggested: "not_evidenced" }, { key: "professionalJudgement", name: "Professional Judgement", suggested: "guidance" }] as const;
export type AssessmentCapabilityKey = typeof assessmentCapabilities[number]["key"];
export type CapabilityReviewAction = "confirm" | "change" | "request_evidence";
export type AssessmentDecision = "confirm" | "adjust" | "request_evidence" | "recommend_reassessment";
export type AssessmentDevelopment = {
  levels: Record<AssessmentCapabilityKey, CapabilityLevel>; humanAdjusted: AssessmentCapabilityKey[];
  reassessment: { status: "not_started" | "completed" | "more_practice"; answers: { delivery: string; communication: string; planning: string[] }; attempts: number };
  reviewRequest: { category: string; text: string } | null; humanReviewStatus: "none" | "pending" | "completed" | "evidence_requested";
  review: { actions: Record<AssessmentCapabilityKey, CapabilityReviewAction>; levels: Record<AssessmentCapabilityKey, CapabilityLevel>; notes: Record<AssessmentCapabilityKey, string>; reviewerNotes: string; decision: AssessmentDecision | null; evidenceRequired: string };
  log: { text: string; date: string }[];
};
export function createAssessmentDevelopment(): AssessmentDevelopment {
  const levels = Object.fromEntries(assessmentCapabilities.map(item => [item.key, item.suggested])) as AssessmentDevelopment["levels"];
  return { levels, humanAdjusted: [], reassessment: { status: "not_started", answers: { delivery: "", communication: "", planning: [] }, attempts: 0 }, reviewRequest: null, humanReviewStatus: "none", review: { actions: Object.fromEntries(assessmentCapabilities.map(item => [item.key, "confirm"])) as AssessmentDevelopment["review"]["actions"], levels: { ...levels }, notes: Object.fromEntries(assessmentCapabilities.map(item => [item.key, ""])) as AssessmentDevelopment["review"]["notes"], reviewerNotes: "", decision: null, evidenceRequired: "" }, log: [{ text: "Initial assessment completed", date: "Today" }, { text: "AI-assisted summary generated (simulated)", date: "Today" }, { text: "Learning plan assigned", date: "Today" }] };
}
export const mockAssessmentState = createAssessmentDevelopment();
export const mockReassessment = { focusAreas: ["Project Delivery", "Professional Communication"], estimatedTime: "10 minutes", deliveryOptions: ["Wait until the deadline and then report the delay", "Continue other available work, notify the supervisor early, explain the impact and suggest an updated plan", "Mark the task complete", "Remove the milestone"], communicationOptions: ['There is a problem with the data.', 'I identified duplicate customer records that may affect the sales totals. I am reviewing the duplicates now and will confirm the corrected figures before finalising the dashboard.', 'I fixed something in the spreadsheet.', 'No update is needed.'], planningOptions: ["Reason for the delay", "Likely impact", "Proposed recovery plan", "Updated expected date", "Nothing until the deadline passes"] };
export const mockAssessmentReview = mockAssessmentState.review;
export const humanReviewCategories = ["Capability level", "Submitted evidence", "Assessment response", "Missing project evidence", "Other"];
export const demonstratedStrengths = [{ name: "Data Handling", evidence: "You identified appropriate steps for reviewing duplicate records and missing values." }, { name: "Analytical Thinking", evidence: "You considered historical comparison before drawing conclusions from sales changes." }, { name: "Structured Problem Solving", evidence: "Your responses showed a clear approach to identifying and analysing business problems." }];
export const developmentAreas = [
  { name: "Project Delivery", key: "projectDelivery" as const, why: "Your response identified the project delay but did not clearly explain how you would update the plan, communicate the impact or manage the milestone.", recommended: ["Task planning", "Milestone management", "Escalating blockers", "Recovery planning"] },
  { name: "Professional Communication", key: "communication" as const, why: "Your response correctly identified the data issue but could explain the business impact and proposed next action more clearly.", recommended: ["Stakeholder updates", "Clear escalation messages", "Business-focused communication"] },
];
export const developmentActivities: LearningActivity[] = [
  { ...mockLearningPlan.areas[1].activities[0], title: "Planning Tasks and Milestones", minutes: 45, duration: "45 minutes" },
  { ...mockLearningPlan.areas[0].activities[0], title: "Communicating Project Risks", scenario: "A task is delayed while you await information from the SME supervisor. The milestone is due in two days.", question: "Write an early update explaining the impact, next action and recovery plan.", minutes: 30, duration: "30 minutes" },
  { ...mockLearningPlan.areas[0].activities[1], minutes: 30, duration: "30 minutes" },
];
export const developmentLearningPlan = { ...mockLearningPlan, estimatedTime: "1 hr 45 mins", areas: [{ title: "Project Delivery", reason: developmentAreas[0].why, activities: [developmentActivities[0]] }, { title: "Professional Communication", reason: developmentAreas[1].why, activities: [developmentActivities[1], developmentActivities[2]] }] };
export function developmentConfirmed(progress: DemoProgress) { return progress.assessment.reassessment.status === "completed" && assessmentCapabilities.every(item => progress.assessment.levels[item.key] !== "not_evidenced") && progress.assessment.humanReviewStatus !== "evidence_requested" && !progress.assessment.review.evidenceRequired.trim(); }
export function reassessmentAvailable(progress: DemoProgress) { return ["communication", "updates", "planning"].every(id => progress.completedActivities.includes(id)) && progress.assessment.reassessment.status === "not_started"; }
export function assessmentStage(progress: DemoProgress) {
  if (progress.readinessComplete && developmentConfirmed(progress)) return "ready";
  if (progress.assessment.humanReviewStatus === "pending" || progress.assessment.humanReviewStatus === "evidence_requested") return "human_review";
  if (developmentConfirmed(progress)) return "reassessment_complete";
  if (reassessmentAvailable(progress)) return "reassessment_available";
  if (progress.startedActivities.length || progress.completedActivities.length) return "learning";
  return "development_needed";
}
