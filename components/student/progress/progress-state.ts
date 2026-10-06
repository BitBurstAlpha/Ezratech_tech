import { projectAttachmentAllowed, attachmentOptions, mockSupportMessages, projectConversationId, supportConversationId, type DemoAttachment } from "@/components/student/messages/message-data";
import { attendanceStatuses, type AttendanceStatus } from "@/components/student/workspace/attendance-data";
import { createOutcomeState, mockSMEOutcomes, type OutcomeState, type FollowUp, followUpStatuses } from "@/components/admin/outcomes/outcomes-data";
import { createAssessmentDispute, currentDisputeLevel, type AssessmentDispute } from "@/components/student/assessment/disputes/dispute-data";
import { mockProjectCancellation, projectCancelled, type ProjectCancellation, type RejectedDemoProject } from "@/components/projects/closure/closure-data";
import { createMatchingAvailability, type MatchingAvailability, type MatchingPreferences } from "@/components/student/projects/availability/availability-data";
import { createAssessmentDevelopment, reassessmentAvailable, mockReassessment, assessmentCapabilities, type AssessmentDevelopment, type AssessmentCapabilityKey, type CapabilityReviewAction, type AssessmentDecision } from "@/components/student/assessment/development/development-data";
import { createProjectMonitoring, projectIssues, defaultIssueReview, type ProjectMonitoring, type ScopeReview } from "@/components/admin/monitoring/monitoring-data";
import { createCapabilityReview, confirmedCapabilities, type CapabilityReview, type CapabilityKey, type CapabilityLevel } from "@/components/admin/capability/capability-data";
import { mockFinalSMEReview, finalReviewReady, type FinalSMEReview, type FinalCriterionKey, type FinalFeedbackKey, type PortfolioPermissionKey } from "@/components/sme/workspace/final-review/final-review-data";
import { createWorkspaceCollaboration, type WorkspaceCollaboration, type SupervisorResponse, type WeeklyFeedback, type ScopeChange } from "@/components/sme/workspace/workspace-data";
import { smeResponsibilities } from "@/components/sme/setup/setup-data";
import { mockFullPortfolioVisibility, type FullPortfolioVisibility } from "@/components/student/portfolio/portfolio-data";
import { mockPortfolioVisibility, type PortfolioVisibility } from "@/components/student/portfolio/experience-data";
import { mockTasks, type WorkspaceTask, type TaskStatus } from "@/components/student/workspace/workspace-data";
import { mockProjectCompletion, mockSubmission, finalConfirmations, submissionReady, type ProjectCompletion, type ProjectSubmission } from "@/components/student/workspace/completion/completion-data";
import { mockPreStartStatus, preStartChecklist, projectSetupComplete, type PreStartStatus, type PreStartKey } from "@/components/student/applications/pre-start/pre-start-data";
import { mockApplication, type ApplicationStatus } from "@/components/student/applications/application-data";
export const learningActivityIds = ["communication", "updates", "planning"] as const;
export type DemoProgress = { studentRegistered: boolean; outcomes: OutcomeState; assessmentDispute: AssessmentDispute; cancellation: ProjectCancellation; rejectedDemoProject: RejectedDemoProject; matchingAvailability: MatchingAvailability; assessment: AssessmentDevelopment; monitoring: ProjectMonitoring; capabilityReview: CapabilityReview; finalSMEReview: FinalSMEReview; workspace: WorkspaceCollaboration; setupStarted: boolean; smeResponsibilityConfirmations: string[]; fullPortfolioVisibility: FullPortfolioVisibility; portfolioAdded: boolean; portfolioVisibility: PortfolioVisibility; workspaceTasks: WorkspaceTask[]; projectCompletion: ProjectCompletion; submission: ProjectSubmission; preStart: PreStartStatus; applicationStatus: ApplicationStatus; interestSubmitted: boolean; completedActivities: string[]; startedActivities: string[]; profileComplete: boolean; assessmentComplete: boolean; readinessComplete: boolean; projectReady: boolean; projectAccessUnlocked: boolean; activeProject: boolean; verifiedExperience: boolean };
export const initialDemoProgress: DemoProgress = { studentRegistered: false, outcomes: createOutcomeState(), assessmentDispute: createAssessmentDispute(), cancellation: { ...mockProjectCancellation, log: [] }, rejectedDemoProject: { status: "under_review", redesignRequested: false, suggestion: "", archived: false }, matchingAvailability: createMatchingAvailability(), assessment: createAssessmentDevelopment(), monitoring: createProjectMonitoring(), capabilityReview: createCapabilityReview(), finalSMEReview: { ...mockFinalSMEReview, reviewedDeliverableIds: [], acceptanceCriteria: { ...mockFinalSMEReview.acceptanceCriteria }, feedback: { ...mockFinalSMEReview.feedback }, portfolioPermissions: { ...mockFinalSMEReview.portfolioPermissions } }, workspace: createWorkspaceCollaboration(), setupStarted: false, smeResponsibilityConfirmations: [], fullPortfolioVisibility: { ...mockFullPortfolioVisibility }, portfolioAdded: false, portfolioVisibility: { ...mockPortfolioVisibility }, workspaceTasks: mockTasks.map(task => ({ ...task })), projectCompletion: { ...mockProjectCompletion, tasksComplete: false, milestonesComplete: false }, submission: { ...mockSubmission }, preStart: { ...mockPreStartStatus }, applicationStatus: mockApplication.status, interestSubmitted: false, completedActivities: [], startedActivities: [], profileComplete: false, assessmentComplete: false, readinessComplete: false, projectReady: false, projectAccessUnlocked: false, activeProject: false, verifiedExperience: false };
export type ProgressAction =
  { type: "readProjectMessages"; reader: "student" | "sme" } |
  { type: "sendSupportMessage"; text: string; attachment?: DemoAttachment } |
  { type: "setMeetingAttendance"; index: number; status: AttendanceStatus } |
  { type: "demoUnlockProjects" | "demoUnlockWorkspace" } |
  { type: "replaceDemoProgress"; progress: DemoProgress } |
  { type: "registerStudent" | "completeOnboarding" } |
  { type: "loadCompletedPilotDemo" | "record30DayFollowUp" } |
  { type: "save90DayFollowUp"; followUp: FollowUp } |
  { type: "setRepeatDemand"; interested: boolean; confirmed: boolean; interviewInterest: boolean } |
  { type: "loadAssessmentChallengeDemo" | "beginAssessmentDisputeReview" } |
  { type: "submitAssessmentDispute"; reviewTypes: string[]; reason: string; evidence: string[]; otherEvidence: string } |
  { type: "requestDisputeEvidence"; area: string; text: string } |
  { type: "resolveAssessmentDispute"; outcome: "upheld" | "changed"; level: CapabilityLevel; notes: string } |

  { type: "rejectUnsuitableProject" | "archiveUnsuitableProject" } |
  { type: "suggestProjectRedesign"; suggestion: string } |
  { type: "loadWeekThreeCancellationDemo" | "requestProjectCancellation" } |
  { type: "cancelActiveProject"; reason: string; explanation: string; requestedBy: string; partialDecision: string } |
  { type: "recordClosureFeedback"; feedback: string; performanceCause: boolean } |

  { type: "showNoMatchingProjects" | "approveSuitableDemoProject" } |
  { type: "setProjectWaitlist"; active: boolean } |
  { type: "saveMatchingPreferences"; preferences: MatchingPreferences } |
  { type: "recordMatchingSuggestion"; text: string } |
  { type: "requestAssessmentHumanReview"; category: string; text: string } |
  { type: "setReassessmentAnswers"; patch: Partial<AssessmentDevelopment["reassessment"]["answers"]> } |
  { type: "submitReassessment" | "completeReassessmentPractice" } |
  { type: "updateAssessmentReviewCapability"; key: AssessmentCapabilityKey; action?: CapabilityReviewAction; level?: CapabilityLevel; notes?: string } |
  { type: "setAssessmentReviewerNotes"; notes: string } |
  { type: "decideAssessmentReview"; decision: AssessmentDecision; evidenceRequired: string } |
  { type: "recordAdminIntervention"; actionType: string; notes: string } |
  { type: "pauseMonitoredProject"; reason: string; notes: string } |
  { type: "resumeMonitoredProject"; note: string } |
  { type: "reviewMonitoringIssue"; id: string; owner: string; notes: string } |
  { type: "escalateMonitoringIssue"; id: string; reason: string; notes: string; level: string } |
  { type: "resolveMonitoringIssue"; id: string; resolution: string; studentInformed: boolean; smeInformed: boolean } |
  { type: "reviewScopeChange"; index: number; review: ScopeReview } |
  { type: "setCapabilityDecision"; key: CapabilityKey; decision: CapabilityLevel } |
  { type: "setCapabilityNotes"; key: CapabilityKey; notes: string } |
  { type: "setCapabilityReviewerNotes"; notes: string } |
  { type: "requestCapabilityClarification"; category: string; text: string } |
  { type: "returnCapabilityEvidence" | "approveCapabilityExperience" } |
  { type: "markFinalDeliverableReviewed"; id: string } |
  { type: "setFinalCriterion"; key: FinalCriterionKey; value: "met" | "needs_changes" } |
  { type: "setFinalFeedback"; key: FinalFeedbackKey | "general"; value: string } |
  { type: "setFinalPortfolioPermission"; key: PortfolioPermissionKey; value: "Allowed" | "Not Allowed" | "Subject to Approval" } |
  { type: "confirmFinalPortfolioPermissions" | "acceptFinalSMEProject" } |
  { type: "requestFinalSMEChanges"; categories: string[]; text: string; requestedDate: string } |

  { type: "sendWorkspaceMessage"; author: "Alex Morgan" | "Sarah Collins"; text: string; attachment?: DemoAttachment } |
  { type: "addWorkspaceFile"; name: string; author: "Alex Morgan" | "Sarah Collins" } |
  { type: "submitStudentUpdate"; completed: string; next: string; blockers: string } |
  { type: "setTaskFeedback"; taskId: string; feedback: string } |
  { type: "respondToStudentUpdate"; week: number; response: SupervisorResponse } |
  { type: "addWeeklyFeedback"; feedback: WeeklyFeedback } |
  { type: "rescheduleMeeting"; day: string; time: string } |
  { type: "resolveBlocker" } |
  { type: "recordProjectIssue"; issueType: string; description: string; urgency: string } |
  { type: "requestScopeChange"; request: ScopeChange } |
  { type: "setSMEResponsibilities"; values: string[] } | { type: "confirmSMEReadiness" | "smeAcceptCandidate" } | { type: "setFullPortfolioVisibility"; key: keyof FullPortfolioVisibility; value: boolean } | { type: "reviewExperience" | "addToPortfolio" } | { type: "setPortfolioVisibility"; key: keyof PortfolioVisibility; value: boolean } | { type: "setWorkspaceTask"; id: string; status: TaskStatus } | { type: "updateSubmission"; patch: Partial<ProjectSubmission> } | { type: "submitFinalProject" | "approveFinalProject" | "requestProjectChanges" | "resubmitFinalProject" } | { type: "setPreStart"; key: PreStartKey; value: boolean } | { type: "unlockWorkspace" } | { type: "startActivity" | "completeActivity"; id: string } | { type: "completeReadiness" | "unlockProjects" | "completeAssessment" | "submitInterest" | "acceptApplication" | "declineApplication" };
