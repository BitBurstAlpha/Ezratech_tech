import { projectCancelled } from "@/components/projects/closure/closure-data";
import type { DemoProgress } from "@/components/student/progress/progress-state";
import { demoProgressValues } from "@/components/student/workspace/workspace-data";
export const monitoringRoute = "/admin/active-projects/northstar-sales-analysis";
export type IssueStatus = "open" | "escalated" | "resolved";
export type IssueReview = { owner: string; adminNotes: string; escalation: { reason: string; notes: string; level: string } | null; resolution: string; studentInformed: boolean; smeInformed: boolean };
export type AdminIntervention = { type: string; notes: string; reviewer: string; date: string };
export type ScopeReview = { decision: "approved" | "revision_requested" | "declined"; notes: string; workloadImpact: string; skillsImpact: string };
export type ProjectActivity = { text: string; date: string };
export type ProjectMonitoring = { paused: boolean; pauseReason: string; resumeNote: string; issueReviews: Record<string, IssueReview>; interventions: AdminIntervention[]; scopeReviews: Record<number, ScopeReview>; activity: ProjectActivity[] };
export const mockAdminInterventions: AdminIntervention[] = [];
export const mockProjectActivityLog: ProjectActivity[] = [{ text: "Student reported product category blocker", date: "Today" }, { text: "Student submitted Week 2 update", date: "Yesterday" }, { text: "Weekly project meeting completed", date: "2 days ago" }];
export const mockScopeChanges = { requestedBy: "Northstar Retail Ltd", reason: "Understand customer purchase patterns", change: "Add customer segmentation analysis", timelineImpact: "Potential additional week of work", deliverablesImpact: "Additional segmentation analysis summary" };
export const mockProjectMonitoring: ProjectMonitoring = { paused: false, pauseReason: "", resumeNote: "", issueReviews: {}, interventions: mockAdminInterventions, scopeReviews: {}, activity: mockProjectActivityLog };
export function createProjectMonitoring(): ProjectMonitoring { return { ...mockProjectMonitoring, issueReviews: {}, interventions: [], scopeReviews: {}, activity: mockProjectActivityLog.map(item => ({ ...item })) }; }
export const defaultIssueReview: IssueReview = { owner: "Sarah Collins", adminNotes: "", escalation: null, resolution: "", studentInformed: false, smeInformed: false };
export const interventionTypes = ["Contact SME", "Contact Student", "Request Update", "Arrange Support Meeting", "Review Scope", "Pause Project", "Other"];
export const escalationReasons = ["Project Delay Risk", "Communication Breakdown", "Data Access Issue", "Scope Dispute", "Supervision Concern", "Student Availability", "Safety / Conduct Concern", "Other"];
export const pauseReasons = ["Data unavailable", "Supervision unavailable", "Student unavailable", "Scope issue", "Conduct / safety concern", "Other"];
export const issueTypes = ["Data Access", "Scope", "Communication", "Student Availability", "SME Supervision", "Other"];
export type MonitoringIssue = { id: string; type: string; title: string; description: string; reportedBy: string; priority: string; status: IssueStatus; owner: string; impact: string };
export function projectIssues(progress: DemoProgress): MonitoringIssue[] {
  const latest = progress.workspace.studentUpdates.find(item => item.week === 2)!;
  const completed = progress.projectCompletion.smeApproved;
  const blocker = latest.blockers ? [{ id: "blocker", type: "Data Access", title: latest.blockers === "Two product category labels need clarification." ? "Product Category Labels" : "Student Progress Blocker", description: latest.blockers, reportedBy: "Alex Morgan", priority: "Normal", status: completed || progress.workspace.blockerResolved ? "resolved" as const : progress.monitoring.issueReviews.blocker?.escalation ? "escalated" as const : "open" as const, owner: progress.monitoring.issueReviews.blocker?.owner || "Sarah Collins", impact: "The student needs clarification before continuing the affected project work." }] : [];
  return [...blocker, ...progress.workspace.issues.map(item => { const review = progress.monitoring.issueReviews[`issue-${item.id}`]; return { id: `issue-${item.id}`, type: item.type, title: `${item.type} Issue`, description: item.description, reportedBy: "Sarah Collins", priority: item.urgency, status: completed || review?.resolution ? "resolved" as const : review?.escalation ? "escalated" as const : "open" as const, owner: review?.owner || "Sarah Collins", impact: "Review the reported issue with the project participants to confirm its effect on delivery." }; })];
}
export function monitoringValues(progress: DemoProgress) {
  const completed = progress.projectCompletion.smeApproved;
  const issues = projectIssues(progress);
  const openIssues = completed || projectCancelled(progress) ? 0 : issues.filter(item => item.status !== "resolved").length;
  const openBlockers = projectCancelled(progress) || completed || progress.workspace.blockerResolved || !progress.workspace.studentUpdates.find(item => item.week === 2)?.blockers ? 0 : 1;
  const tasksComplete = progress.workspaceTasks.filter(item => item.status === "Completed").length;
  return { completed, issues, openIssues, openBlockers, progress: progress.cancellation.week === 3 && tasksComplete === 3 ? progress.cancellation.progress : demoProgressValues[tasksComplete], week: progress.cancellation.week === 3 ? 3 : tasksComplete === 6 ? 6 : 2, status: projectCancelled(progress) ? "Cancelled" : completed ? "Completed" : progress.monitoring.paused ? "Paused" : openIssues ? "Needs Attention" : "On Track", stage: progress.projectCompletion.finalSubmitted ? "Final Review" : tasksComplete >= 3 ? "Mid Project" : "Early" };
}
export const mockActiveProjects = [
  { id: "northstar-sales-analysis", title: "Sales Performance Analysis", company: "Northstar Retail Ltd", student: "Alex Morgan", week: "2 of 6", progress: 30, status: "Needs Attention", openIssues: 1, stage: "Early", issueTypes: ["Data Access"] },
  { id: "customer-feedback-analysis", title: "Customer Feedback Analysis", company: "BrightPath Services Ltd", student: "Emma Clarke", week: "3 of 4", progress: 65, status: "On Track", openIssues: 0, stage: "Mid Project", issueTypes: [] },
  { id: "marketing-dashboard-prototype", title: "Marketing Dashboard Prototype", company: "Oakwell Digital Ltd", student: "Daniel Lee", week: "1 of 5", progress: 15, status: "On Track", openIssues: 0, stage: "Early", issueTypes: [] },
];
