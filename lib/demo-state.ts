import { initialDemoProgress, learningActivityIds, progressReducer, type DemoProgress } from "@/components/student/progress/progress-state";
import { mockProjectReview, mockDataAccessUpdate, transitionProjectReview, type ProjectReview } from "@/components/sme/projects/review-data";
import { mockSMEProjectDraft, type ProjectDraft } from "@/components/sme/projects/project-data";
import { smeResponsibilities } from "@/components/sme/setup/setup-data";
import { createWorkspaceCollaboration } from "@/components/sme/workspace/workspace-data";
import { defaultIssueReview, projectIssues } from "@/components/admin/monitoring/monitoring-data";
import { learningComplete } from "@/components/student/progress/progress-state";
import { projectCancelled } from "@/components/projects/closure/closure-data";

export const adminDemoCredentials = { email: "admin@ezratech.demo", password: "Admin123!" };
export const demoScenarios = [
  { id: "student-development-needed", title: "Student Needs Further Development", description: "Loads a student assessment result where additional learning and reassessment are required.", route: "/student/assessment/result", stage: "development" },
  { id: "student-project-ready", title: "Student Project Ready", description: "Student has completed assessment and learning and is ready for SME projects.", route: "/student/projects", stage: "ready" },
  { id: "no-suitable-project", title: "No Suitable Project", description: "Student is project-ready but no suitable approved SME project is currently available.", route: "/student/projects/no-match", stage: "unmatched" },
  { id: "sme-awaiting-review", title: "SME Project Awaiting Review", description: "Northstar Retail Ltd has submitted a project and is waiting for EzraTech approval.", route: "/sme/projects/northstar-sales-analysis/review", stage: "awaiting" },
  { id: "approved-project-matching", title: "Approved Project Matching", description: "Project has been approved and students are available for SME review.", route: "/sme/projects/northstar-sales-analysis/candidates", stage: "matching" },
  { id: "active-project", title: "Active Project", description: "Alex Morgan and Northstar Retail Ltd are currently working together.", route: "/student/workspace/northstar-sales-analysis", stage: "active" },
  { id: "project-blocker", title: "Project Blocker", description: "Active project contains an unresolved data clarification blocker.", route: "/admin/active-projects/northstar-sales-analysis", stage: "blocker" },
  { id: "escalated-issue", title: "Escalated Issue", description: "Loads an active project with an escalated issue requiring EzraTech intervention.", route: "/admin/issues", stage: "escalated" },
  { id: "rejected-project", title: "Rejected SME Project", description: "Demonstrates an unsuitable SME project that cannot proceed into matching.", route: "/admin/project-reviews/rejected-demo-project", stage: "rejected" },
  { id: "cancelled-project", title: "Cancelled Project", description: "Demonstrates a project that started but had to close early.", route: "/student/workspace/northstar-sales-analysis/cancelled", stage: "cancelled" },
  { id: "assessment-review-request", title: "Assessment Review Request", description: "Student has challenged a capability decision and is waiting for human review.", route: "/admin/assessment-disputes/alex-morgan", stage: "dispute" },
  { id: "completed-capability-review", title: "Completed Project + Capability Review", description: "SME accepted the final project and EzraTech must review capability evidence.", route: "/admin/capability-reviews/northstar-sales-analysis/alex-morgan", stage: "completed" },
  { id: "verified-experience", title: "Verified Experience Complete", description: "Project and capability review are complete and the student has a verified experience record.", route: "/student/portfolio/northstar-sales-analysis", stage: "verified" },
  { id: "pilot-outcomes", title: "Pilot Outcomes", description: "Loads the reporting dashboard with completed demo pilot results.", route: "/admin/outcomes", stage: "outcomes" },
] as const;
export type DemoScenarioId = typeof demoScenarios[number]["id"];
export type DemoSnapshot = { progress: DemoProgress; review: ProjectReview; draft: ProjectDraft; smeOnboarded: boolean };
export function defaultProjectReview(): ProjectReview {
  return { ...transitionProjectReview(structuredClone(mockProjectReview), "approved"), changesRequested: [], submittedUpdate: structuredClone(mockDataAccessUpdate), reviewerComments: [{ id: "demo-approved", reviewer: "EzraTech Project Reviewer", comment: "The demo brief, supervision and anonymised data arrangements meet the agreed pilot criteria.", date: "Today" }] };
}
export function defaultDemoProgress(): DemoProgress {
  const progress = structuredClone(initialDemoProgress);
  return { ...progress, studentRegistered: false, profileComplete: false, assessmentComplete: false, workspaceTasks: progress.workspaceTasks.map(task => ({ ...task, status: "Not Started" })), workspace: { ...progress.workspace, studentUpdates: progress.workspace.studentUpdates.map(update => ({ ...update, blockers: "" })), issues: [], blockerResolved: false } };
}
export function defaultDemoSnapshot(): DemoSnapshot { return { progress: defaultDemoProgress(), review: defaultProjectReview(), draft: structuredClone(mockSMEProjectDraft), smeOnboarded: false }; }
function prepareStudent(progress: DemoProgress, ready: boolean): DemoProgress {
  const levels = { ...progress.assessment.levels, ...(ready ? { projectDelivery: "guidance" as const, communication: "independent" as const } : {}) };
  return { ...progress, studentRegistered: true, profileComplete: true, assessmentComplete: true, completedActivities: ready ? [...learningActivityIds] : [], startedActivities: ready ? [...learningActivityIds] : [], readinessComplete: ready, projectReady: ready, projectAccessUnlocked: ready, assessment: { ...progress.assessment, levels, review: { ...progress.assessment.review, levels: { ...levels } }, reassessment: { ...progress.assessment.reassessment, status: ready ? "completed" : "not_started" } } };
}
export function loadDemoScenario(id: DemoScenarioId): DemoSnapshot {
  const scenario = demoScenarios.find(item => item.id === id);
  if (!scenario) throw new Error("Unknown EzraTech demo scenario");
  const snapshot = defaultDemoSnapshot();
  const stage = scenario.stage;
  let p = snapshot.progress;
  if (["development", "dispute"].includes(stage)) p = prepareStudent(p, false);
  if (["ready", "unmatched", "matching", "active", "blocker", "escalated", "cancelled", "completed", "verified", "outcomes"].includes(stage)) p = prepareStudent(p, true);
  if (["awaiting", "rejected"].includes(stage)) snapshot.review = structuredClone(mockProjectReview);
  snapshot.smeOnboarded = !["development", "ready", "unmatched", "dispute"].includes(stage);
  if (stage === "unmatched") p = progressReducer(p, { type: "showNoMatchingProjects" });
  if (stage === "matching") p = { ...p, interestSubmitted: true, applicationStatus: "sme_review" };
  if (["active", "blocker", "escalated", "cancelled", "completed", "verified", "outcomes"].includes(stage)) {
    const workspace = createWorkspaceCollaboration();
    workspace.studentUpdates = workspace.studentUpdates.map(update => ({ ...update, blockers: ["blocker", "escalated"].includes(stage) ? update.blockers : "" }));
    p = { ...p, setupStarted: true, interestSubmitted: true, applicationStatus: "sme_accepted", activeProject: true, preStart: Object.fromEntries(Object.keys(p.preStart).map(key => [key, true])) as DemoProgress["preStart"], workspace, workspaceTasks: p.workspaceTasks.map((task, index) => ({ ...task, status: index < 2 ? "Completed" : index === 2 ? "In Progress" : "Not Started" })) };
    // Existing pre-start responsibilities are included in the same seed used by completed scenarios.
    p.smeResponsibilityConfirmations = [...smeResponsibilities];
  }
  if (stage === "escalated") p.monitoring.issueReviews.blocker = { ...defaultIssueReview, escalation: { reason: "Data Access Issue", notes: "Clarification remains outstanding; EzraTech support requested.", level: "Programme Support" }, adminNotes: "Contact the supervisor and student to agree a safe next step." };
  if (stage === "rejected") p = progressReducer(p, { type: "rejectUnsuitableProject" });
  if (stage === "cancelled") {
    p = progressReducer(p, { type: "loadWeekThreeCancellationDemo" });
    p = progressReducer(p, { type: "cancelActiveProject", reason: "Business circumstances changed", explanation: "Northstar can no longer provide the agreed data and supervision following an internal business change.", requestedBy: "SME", partialDecision: "Requires human review" });
    snapshot.review.matchingUnlocked = false;
  }
  if (stage === "dispute") {
    p.assessment.levels.projectDelivery = "guidance"; p.assessment.review.levels.projectDelivery = "guidance";
    p = progressReducer(p, { type: "submitAssessmentDispute", reviewTypes: ["Capability level"], reason: p.assessmentDispute.studentReason, evidence: ["Skills Assessment", "Reassessment"], otherEvidence: "" });
  }
  if (["completed", "verified", "outcomes"].includes(stage)) {
    p = progressReducer(p, { type: "loadCompletedPilotDemo" });
    if (stage !== "outcomes") p.outcomes = structuredClone(initialDemoProgress.outcomes);
    if (stage === "completed") { p.verifiedExperience = false; p.portfolioAdded = false; p.capabilityReview.status = "pending"; p.capabilityReview.verifiedExperienceReady = false; p.projectCompletion.verifiedExperienceReady = false; }
  }
  if (snapshot.smeOnboarded) snapshot.draft.status = "under-review";
  snapshot.progress = p;
  return snapshot;
}
// Only this prototype namespace is owned by the demo control layer. Never clear browser storage wholesale.
export function clearEzraTechDemoStorage(storage: Pick<Storage, "length" | "key" | "removeItem">) {
  const owned: string[] = [];
  for (let index = 0; index < storage.length; index++) { const key = storage.key(index); if (key?.startsWith("ezratech-demo:")) owned.push(key); }
  owned.forEach(key => storage.removeItem(key));
}
export function currentDemoSummary(progress: DemoProgress, review: ProjectReview) {
  const issues = projectIssues(progress);
  const issue = issues.some(item => item.status === "escalated") ? "Escalated" : issues.some(item => item.status === "open") ? "Open" : issues.length ? "Resolved" : "None";
  return [
    ["Student", "Alex Morgan"], ["Assessment", progress.assessmentComplete ? "Complete" : "Not Started"], ["Learning", learningComplete(progress) ? "Complete" : "Incomplete"], ["Project Ready", progress.projectReady ? "Yes" : "No"],
    ["Matching", progress.matchingAvailability.supply === "no_match" ? "No Match" : progress.applicationStatus === "sme_accepted" ? "Matched" : review.matchingUnlocked ? "Matching" : "Awaiting Review"],
    ["Project", projectCancelled(progress) ? "Cancelled" : progress.projectCompletion.smeApproved ? "Completed" : progress.preStart.workspaceUnlocked ? "Active" : "Not Started"], ["Issue", issue],
    ["Capability Review", progress.capabilityReview.status === "approved" ? "Approved" : "Pending"], ["Verified Experience", progress.verifiedExperience ? "Verified" : "Pending"],
  ];
}
