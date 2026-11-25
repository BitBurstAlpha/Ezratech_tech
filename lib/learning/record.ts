import type { DemoProgress } from "@/components/student/progress/progress-state";

export function learningRecord(progress: DemoProgress) {
  const { startedActivities, completedActivities, assessmentComplete, assessmentDispute, assessment, readinessComplete } = progress;
  return { interestSubmitted: progress.interestSubmitted, assignedCourses: progress.assignedCourses, startedActivities, completedActivities, assessmentComplete, assessmentDispute, assessment, readinessComplete };
}
export type LearningRecord = ReturnType<typeof learningRecord>;

export const studentLearningActions = [
  "startActivity", "completeActivity", "completeAssessment", "setReassessmentAnswers", "submitReassessment",
  "completeReassessmentPractice", "completeReadiness", "requestAssessmentHumanReview", "submitAssessmentDispute", "submitInterest",
];
export const reviewerActions = [
  "updateAssessmentReviewCapability", "setAssessmentReviewerNotes", "decideAssessmentReview",
  "resolveAssessmentDispute", "requestDisputeEvidence", "beginAssessmentDisputeReview",
];