export function learningActivityStatus(progress: DemoProgress, id: string): "not_started" | "in_progress" | "completed" {
  return progress.completedActivities.includes(id) ? "completed" : progress.startedActivities.includes(id) ? "in_progress" : "not_started";
}
export function completedLearningCount(progress: DemoProgress) { return learningActivityIds.filter(id => learningActivityStatus(progress, id) === "completed").length; }
export function learningProgress(progress: DemoProgress) { return Math.round(completedLearningCount(progress) / learningActivityIds.length * 100); }
export function learningComplete(progress: DemoProgress) { return completedLearningCount(progress) === learningActivityIds.length; }
export function readinessAccessible(progress: DemoProgress) { return progress.assessmentComplete && learningComplete(progress) && progress.assessment.reassessment.status === "completed"; }
export function workspacePrerequisites(progress: DemoProgress) { return projectsAccessible(progress) && progress.interestSubmitted && progress.applicationStatus === "sme_accepted" && projectSetupComplete(progress.preStart); }
export function workspaceAccessible(progress: DemoProgress) { return progress.preStart.workspaceUnlocked === true; }
function capabilityDefinitionsForPartial(review: CapabilityReview) { return Object.values(review.capabilities).filter(item => item.decision !== "not_evidenced").every(item => item.evidence.length > 0 && item.notes.trim().length > 0); }
export function projectsAccessible(progress: DemoProgress) { return progress.projectReady === true; }
function reduceProgress(progress: DemoProgress, action: ProgressAction): DemoProgress {
  if (action.type === "replaceDemoProgress") return structuredClone(action.progress);
  if (action.type === "readProjectMessages") {
    if (!workspaceAccessible(progress) && progress.applicationStatus !== "sme_accepted") return progress;
    const unread = progress.workspace.messageUnread ?? { student: 1, sme: 1 };
    const incomingAuthor = action.reader === "student" ? "Sarah Collins" : "Alex Morgan";
    if (!unread[action.reader] && !progress.workspace.messages.some(message => message.author === incomingAuthor && message.status !== "read")) return progress;
    return { ...progress, workspace: { ...progress.workspace, messageUnread: { ...unread, [action.reader]: 0 }, messages: progress.workspace.messages.map(message => message.author === incomingAuthor ? { ...message, status: "read" } : message) } };
  }
  if (action.type === "sendSupportMessage") {
    if ((!action.text.trim() && !action.attachment) || (action.attachment && !(attachmentOptions as readonly DemoAttachment[]).includes(action.attachment))) return progress;
    const messages = progress.workspace.supportMessages ?? mockSupportMessages;
    return { ...progress, workspace: { ...progress.workspace, supportMessages: [...messages, { id: Math.max(0, ...messages.map(message => message.id)) + 1, author: "Alex Morgan", senderId: "alex-morgan", senderRole: "student", conversationId: supportConversationId, text: action.text.trim(), timestamp: "Now", attachment: action.attachment ?? null, status: "sent" }] } };
  }
  if (action.type === "registerStudent") return { ...progress, studentRegistered: true };
  if (action.type === "completeOnboarding") return { ...progress, studentRegistered: true, profileComplete: true };
  if (action.type === "loadCompletedPilotDemo" && !projectCancelled(progress) && !progress.projectCompletion.smeApproved) {
    return { ...progress, studentRegistered: true, profileComplete: true, assessmentComplete: true, completedActivities: [...learningActivityIds], startedActivities: [...learningActivityIds], readinessComplete: true, projectReady: true, projectAccessUnlocked: true, interestSubmitted: true, applicationStatus: "sme_accepted", setupStarted: true, activeProject: false, verifiedExperience: true, portfolioAdded: true,
      assessment: { ...progress.assessment, reassessment: { ...progress.assessment.reassessment, status: "completed" }, levels: { ...progress.assessment.levels, projectDelivery: "guidance" }, review: { ...progress.assessment.review, levels: { ...progress.assessment.levels, projectDelivery: "guidance" } } },
      preStart: Object.fromEntries(Object.keys(progress.preStart).map(key => [key, true])) as PreStartStatus,
      smeResponsibilityConfirmations: [...smeResponsibilities], workspaceTasks: progress.workspaceTasks.map(task => ({ ...task, status: "Completed" })),
      workspace: { ...progress.workspace, blockerResolved: true }, monitoring: { ...progress.monitoring, paused: false },
      submission: { ...mockSubmission, confirmations: [...finalConfirmations], deliverables: mockSubmission.deliverables.map(item => ({ ...item })) },
      projectCompletion: { ...progress.projectCompletion, tasksComplete: true, milestonesComplete: true, finalSubmitted: true, smeReviewStatus: "approved", smeApproved: true, changesRequested: false, capabilityReviewReady: true, verifiedExperienceReady: true },
      finalSMEReview: { ...mockFinalSMEReview, feedback: { ...mockFinalSMEReview.feedback, general: mockSMEOutcomes.comment }, reviewedDeliverableIds: mockSubmission.deliverables.map(item => item.id), portfolioPermissionsReviewed: true },
      capabilityReview: { ...createCapabilityReview(), status: "approved", verifiedExperienceReady: true },
      outcomes: { followUp30Day: true, followUp90Day: null, repeatInterest: true, repeatConfirmed: true, interviewInterest: true, repeatFollowUpRecorded: true } };
  }
  if (action.type === "record30DayFollowUp" && progress.projectCompletion.smeApproved && !projectCancelled(progress)) return { ...progress, outcomes: { ...progress.outcomes, followUp30Day: true } };
  if (action.type === "save90DayFollowUp" && progress.projectCompletion.smeApproved && !projectCancelled(progress) && followUpStatuses.includes(action.followUp.currentStatus) && ["Yes", "No", "Partly"].includes(action.followUp.related) && ["Yes", "No"].includes(action.followUp.evidenceUsed)) return { ...progress, outcomes: { ...progress.outcomes, followUp90Day: { ...action.followUp } } };
  if (action.type === "setRepeatDemand" && progress.projectCompletion.smeApproved && !projectCancelled(progress)) return { ...progress, outcomes: { ...progress.outcomes, repeatInterest: action.interested || action.confirmed, repeatConfirmed: action.confirmed, interviewInterest: action.interviewInterest, repeatFollowUpRecorded: true } };
  const dispute = progress.assessmentDispute;
  if (action.type === "loadAssessmentChallengeDemo" && !dispute.status && progress.assessment.levels.projectDelivery === "not_evidenced") return { ...progress, assessment: { ...progress.assessment, reassessment: { ...progress.assessment.reassessment, status: "completed" }, levels: { ...progress.assessment.levels, projectDelivery: "guidance" }, review: { ...progress.assessment.review, levels: { ...progress.assessment.review.levels, projectDelivery: "guidance" } }, humanAdjusted: [...new Set([...progress.assessment.humanAdjusted, "projectDelivery" as const])], humanReviewStatus: "completed", log: [...progress.assessment.log, { text: "Demo reviewed Project Delivery decision loaded: guidance. Learning and earned access unchanged.", date: "Today" }] } };
  if (action.type === "submitAssessmentDispute" && (!dispute.status || dispute.status === "more_evidence_required") && action.reviewTypes.length && action.reason.trim() && (action.evidence.length || action.otherEvidence.trim())) return { ...progress, assessmentDispute: { ...dispute, status: "submitted", originalReviewerNotes: dispute.originalReviewerNotes || (progress.capabilityReview.status === "approved" ? progress.capabilityReview.capabilities.projectDelivery.notes : progress.assessment.review.notes.projectDelivery) || "The student completed planned tasks, but evidence of independently managing a full project without guidance was limited.", originalDecision: dispute.originalDecision ?? currentDisputeLevel(progress), source: dispute.originalDecision ? dispute.source : progress.capabilityReview.status === "approved" ? "capability" : "assessment", reviewTypes: [...action.reviewTypes], studentReason: action.reason.trim(), evidenceSelected: [...action.evidence], otherEvidence: action.otherEvidence.trim(), evidenceRequest: null, history: [...dispute.history, { text: dispute.status ? "Student provided existing evidence references for review" : "Student challenge submitted", date: "Today" }] } };
  if (action.type === "beginAssessmentDisputeReview" && dispute.status === "submitted") return { ...progress, assessmentDispute: { ...dispute, status: "under_review", history: [...dispute.history, { text: "Second human review started", date: "Today" }] } };
  if (action.type === "requestDisputeEvidence" && ["submitted", "under_review"].includes(dispute.status ?? "") && action.area && action.text.trim()) return { ...progress, assessmentDispute: { ...dispute, status: "more_evidence_required", evidenceRequest: { area: action.area, text: action.text.trim() }, history: [...dispute.history, { text: `Reviewer requested evidence: ${action.area} — ${action.text.trim()}`, date: "Today" }] } };
  if (action.type === "resolveAssessmentDispute" && ["submitted", "under_review"].includes(dispute.status ?? "") && action.notes.trim() && dispute.originalDecision && (action.outcome === "upheld" || action.level !== dispute.originalDecision)) {
    const level = action.outcome === "upheld" ? currentDisputeLevel(progress) : action.level;
    const change = action.outcome === "changed";
    const needsReadinessReview = change && level === "not_evidenced";
    return { ...progress, ...(needsReadinessReview ? { readinessComplete: false, projectReady: false, projectAccessUnlocked: false } : {}), assessment: change ? { ...progress.assessment, levels: { ...progress.assessment.levels, projectDelivery: level }, humanAdjusted: [...new Set([...progress.assessment.humanAdjusted, "projectDelivery" as const])], review: { ...progress.assessment.review, levels: { ...progress.assessment.review.levels, projectDelivery: level }, notes: { ...progress.assessment.review.notes, projectDelivery: action.notes.trim() } }, log: [...progress.assessment.log, { text: `Second human review updated Project Delivery: ${level} — ${action.notes.trim()}`, date: "Today" }] } : progress.assessment, capabilityReview: change ? { ...progress.capabilityReview, capabilities: { ...progress.capabilityReview.capabilities, projectDelivery: { ...progress.capabilityReview.capabilities.projectDelivery, decision: level, notes: action.notes.trim() } } } : progress.capabilityReview, assessmentDispute: { ...dispute, status: "resolved", reviewOutcome: action.outcome, reviewerDecision: level, finalDecision: level, reviewerNotes: action.notes.trim(), history: [...dispute.history, { text: "Second human review completed", date: "Today" }, { text: `Final decision recorded: ${action.outcome} — ${action.notes.trim()}`, date: "Today" }] } };
  }
  if (action.type === "rejectUnsuitableProject") return { ...progress, rejectedDemoProject: { ...progress.rejectedDemoProject, status: "rejected" } };
  if (action.type === "archiveUnsuitableProject" && progress.rejectedDemoProject.status === "rejected") return { ...progress, rejectedDemoProject: { ...progress.rejectedDemoProject, archived: true } };
  if (action.type === "suggestProjectRedesign" && action.suggestion.trim()) return { ...progress, rejectedDemoProject: { ...progress.rejectedDemoProject, redesignRequested: true, suggestion: action.suggestion.trim() } };
  if (action.type === "loadWeekThreeCancellationDemo" && progress.preStart.workspaceUnlocked && progress.activeProject && !projectCancelled(progress)) return { ...progress, cancellation: { ...progress.cancellation, week: 3, progress: 45 }, workspaceTasks: progress.workspaceTasks.map((task, index) => ({ ...task, status: index < 3 ? "Completed" : index === 3 ? "In Progress" : "Not Started" })), workspace: { ...progress.workspace, studentUpdates: [...progress.workspace.studentUpdates.filter(item => item.week !== 3), { week: 3, status: "Current", feedback: "", completed: "Completed data cleaning and documented data quality issues.", next: "Continue exploratory analysis.", blockers: "Project data and supervisor availability are under review.", response: null }] } };
  if (action.type === "requestProjectCancellation" && progress.preStart.workspaceUnlocked && progress.activeProject && !projectCancelled(progress) && progress.cancellation.status === "active") return { ...progress, cancellation: { ...progress.cancellation, status: "cancellation_requested", log: [...progress.cancellation.log, "Project cancellation requested"] } };
  if (action.type === "cancelActiveProject" && progress.preStart.workspaceUnlocked && progress.activeProject && !progress.projectCompletion.smeApproved && !projectCancelled(progress) && action.reason.trim() && action.explanation.trim() && action.requestedBy) {
    const review = createCapabilityReview();
    for (const key of Object.keys(review.capabilities) as CapabilityKey[]) review.capabilities[key] = { decision: "not_evidenced", evidence: [], notes: "" };
    review.capabilities.dataHandling.evidence = progress.workspaceTasks.filter(task => task.status === "Completed").map(task => task.title);
    review.capabilities.communication.evidence = progress.workspace.studentUpdates.map(item => `Week ${item.week}: ${item.completed}`);
    review.status = "partial_review_required"; review.reviewerNotes = "Review only the work completed before cancellation. Do not infer a completed dashboard, final presentation or full project delivery.";
    return { ...progress, activeProject: false, workspace: { ...progress.workspace, meetings: progress.workspace.meetings.map(meeting => meeting.status === "Upcoming Meeting" ? { ...meeting, status: "Cancelled" } : meeting) }, monitoring: { ...progress.monitoring, paused: false }, capabilityReview: review, cancellation: { ...progress.cancellation, status: "cancelled", reason: action.reason, explanation: action.explanation.trim(), requestedBy: action.requestedBy, partialDecision: action.partialDecision, log: [...progress.cancellation.log, "Reason recorded", "Student impact reviewed: readiness and assessment unaffected", "Project cancelled", "Workspace moved to read-only", "Partial experience review created"] } };
  }
  if (action.type === "recordClosureFeedback" && projectCancelled(progress) && action.feedback.trim()) return { ...progress, cancellation: { ...progress.cancellation, closureFeedback: action.feedback.trim(), performanceCause: action.performanceCause, feedbackRecorded: true, log: [...progress.cancellation.log, "SME closure feedback recorded"] } };
  if (projectCancelled(progress) && ["setWorkspaceTask", "updateSubmission", "submitFinalProject", "resubmitFinalProject", "acceptFinalSMEProject", "approveFinalProject", "requestFinalSMEChanges", "requestProjectChanges", "sendWorkspaceMessage", "addWorkspaceFile", "submitStudentUpdate", "setTaskFeedback", "respondToStudentUpdate", "addWeeklyFeedback", "rescheduleMeeting", "resolveBlocker", "recordProjectIssue", "requestScopeChange", "unlockWorkspace", "setPreStart", "confirmSMEReadiness", "smeAcceptCandidate", "acceptApplication", "declineApplication", "submitInterest", "pauseMonitoredProject", "resumeMonitoredProject", "reviewMonitoringIssue", "escalateMonitoringIssue", "resolveMonitoringIssue", "reviewScopeChange"].includes(action.type)) return progress;
  const availability = progress.matchingAvailability;
  if (action.type === "showNoMatchingProjects") return projectsAccessible(progress) && availability.supply !== "no_match" ? { ...progress, matchingAvailability: { ...availability, supply: "no_match", log: [...availability.log, { text: "Initial matching search: no suitable approved project", date: "Today" }] } } : progress;
  if (action.type === "setProjectWaitlist") return projectsAccessible(progress) && availability.waitlistStatus !== (action.active ? "active" : "inactive") ? { ...progress, matchingAvailability: { ...availability, supply: "no_match", waitlistStatus: action.active ? "active" : "inactive", preferencesActive: true, log: [...availability.log, { text: action.active ? "Waitlist joined; current preferences remain active" : "Waitlist paused; project readiness retained", date: "Today" }] } } : progress;
  if (action.type === "saveMatchingPreferences" && action.preferences.projectAreas.length && Object.values(action.preferences).every(value => !!value.length)) return { ...progress, matchingAvailability: { ...availability, preferences: { ...action.preferences, projectAreas: [...action.preferences.projectAreas] }, preferencesActive: true, log: [...availability.log, { text: "Project preferences reviewed and updated", date: "Today" }] } };
  if (action.type === "recordMatchingSuggestion" && action.text.trim()) return { ...progress, matchingAvailability: { ...availability, suggestions: [...availability.suggestions, action.text.trim()], log: [...availability.log, { text: `Admin: ${action.text.trim()}`, date: "Today" }] } };
  if (action.type === "approveSuitableDemoProject" && availability.newProjectStatus !== "approved") return { ...progress, matchingAvailability: { ...availability, newProjectStatus: "approved", log: [...availability.log, { text: "Retail Reporting Dashboard approved in demo; new project availability recorded", date: "Today" }] } };

  if (action.type === "requestAssessmentHumanReview" && action.text.trim()) return { ...progress, assessment: { ...progress.assessment, reviewRequest: { category: action.category, text: action.text.trim() }, humanReviewStatus: "pending", log: [...progress.assessment.log, { text: "Human review pending: student requested assessment review", date: "Today" }] } };
  if (action.type === "setReassessmentAnswers" && reassessmentAvailable(progress)) return { ...progress, assessment: { ...progress.assessment, reassessment: { ...progress.assessment.reassessment, answers: { ...progress.assessment.reassessment.answers, ...action.patch } } } };
  if (action.type === "submitReassessment" && reassessmentAvailable(progress)) {
    const answers = progress.assessment.reassessment.answers;
    if (!answers.delivery || !answers.communication || !answers.planning.length) return progress;
    const confirmed = answers.delivery === mockReassessment.deliveryOptions[1] && answers.communication === mockReassessment.communicationOptions[1] && answers.planning.length === 4 && mockReassessment.planningOptions.slice(0, 4).every(item => answers.planning.includes(item));
    const levels = { ...progress.assessment.levels };
    if (confirmed && !progress.assessment.humanAdjusted.includes("projectDelivery")) levels.projectDelivery = "guidance";
    if (confirmed && !progress.assessment.humanAdjusted.includes("communication")) levels.communication = "independent";
    return { ...progress, readinessComplete: false, projectReady: false, projectAccessUnlocked: false, assessment: { ...progress.assessment, levels, review: { ...progress.assessment.review, levels: { ...levels } }, reassessment: { ...progress.assessment.reassessment, status: confirmed ? "completed" : "more_practice", attempts: progress.assessment.reassessment.attempts + 1 }, log: [...progress.assessment.log, { text: confirmed ? "Reassessment completed: development confirmed in demo responses" : "Reassessment completed: more practice recommended", date: "Today" }] } };
  }
  if (action.type === "completeReassessmentPractice" && progress.assessment.reassessment.status === "more_practice") return { ...progress, assessment: { ...progress.assessment, reassessment: { ...progress.assessment.reassessment, status: "not_started", answers: { delivery: "", communication: "", planning: [] } }, log: [...progress.assessment.log, { text: "Additional practice completed; another reassessment available", date: "Today" }] } };
  if (action.type === "updateAssessmentReviewCapability") { const review = progress.assessment.review; return { ...progress, assessment: { ...progress.assessment, review: { ...review, actions: action.action ? { ...review.actions, [action.key]: action.action } : review.actions, levels: action.level ? { ...review.levels, [action.key]: action.level } : review.levels, notes: action.notes !== undefined ? { ...review.notes, [action.key]: action.notes } : review.notes } } }; }
  if (action.type === "setAssessmentReviewerNotes") return { ...progress, assessment: { ...progress.assessment, review: { ...progress.assessment.review, reviewerNotes: action.notes } } };
  if (action.type === "decideAssessmentReview") {
    const assessment = progress.assessment;
    const review = assessment.review;
    const evidenceNeeded = action.decision === "request_evidence" || Object.values(review.actions).includes("request_evidence");
    if ((action.decision === "adjust" && !Object.values(review.actions).includes("change")) || !review.reviewerNotes.trim() || assessmentCapabilities.some(item => review.actions[item.key] !== "confirm" && !review.notes[item.key].trim()) || (evidenceNeeded && !action.evidenceRequired.trim())) return progress;
    const levels = { ...assessment.levels };
    const changed = assessmentCapabilities.filter(item => review.actions[item.key] === "change").map(item => item.key);
    if (action.decision === "adjust" || action.decision === "confirm") changed.forEach(key => { levels[key] = review.levels[key]; });
    return { ...progress, readinessComplete: false, projectReady: false, projectAccessUnlocked: false, assessment: { ...assessment, reassessment: action.decision === "recommend_reassessment" ? { ...assessment.reassessment, status: "not_started", answers: { delivery: "", communication: "", planning: [] } } : assessment.reassessment, levels, humanAdjusted: [...new Set([...assessment.humanAdjusted, ...(action.decision === "adjust" || action.decision === "confirm" ? changed : [])])], humanReviewStatus: evidenceNeeded ? "evidence_requested" : "completed", review: { ...review, decision: action.decision, evidenceRequired: evidenceNeeded ? action.evidenceRequired.trim() : "" }, log: [...assessment.log, ...(action.decision === "adjust" || action.decision === "confirm" ? changed.map(key => ({ text: `Human level review: ${assessmentCapabilities.find(item => item.key === key)?.name} — ${assessment.levels[key]} to ${levels[key]}. ${review.notes[key]}`, date: "Today" })) : []), { text: `Final reviewer decision: ${action.decision.replaceAll("_", " ")} — ${review.reviewerNotes.trim()}`, date: "Today" }] } };
  }
  if (["recordAdminIntervention", "pauseMonitoredProject", "resumeMonitoredProject", "reviewMonitoringIssue", "escalateMonitoringIssue", "resolveMonitoringIssue", "reviewScopeChange"].includes(action.type)) {
    if (!progress.preStart.workspaceUnlocked || progress.projectCompletion.smeApproved) return progress;
    const monitoring = progress.monitoring;
    const log = (text: string) => [{ text, date: "Today" }, ...monitoring.activity];
    if (action.type === "recordAdminIntervention" && action.notes.trim() && action.actionType !== "Pause Project") return { ...progress, monitoring: { ...monitoring, interventions: [...monitoring.interventions, { type: action.actionType, notes: action.notes.trim(), reviewer: "EzraTech Admin", date: "Today" }], activity: log(`Admin intervention: ${action.actionType} — ${action.notes.trim()}`) } };
    if (action.type === "pauseMonitoredProject" && action.notes.trim() && !monitoring.paused) return { ...progress, monitoring: { ...monitoring, paused: true, pauseReason: `${action.reason}: ${action.notes.trim()}`, activity: log(`Project paused: ${action.reason} — ${action.notes.trim()}`) } };
    if (action.type === "resumeMonitoredProject" && action.note.trim() && monitoring.paused) return { ...progress, monitoring: { ...monitoring, paused: false, resumeNote: action.note.trim(), activity: log(`Project resumed: ${action.note.trim()}`) } };
    if (action.type === "reviewScopeChange" && progress.workspace.scopeChanges[action.index] && action.review.notes.trim() && action.review.workloadImpact.trim() && action.review.skillsImpact.trim()) return { ...progress, monitoring: { ...monitoring, scopeReviews: { ...monitoring.scopeReviews, [action.index]: action.review }, activity: log(`Scope change ${action.review.decision.replaceAll("_", " ")}: ${action.review.notes}`) } };
    if (action.type === "reviewMonitoringIssue" || action.type === "escalateMonitoringIssue" || action.type === "resolveMonitoringIssue") {
      const issue = projectIssues(progress).find(item => item.id === action.id);
      if (!issue || issue.status === "resolved") return progress;
      const current = monitoring.issueReviews[action.id] || { ...defaultIssueReview };
      if (action.type === "reviewMonitoringIssue" && action.owner.trim()) return { ...progress, monitoring: { ...monitoring, issueReviews: { ...monitoring.issueReviews, [action.id]: { ...current, owner: action.owner, adminNotes: action.notes } }, activity: log(`Admin opened issue review; owner: ${action.owner}. ${action.notes}`) } };
      if (action.type === "escalateMonitoringIssue" && action.notes.trim()) return { ...progress, monitoring: { ...monitoring, issueReviews: { ...monitoring.issueReviews, [action.id]: { ...current, escalation: { reason: action.reason, notes: action.notes.trim(), level: action.level } } }, activity: log(`Issue escalated to ${action.level}: ${action.reason} — ${action.notes.trim()}`) } };
      if (action.type === "resolveMonitoringIssue" && action.resolution.trim() && action.studentInformed && action.smeInformed) return { ...progress, workspace: action.id === "blocker" ? { ...progress.workspace, blockerResolved: true } : progress.workspace, monitoring: { ...monitoring, issueReviews: { ...monitoring.issueReviews, [action.id]: { ...current, resolution: action.resolution.trim(), studentInformed: true, smeInformed: true } }, activity: log(`Issue resolved: ${action.resolution.trim()}`) } };
    }
    return progress;
  }
  if (progress.monitoring.paused && ["setWorkspaceTask", "updateSubmission", "submitFinalProject", "resubmitFinalProject", "acceptFinalSMEProject", "approveFinalProject", "requestFinalSMEChanges", "requestProjectChanges", "addWorkspaceFile", "submitStudentUpdate", "setTaskFeedback", "respondToStudentUpdate", "addWeeklyFeedback", "rescheduleMeeting", "resolveBlocker", "recordProjectIssue", "requestScopeChange"].includes(action.type)) return progress;
  if (["setCapabilityDecision", "setCapabilityNotes", "setCapabilityReviewerNotes", "requestCapabilityClarification", "returnCapabilityEvidence", "approveCapabilityExperience"].includes(action.type)) {
    if ((!projectCancelled(progress) && (!progress.projectCompletion.smeApproved || !progress.projectCompletion.capabilityReviewReady)) || progress.capabilityReview.status === "approved") return progress;
    const review = progress.capabilityReview;
    if (action.type === "setCapabilityDecision" && action.key !== "python") return { ...progress, capabilityReview: { ...review, capabilities: { ...review.capabilities, [action.key]: { ...review.capabilities[action.key], decision: action.decision } } } };
    if (action.type === "setCapabilityNotes") return { ...progress, capabilityReview: { ...review, capabilities: { ...review.capabilities, [action.key]: { ...review.capabilities[action.key], notes: action.notes } } } };
    if (action.type === "setCapabilityReviewerNotes") return { ...progress, capabilityReview: { ...review, reviewerNotes: action.notes } };
    if (action.type === "requestCapabilityClarification" && action.text.trim()) return { ...progress, verifiedExperience: false, capabilityReview: { ...review, status: "clarification_requested", clarification: { category: action.category, text: action.text.trim() }, verifiedExperienceReady: false }, projectCompletion: { ...progress.projectCompletion, verifiedExperienceReady: false } };
    if (action.type === "returnCapabilityEvidence") return { ...progress, capabilityReview: { ...review, status: "under_review" } };
    if (action.type === "approveCapabilityExperience" && projectCancelled(progress) && review.status !== "clarification_requested" && review.reviewerNotes.trim() && confirmedCapabilities(review).length && capabilityDefinitionsForPartial(review)) return { ...progress, cancellation: { ...progress.cancellation, status: "partial_review", partialApproved: true, log: [...progress.cancellation.log, "Partial experience reviewed and approved by Admin"] }, capabilityReview: { ...review, status: "approved", verifiedExperienceReady: false } };
    if (action.type === "approveCapabilityExperience" && !projectCancelled(progress) && review.status !== "clarification_requested" && confirmedCapabilities(review).length) return { ...progress, verifiedExperience: true, capabilityReview: { ...review, status: "approved", verifiedExperienceReady: true }, projectCompletion: { ...progress.projectCompletion, verifiedExperienceReady: true } };
    return progress;
  }
  if (["markFinalDeliverableReviewed", "setFinalCriterion", "setFinalFeedback", "setFinalPortfolioPermission", "confirmFinalPortfolioPermissions", "acceptFinalSMEProject", "requestFinalSMEChanges"].includes(action.type)) {
    if (!progress.preStart.workspaceUnlocked || !progress.projectCompletion.finalSubmitted || progress.projectCompletion.smeApproved || progress.projectCompletion.changesRequested) return progress;
    const review = progress.finalSMEReview;
    if (action.type === "markFinalDeliverableReviewed" && progress.submission.deliverables.some(item => item.id === action.id && item.file) && !review.reviewedDeliverableIds.includes(action.id)) return { ...progress, finalSMEReview: { ...review, reviewedDeliverableIds: [...review.reviewedDeliverableIds, action.id] } };
    if (action.type === "setFinalCriterion") return { ...progress, finalSMEReview: { ...review, acceptanceCriteria: { ...review.acceptanceCriteria, [action.key]: action.value } } };
    if (action.type === "setFinalFeedback") return { ...progress, finalSMEReview: { ...review, feedback: { ...review.feedback, [action.key]: action.value } } };
    if (action.type === "setFinalPortfolioPermission") return { ...progress, finalSMEReview: { ...review, portfolioPermissionsReviewed: false, portfolioPermissions: { ...review.portfolioPermissions, [action.key]: action.value } } };
    if (action.type === "confirmFinalPortfolioPermissions") return { ...progress, finalSMEReview: { ...review, portfolioPermissionsReviewed: true } };
    if (action.type === "requestFinalSMEChanges" && action.categories.length && action.text.trim()) return { ...progress, finalSMEReview: { ...review, changeRequest: { categories: [...action.categories], text: action.text.trim(), requestedDate: action.requestedDate } }, projectCompletion: { ...progress.projectCompletion, smeReviewStatus: "changes_requested", changesRequested: true, smeApproved: false, capabilityReviewReady: false, verifiedExperienceReady: false } };
    if (action.type === "acceptFinalSMEProject" && finalReviewReady(review, progress.submission)) return { ...progress, activeProject: false, projectCompletion: { ...progress.projectCompletion, smeReviewStatus: "approved", changesRequested: false, smeApproved: true, capabilityReviewReady: true, verifiedExperienceReady: false } };
    return progress;
  }
  if (["sendWorkspaceMessage", "addWorkspaceFile", "submitStudentUpdate", "setTaskFeedback", "respondToStudentUpdate", "addWeeklyFeedback", "rescheduleMeeting", "resolveBlocker", "recordProjectIssue", "requestScopeChange"].includes(action.type)) {
    if (action.type === "sendWorkspaceMessage" ? (!progress.preStart.workspaceUnlocked && progress.applicationStatus !== "sme_accepted") : (!progress.preStart.workspaceUnlocked || !progress.activeProject)) return progress;
    const workspace = progress.workspace;
    if (action.type === "sendWorkspaceMessage") {
      if ((!action.text.trim() && !action.attachment) || (action.attachment && !projectAttachmentAllowed("northstar-sales-analysis", action.attachment)) || progress.projectCompletion.smeApproved || progress.projectCompletion.finalSubmitted) return progress;
      const student = action.author === "Alex Morgan";
      const unread = workspace.messageUnread ?? { student: 1, sme: 1 };
      return { ...progress, workspace: { ...workspace, messageUnread: { ...unread, [student ? "sme" : "student"]: unread[student ? "sme" : "student"] + 1 }, messages: [...workspace.messages, { id: Math.max(0, ...workspace.messages.map(item => item.id)) + 1, author: action.author, text: action.text.trim(), senderId: student ? "alex-morgan" : "sarah-collins", senderRole: student ? "student" : "sme", conversationId: projectConversationId, projectId: "northstar-sales-analysis", timestamp: "Now", attachment: action.attachment ?? null, status: "sent" }] } };
    }
    if (action.type === "addWorkspaceFile" && action.name.trim() && !workspace.files.some(file => file.name === action.name.trim())) return { ...progress, workspace: { ...workspace, files: [...workspace.files, { name: action.name.trim(), type: "Demo file", uploadedBy: action.author, date: "Week 2 · Demo" }] } };
    if (action.type === "submitStudentUpdate" && action.completed.trim() && action.next.trim()) return { ...progress, workspace: { ...workspace, studentUpdates: workspace.studentUpdates.map(item => item.week === 2 ? { ...item, completed: action.completed.trim(), next: action.next.trim(), blockers: action.blockers.trim(), response: null, feedback: "" } : item), blockerResolved: !action.blockers.trim() } };
    if (action.type === "setTaskFeedback" && action.feedback.trim() && progress.workspaceTasks.some(task => task.id === action.taskId)) return { ...progress, workspace: { ...workspace, taskFeedback: { ...workspace.taskFeedback, [action.taskId]: action.feedback.trim() } } };
    if (action.type === "respondToStudentUpdate" && action.response.feedback.trim() && action.response.guidance.trim()) return { ...progress, workspace: { ...workspace, studentUpdates: workspace.studentUpdates.map(item => item.week === action.week ? { ...item, response: { ...action.response }, feedback: action.response.feedback } : item) } };
    if (action.type === "addWeeklyFeedback" && action.feedback.general.trim()) return { ...progress, workspace: { ...workspace, weeklyFeedback: [...workspace.weeklyFeedback, { ...action.feedback }] } };
    if (action.type === "rescheduleMeeting" && action.day.trim() && action.time.trim()) return { ...progress, workspace: { ...workspace, meetings: workspace.meetings.map((meeting, index) => index === 0 ? { ...meeting, day: action.day.trim(), time: action.time.trim() } : meeting) } };
    if (action.type === "resolveBlocker") return { ...progress, workspace: { ...workspace, blockerResolved: true } };
    if (action.type === "recordProjectIssue" && action.description.trim()) return { ...progress, workspace: { ...workspace, issues: [...workspace.issues, { id: workspace.issues.length + 1, type: action.issueType, description: action.description.trim(), urgency: action.urgency }] } };
    if (action.type === "requestScopeChange" && Object.values(action.request).every(value => value.trim())) return { ...progress, workspace: { ...workspace, scopeChanges: [...workspace.scopeChanges, { ...action.request }] } };
    return progress;
  }
  if (action.type === "setMeetingAttendance") {
    if (!workspaceAccessible(progress) || !progress.activeProject || projectCancelled(progress) || progress.monitoring.paused || progress.projectCompletion.smeApproved || !attendanceStatuses.includes(action.status) || !Number.isInteger(action.index) || !progress.workspace.meetings[action.index] || progress.workspace.meetings[action.index].status === "Cancelled") return progress;
    return { ...progress, workspace: { ...progress.workspace, attendance: { ...progress.workspace.attendance, [action.index]: action.status } } };
  }
  if (action.type === "setFullPortfolioVisibility") return { ...progress, fullPortfolioVisibility: { ...progress.fullPortfolioVisibility, [action.key]: action.value } };
  if (action.type === "reviewExperience") {
    if (!progress.preStart.workspaceUnlocked || !progress.projectCompletion.smeApproved || progress.capabilityReview.status !== "approved" || progress.verifiedExperience) return progress;
    return { ...progress, verifiedExperience: true };
  }
  if (action.type === "addToPortfolio") return progress.verifiedExperience && progress.projectCompletion.smeApproved && !progress.portfolioAdded ? { ...progress, portfolioAdded: true } : progress;
  if (action.type === "setPortfolioVisibility") return progress.verifiedExperience ? { ...progress, portfolioVisibility: { ...progress.portfolioVisibility, [action.key]: action.value } } : progress;
  if (action.type === "setWorkspaceTask") {
    if (!progress.preStart.workspaceUnlocked || progress.projectCompletion.finalSubmitted || !progress.workspaceTasks.some(task => task.id === action.id)) return progress;
    const workspaceTasks = progress.workspaceTasks.map(task => task.id === action.id ? { ...task, status: action.status } : task);
    const complete = workspaceTasks.every(task => task.status === "Completed");
    return { ...progress, workspaceTasks, projectCompletion: { ...progress.projectCompletion, tasksComplete: complete, milestonesComplete: complete } };
  }
  if (action.type === "updateSubmission") return progress.preStart.workspaceUnlocked && progress.projectCompletion.tasksComplete && (!progress.projectCompletion.finalSubmitted || progress.projectCompletion.changesRequested) ? { ...progress, submission: { ...progress.submission, ...action.patch } } : progress;
  if (action.type === "submitFinalProject" || action.type === "resubmitFinalProject") {
    const completion = progress.projectCompletion;
    if (!progress.preStart.workspaceUnlocked || !completion.tasksComplete || !submissionReady(progress.submission)) return progress;
    if (action.type === "submitFinalProject" ? completion.finalSubmitted : !completion.changesRequested) return progress;
    return { ...progress, finalSMEReview: { ...progress.finalSMEReview, reviewedDeliverableIds: [], portfolioPermissionsReviewed: false }, projectCompletion: { ...completion, finalSubmitted: true, resubmitted: action.type === "resubmitFinalProject", smeReviewStatus: "pending", changesRequested: false, smeApproved: false, capabilityReviewReady: false, verifiedExperienceReady: false } };
  }
  if (action.type === "approveFinalProject" || action.type === "requestProjectChanges") {
    const completion = progress.projectCompletion;
    if (!progress.preStart.workspaceUnlocked || !completion.finalSubmitted || completion.smeReviewStatus !== "pending") return progress;
    const approved = action.type === "approveFinalProject";
    return { ...progress, activeProject: approved ? false : progress.activeProject, projectCompletion: { ...completion, smeReviewStatus: approved ? "approved" : "changes_requested", changesRequested: !approved, smeApproved: approved, capabilityReviewReady: approved, verifiedExperienceReady: false } };
  }
  if (action.type === "smeAcceptCandidate" || action.type === "acceptApplication") {
    if (progress.applicationStatus === "sme_accepted" || !projectsAccessible(progress) || !progress.interestSubmitted || progress.applicationStatus !== "sme_review") return progress;
    return { ...progress, setupStarted: true, applicationStatus: "sme_accepted", preStart: { ...mockPreStartStatus }, smeResponsibilityConfirmations: [], activeProject: false };
  }
  if (action.type === "setSMEResponsibilities") {
    if (progress.applicationStatus !== "sme_accepted" || progress.preStart.smeConfirmed) return progress;
    return { ...progress, smeResponsibilityConfirmations: action.values.filter(value => smeResponsibilities.includes(value)) };
  }
  if (action.type === "confirmSMEReadiness") {
    if (!projectsAccessible(progress) || !progress.interestSubmitted || progress.applicationStatus !== "sme_accepted" || !smeResponsibilities.every(item => progress.smeResponsibilityConfirmations.includes(item))) return progress;
    const preStart = { ...progress.preStart, smeConfirmed: true, supervisorConfirmed: true };
    preStart.workspaceUnlocked = workspacePrerequisites({ ...progress, preStart });
    return { ...progress, preStart, activeProject: preStart.workspaceUnlocked };
  }
  if (action.type === "setPreStart") {
    if (progress.applicationStatus !== "sme_accepted" || !progress.interestSubmitted || !projectsAccessible(progress) || !preStartChecklist.some(item => item.key === action.key)) return progress;
    const preStart = { ...progress.preStart, [action.key]: action.value };
    preStart.workspaceUnlocked = workspacePrerequisites({ ...progress, preStart });
    return { ...progress, preStart, activeProject: preStart.workspaceUnlocked };
  }
  if (action.type === "demoUnlockProjects") return progress.assessmentComplete && !projectCancelled(progress) ? { ...progress, projectReady: true, projectAccessUnlocked: true } : progress;
  if (action.type === "demoUnlockWorkspace") {
    if (!progress.assessmentComplete || !learningComplete(progress) || projectCancelled(progress)) return progress;
    const preStart = { ...progress.preStart };
    for (const key of Object.keys(preStart) as (keyof PreStartStatus)[]) preStart[key] = true;
    return { ...progress, projectReady: true, projectAccessUnlocked: true, interestSubmitted: true, applicationStatus: "sme_accepted", setupStarted: true, smeResponsibilityConfirmations: [...smeResponsibilities], preStart, activeProject: !progress.projectCompletion.smeApproved };
  }
  if (action.type === "unlockWorkspace") return workspacePrerequisites(progress) ? { ...progress, activeProject: true, preStart: { ...progress.preStart, workspaceUnlocked: true } } : progress;
  if (action.type === "startActivity" || action.type === "completeActivity") {
    if (!learningActivityIds.some(id => id === action.id)) return progress;
    const key = action.type === "startActivity" ? "startedActivities" : "completedActivities";
    return progress[key].includes(action.id) ? progress : { ...progress, [key]: [...progress[key], action.id] };
  }
  if (action.type === "submitInterest") return projectsAccessible(progress) ? { ...progress, monitoring: createProjectMonitoring(), capabilityReview: createCapabilityReview(), finalSMEReview: initialDemoProgress.finalSMEReview, workspace: createWorkspaceCollaboration(), interestSubmitted: true, outcomes: createOutcomeState(), verifiedExperience: false, portfolioAdded: false, portfolioVisibility: { ...mockPortfolioVisibility }, applicationStatus: "sme_review", workspaceTasks: mockTasks.map(task => ({ ...task })), projectCompletion: { ...mockProjectCompletion, tasksComplete: false, milestonesComplete: false }, submission: { ...mockSubmission }, preStart: { ...mockPreStartStatus }, smeResponsibilityConfirmations: [], activeProject: false } : progress;
  if (action.type === "declineApplication") return { ...progress, applicationStatus: "closed", verifiedExperience: false, portfolioAdded: false, preStart: { ...mockPreStartStatus }, smeResponsibilityConfirmations: [], activeProject: false };
  if (action.type === "completeAssessment") return { ...progress, assessmentComplete: true };
  if (action.type === "completeReadiness") return readinessAccessible(progress) ? { ...progress, readinessComplete: true, projectReady: true, projectAccessUnlocked: true } : progress;
  if (action.type === "unlockProjects") return projectsAccessible(progress) ? { ...progress, projectAccessUnlocked: true } : progress;
  return progress;
}

export function progressReducer(progress: DemoProgress, action: ProgressAction): DemoProgress {
  const next = reduceProgress(progress, action);
  if (next === progress) return progress;
  const activities: Partial<Record<ProgressAction["type"], string>> = { submitStudentUpdate: "Student submitted Week 2 update", setTaskFeedback: "SME provided task feedback", respondToStudentUpdate: "SME responded to student update", recordProjectIssue: "SME reported a project issue", requestScopeChange: "SME submitted a scope change request", resolveBlocker: "SME resolved the student blocker", submitFinalProject: "Student submitted final project", resubmitFinalProject: "Student resubmitted final project", acceptFinalSMEProject: "SME accepted the completed project", approveFinalProject: "SME accepted the completed project", sendWorkspaceMessage: "Project participant added a demo message" };
  if (!activities[action.type]) return next;
  const monitoring = action.type === "submitStudentUpdate" ? { ...next.monitoring, issueReviews: { ...next.monitoring.issueReviews, blocker: { ...defaultIssueReview } } } : next.monitoring;
  return { ...next, monitoring: { ...monitoring, activity: [{ text: activities[action.type]!, date: "Today" }, ...monitoring.activity] } };
}
