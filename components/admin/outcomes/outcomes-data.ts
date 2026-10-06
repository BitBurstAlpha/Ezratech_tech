import type { DemoProgress } from "@/components/student/progress/progress-state";
import { projectCancelled } from "@/components/projects/closure/closure-data";
import { projectIssues } from "../monitoring/monitoring-data";
import { mockProjectDetails } from "@/components/student/projects/details/project-details-data";
import { demoStudent } from "@/components/student/dashboard/demo-data";

export const outcomeRoutes = { dashboard: "/admin/outcomes", student: "/admin/outcomes/students/alex-morgan", sme: "/admin/outcomes/smes/northstar-retail" };
export const outcomeIdentity = { student: demoStudent.name, careerGoal: demoStudent.careerGoal, project: mockProjectDetails.title, company: mockProjectDetails.company, supervisor: mockProjectDetails.supervisor.name };
export const followUpStatuses = ["Searching for work", "Interviewing", "Received job offer", "Started employment", "Further study", "Other"] as const;
export type FollowUp = { currentStatus: typeof followUpStatuses[number]; roleTitle: string; employer: string; related: "Yes" | "No" | "Partly"; evidenceUsed: "Yes" | "No"; notes: string };
export const mockStudentFollowUps = { applications: 12, interviews: 1, offers: 0, employment: "Not yet", portfolioUsed: "Yes", currentStatus: "Actively applying for Data Analyst roles", comment: "The project gave me a practical example I could discuss during an interview." };
export const mockSMEOutcomes = { nextProject: "Inventory Reporting Improvement", status: "Draft", comment: "The student produced a clear reporting dashboard and communicated progress consistently. We would consider using EzraTech for another suitable project." };
export type OutcomeState = { followUp30Day: boolean; followUp90Day: FollowUp | null; repeatInterest: boolean; repeatConfirmed: boolean; interviewInterest: boolean; repeatFollowUpRecorded: boolean };
export function createOutcomeState(): OutcomeState { return { followUp30Day: false, followUp90Day: null, repeatInterest: false, repeatConfirmed: false, interviewInterest: false, repeatFollowUpRecorded: false }; }
// Other pilot participants only. Alex and Northstar are projected from the existing shared workflow.
export const mockPilotOutcomes = {
  enrolled: 23, assessed: 21, ready: 17, matched: 15, studentStarted: 14, studentCompleted: 11, followedUp: 8, careerReported: 4,
  approved: 11, projectStarted: 9, projectCompleted: 7, cancelled: 1, active: 1, studentWithdrawals: 2, smeWithdrawals: 1,
  useful: 6, improvement: 1, feedbackPending: 2, smeCompleted: 7, repeatInterest: 4, repeatConfirmed: 2, repeatPending: 2,
  evidenceImproved: 7, evidenceUnchanged: 3, evidenceDevelopment: 1, evidencePending: 2,
  interviews: 3, offers: 2, employment: 1, study: 2, searching: 2,
  availability: 1, personal: 1, business: 1, scope: 1,
  seriousOpen: 0, resolvedEscalations: 3, paused: 1, assessmentReviews: 2,
  studentHours: 384, supervisionHours: 66, reviewerHours: 28, supportHours: 50, paid: 3,
};
export const mockDeliveryMetrics = { studentHours: 36, supervisionHours: 12, reviewerHours: 4, supportHours: 5 };
export type MetricKey = keyof typeof mockPilotOutcomes;
export type Metrics = Record<MetricKey, number>;
export type ReportingPeriod = "Current Pilot" | "Last 3 Months" | "Last 6 Months" | "Custom";
export const reportingPeriods: ReportingPeriod[] = ["Current Pilot", "Last 3 Months", "Last 6 Months", "Custom"];
export const pilotDates = { start: "2026-04-05", end: "2026-10-05", alexEnrolled: "2026-09-01" };
// Fixed demo cohort dates: filters select enrolled cohorts and their subsequent outcomes, not event dates.
const earlierCohort: Metrics = {
  enrolled: 11, assessed: 10, ready: 8, matched: 7, studentStarted: 6, studentCompleted: 5, followedUp: 3, careerReported: 2,
  approved: 5, projectStarted: 4, projectCompleted: 3, cancelled: 0, active: 1, studentWithdrawals: 1, smeWithdrawals: 1,
  useful: 2, improvement: 1, feedbackPending: 1, smeCompleted: 3, repeatInterest: 2, repeatConfirmed: 1, repeatPending: 1,
  evidenceImproved: 3, evidenceUnchanged: 2, evidenceDevelopment: 0, evidencePending: 1,
  interviews: 1, offers: 1, employment: 0, study: 1, searching: 1,
  availability: 0, personal: 1, business: 0, scope: 1,
  seriousOpen: 0, resolvedEscalations: 1, paused: 1, assessmentReviews: 1,
  studentHours: 170, supervisionHours: 30, reviewerHours: 12, supportHours: 20, paid: 1,
};
export const mockPilotCohorts = [
  { enrolledOn: "2026-06-01", metrics: earlierCohort },
  { enrolledOn: "2026-09-01", metrics: Object.fromEntries((Object.keys(mockPilotOutcomes) as MetricKey[]).map(key => [key, mockPilotOutcomes[key] - earlierCohort[key]])) as Metrics },
];
export function reportingRange(period: ReportingPeriod, start: string, end: string) {
  return period === "Custom" ? { start, end } : { start: period === "Last 3 Months" ? "2026-07-05" : pilotDates.start, end: pilotDates.end };
}
export function studentOutcome(progress: DemoProgress) {
  const cancelled = projectCancelled(progress);
  const completed = progress.projectCompletion.smeApproved && !cancelled;
  const started = progress.preStart.workspaceUnlocked || completed || cancelled;
  const verified = completed && progress.verifiedExperience && progress.capabilityReview.status === "approved";
  const followUp30 = completed && progress.outcomes.followUp30Day;
  const followUp90 = completed ? progress.outcomes.followUp90Day : null;
  const feedbackRecorded = completed;
  const useful = feedbackRecorded && Object.values(progress.finalSMEReview.acceptanceCriteria).every(value => value === "met") && progress.finalSMEReview.feedback.quality === "Positive";
  const latestOutcome = followUp90 ? ({ "Searching for work": "Still Searching", Interviewing: "Interview Opportunity Reported", "Received job offer": "Job Offer Reported", "Started employment": "Employment reported after participation", "Further study": "Further Study", Other: "Other Participant-Reported Outcome" }[followUp90.currentStatus]) : followUp30 ? "Interview Opportunity Reported" : "Follow-Up Not Recorded";
  return { studentId: "alex-morgan", enrolled: progress.profileComplete, projectReady: progress.projectReady, started, completed, cancelled, verified, followUp30, followUp90, feedbackRecorded, useful, latestOutcome, employmentAttributedToEzraTech: false, projectStatus: cancelled ? "Cancelled" : completed ? "Completed" : progress.monitoring.paused && started ? "Paused" : started ? "Active" : "Not Started", capabilityStatus: verified ? "Verified" : cancelled && progress.cancellation.partialApproved ? "Partial Experience Reviewed" : "Pending Review" };
}
export function pilotReport(progress: DemoProgress, approved: boolean, period: ReportingPeriod, start: string, end: string) {
  const range = reportingRange(period, start, end);
  const valid = !!range.start && !!range.end && range.start <= range.end;
  const includes = (date: string) => valid && date >= range.start && date <= range.end;
  const totals = Object.fromEntries(Object.keys(mockPilotOutcomes).map(key => [key, 0])) as Metrics;
  for (const cohort of mockPilotCohorts.filter(cohort => includes(cohort.enrolledOn))) {
    for (const key of Object.keys(totals) as MetricKey[]) totals[key] += cohort.metrics[key];
  }
  const student = studentOutcome(progress);
  const alexIncluded = includes(pilotDates.alexEnrolled);
  if (alexIncluded) {
    const add = (key: MetricKey, condition: boolean) => { totals[key] += Number(condition); };
    add("enrolled", student.enrolled); add("assessed", progress.assessmentComplete); add("ready", progress.projectReady);
    add("matched", student.started || progress.applicationStatus === "sme_accepted" || progress.setupStarted);
    add("studentStarted", student.started); add("studentCompleted", student.completed); add("followedUp", student.followUp30 || !!student.followUp90);
    const status = student.followUp90?.currentStatus;
    add("careerReported", student.followUp30 || !!status && ["Interviewing", "Received job offer", "Started employment"].includes(status));
    add("approved", approved || student.started); add("projectStarted", student.started); add("projectCompleted", student.completed); add("cancelled", student.cancelled); add("active", student.started && !student.completed && !student.cancelled);
    add("useful", student.useful); add("improvement", student.feedbackRecorded && !student.useful); add("feedbackPending", student.started && !student.feedbackRecorded && !student.cancelled);
    add("smeCompleted", student.completed); add("repeatInterest", student.completed && progress.outcomes.repeatInterest); add("repeatConfirmed", student.completed && progress.outcomes.repeatConfirmed); add("repeatPending", student.completed && !progress.outcomes.repeatFollowUpRecorded);
    const confirmed = Object.entries(progress.capabilityReview.capabilities).filter(([, value]) => value.decision !== "not_evidenced");
    const rank = { not_evidenced: 0, guidance: 1, independent: 2, review_others: 3 };
    // Compare like-named evidence areas only, after human verification. This is a count, never an AI score.
    const equivalent = ["dataHandling", "communication", "projectDelivery"] as const;
    const improved = equivalent.some(key => rank[progress.capabilityReview.capabilities[key].decision] > rank[progress.assessment.levels[key]]);
    add("evidenceImproved", student.verified && improved); add("evidenceUnchanged", student.verified && !improved && confirmed.length > 0); add("evidenceDevelopment", student.verified && !confirmed.length); add("evidencePending", student.completed && !student.verified);
    add("interviews", student.followUp30 || status === "Interviewing"); add("offers", status === "Received job offer" || status === "Started employment"); add("employment", status === "Started employment"); add("study", status === "Further study"); add("searching", student.followUp90 ? status === "Searching for work" : student.followUp30);
    add("paused", progress.monitoring.paused && !student.cancelled && !student.completed);
    const issues = projectIssues(progress);
    totals.seriousOpen += issues.filter(issue => issue.status !== "resolved" && (issue.priority === "High" || progress.monitoring.issueReviews[issue.id]?.escalation?.reason === "Safety / Conduct Concern")).length;
    totals.resolvedEscalations += Object.values(progress.monitoring.issueReviews).filter(review => review.escalation && review.resolution).length;
    add("assessmentReviews", !!progress.assessmentDispute.status);
    if (student.cancelled) { const reason = progress.cancellation.reason; add("availability", reason.includes("Student")); add("business", reason.includes("Business") || reason.includes("SME")); add("scope", reason.includes("scope")); }
    if (student.started) for (const key of Object.keys(mockDeliveryMetrics) as (keyof typeof mockDeliveryMetrics)[]) totals[key] += mockDeliveryMetrics[key];
  }
  return { totals, student, alexIncluded, valid, range };
}
export const reportingNotes = ["Counts use simulated prototype data", "Withdrawals remain visible", "Follow-up denominators are shown", "Employment outcomes are participant-reported", "Employer feedback should include negative results as well as positive ones", "Outcomes after participation should not automatically be attributed to EzraTech"];
export const exportSections = ["participation", "project delivery", "withdrawals", "SME feedback", "repeat demand", "capability outcomes", "follow-up outcomes", "delivery effort", "unresolved issues"];
