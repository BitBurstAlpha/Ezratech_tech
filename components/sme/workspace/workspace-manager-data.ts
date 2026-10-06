import { projectAttachmentAllowed, type DemoAttachment } from "@/components/student/messages/message-data";
import type { DemoProgress } from "@/components/student/progress/progress-state";
import { projectCancelled } from "@/components/projects/closure/closure-data";
import { demoProgressValues } from "@/components/student/workspace/workspace-data";
import type { SharedMessage } from "@/components/student/messages/message-data";
export type ManagedStatus = "prestart" | "active" | "needs_attention" | "paused" | "completed" | "cancelled";
export const statusLabels: Record<ManagedStatus, string> = { prestart: "Pre-start", active: "Active", needs_attention: "Needs Attention", paused: "Paused", completed: "Completed", cancelled: "Cancelled" };
export type ManagedWorkspace = {
  unread?: { student: number; sme: number };
  projectId: string; title: string; student: string; type: string; status: ManagedStatus; currentWeek: number; totalWeeks: number; progress: number;
  tasks: { id: string; title: string; status: "Not Started" | "In Progress" | "Completed"; weight: number }[];
  milestones: { title: string; taskIds: string[] }[]; messages: SharedMessage[]; files: { name: string; uploadedBy: string }[];
  meetings: { title: string; day: string; time: string }[]; updates: { week: number; text: string; time: string }[]; feedback: string[];
  issues: { id: string; projectId: string; title: string; status: string }[];
  setup: { student: boolean; sme: boolean; agreement: boolean; data: boolean; start: boolean }; lastActivity: string;
};
const setup = { student: true, sme: true, agreement: true, data: true, start: true };
const customer: ManagedWorkspace = {
  unread: { student: 0, sme: 2 }, projectId: "customer-feedback-analysis", title: "Customer Feedback Analysis", student: "Emma Clarke", type: "Customer Research", status: "active", currentWeek: 3, totalWeeks: 4, progress: 65,
  tasks: [{ id: "survey", title: "Review customer survey data", status: "Completed", weight: 30 }, { id: "themes", title: "Identify common feedback themes", status: "Completed", weight: 35 }, { id: "summary", title: "Prepare insight summary", status: "In Progress", weight: 20 }, { id: "recommendations", title: "Final recommendations", status: "Not Started", weight: 15 }],
  milestones: [{ title: "Survey Data Review", taskIds: ["survey"] }, { title: "Customer Feedback Analysis", taskIds: ["themes", "summary"] }, { title: "Final Recommendations", taskIds: ["recommendations"] }],
  messages: [
    { id: 1, conversationId: "northstar-emma-sarah", projectId: "customer-feedback-analysis", author: "Emma Clarke", senderId: "emma-clarke", text: "Hi Sarah, I have completed the initial customer feedback themes and uploaded the summary.", timestamp: "Yesterday", senderRole: "student", status: "sent" },
    { id: 2, conversationId: "northstar-emma-sarah", projectId: "customer-feedback-analysis", author: "Sarah Collins", senderId: "sarah-collins", text: "Thanks Emma. Please make sure the final recommendations clearly separate service, delivery and support themes.", timestamp: "Yesterday", senderRole: "sme", status: "read" },
    { id: 3, conversationId: "northstar-emma-sarah", projectId: "customer-feedback-analysis", author: "Emma Clarke", senderId: "emma-clarke", text: "Will do. I will update the recommendation section today.", timestamp: "Yesterday", senderRole: "student", status: "sent" },
  ],
  files: [{ name: "survey-results.csv", uploadedBy: "Sarah Collins" }, { name: "feedback-themes.docx", uploadedBy: "Emma Clarke" }],
  meetings: [{ title: "Feedback Analysis Check-In", day: "Wednesday", time: "11:00 AM" }],
  updates: [{ week: 3, text: "Initial themes have been identified across service quality, delivery and customer support.", time: "Yesterday" }], feedback: ["Clear initial themes. Continue developing the recommendations."], issues: [], setup: { ...setup }, lastActivity: "Yesterday",
};
const inventory: ManagedWorkspace = {
  unread: { student: 0, sme: 0 }, projectId: "inventory-reporting-improvement", title: "Inventory Reporting Improvement", student: "Daniel Lee", type: "Reporting", status: "prestart", currentWeek: 0, totalWeeks: 5, progress: 0,
  tasks: [{ id: "inventory-review", title: "Review inventory reporting requirements", status: "Not Started", weight: 25 }, { id: "inventory-data", title: "Prepare inventory data", status: "Not Started", weight: 25 }, { id: "inventory-report", title: "Create inventory report", status: "Not Started", weight: 30 }, { id: "inventory-handover", title: "Review and hand over report", status: "Not Started", weight: 20 }],
  milestones: [{ title: "Inventory Review", taskIds: ["inventory-review", "inventory-data"] }, { title: "Reporting Improvement", taskIds: ["inventory-report", "inventory-handover"] }],
  messages: [
    { id: 1, conversationId: "northstar-daniel-sarah", projectId: "inventory-reporting-improvement", senderId: "daniel-lee", author: "Daniel Lee", text: "Hi Sarah, I have completed my student confirmation.", timestamp: "Yesterday", senderRole: "student", status: "read" },
    { id: 2, conversationId: "northstar-daniel-sarah", projectId: "inventory-reporting-improvement", senderId: "sarah-collins", author: "Sarah Collins", text: "Thanks Daniel. We are waiting for the final data-access check before the project begins.", timestamp: "Yesterday", senderRole: "sme", status: "read" },
  ],
  files: [{ name: "inventory-sample.xlsx", uploadedBy: "Sarah Collins" }], meetings: [{ title: "Inventory Project Kick-Off", day: "Start date confirmed", time: "10:00 AM" }], updates: [], feedback: [], issues: [], setup: { ...setup, agreement: false, data: false }, lastActivity: "2 days ago",
};
function completedRecord(id: string, title: string, student: string): ManagedWorkspace {
  return { projectId: id, title, student, type: "Business Analysis", status: "completed", currentWeek: 4, totalWeeks: 4, progress: 100, tasks: [{ id: `${id}-delivery`, title: "Final project delivery", status: "Completed", weight: 100 }], milestones: [{ title: "Final Delivery", taskIds: [`${id}-delivery`] }], messages: [{ id: 1, conversationId: `${id}-conversation`, author: "Sarah Collins", text: `${title} outputs accepted. Thank you for your contribution.`, timestamp: "Previous project", senderRole: "sme", status: "read" }], files: [{ name: `${id}-summary.pdf`, uploadedBy: student }], meetings: [], updates: [{ week: 4, text: "Final outputs submitted and accepted.", time: "Previous project" }], feedback: ["Agreed project outputs accepted."], issues: [], setup: { ...setup }, lastActivity: "Previous project" };
}
export const mockSMEWorkspaces: Record<string, ManagedWorkspace> = {
  "customer-feedback-analysis": customer,
  "inventory-reporting-improvement": inventory,
  "monthly-reporting-review": completedRecord("monthly-reporting-review", "Monthly Reporting Review", "Emma Clarke"),
  "customer-insight-summary": completedRecord("customer-insight-summary", "Customer Insight Summary", "Daniel Lee"),
  "operations-dashboard-review": completedRecord("operations-dashboard-review", "Operations Dashboard Review", "Alex Morgan"),
};
// Alex's entry is a projection of the existing Student/SME/Admin record, never a second stored copy.
export function northstarWorkspace(progress: DemoProgress): ManagedWorkspace | null {
  if (!progress.preStart.workspaceUnlocked && progress.applicationStatus !== "sme_accepted" && !projectCancelled(progress)) return null;
  const latest = progress.workspace.studentUpdates.find(update => update.week === 2);
  const issues = [...(!progress.workspace.blockerResolved && latest?.blockers ? [{ id: "category", projectId: "northstar-sales-analysis", title: "Product Category Clarification", status: "Awaiting SME Response" }] : []), ...progress.workspace.issues.map(issue => ({ id: String(issue.id), projectId: "northstar-sales-analysis", title: issue.type, status: "Open" }))];
  const status: ManagedStatus = projectCancelled(progress) ? "cancelled" : progress.projectCompletion.smeApproved ? "completed" : progress.monitoring.paused ? "paused" : !progress.preStart.workspaceUnlocked ? "prestart" : issues.length ? "needs_attention" : "active";
  return { unread: progress.workspace.messageUnread ?? { student: 1, sme: 1 }, projectId: "northstar-sales-analysis", title: "Sales Performance Analysis", student: "Alex Morgan", type: "Data Analysis", status, currentWeek: progress.projectCompletion.tasksComplete ? 6 : 2, totalWeeks: 6, progress: demoProgressValues[progress.workspaceTasks.filter(task => task.status === "Completed").length], tasks: progress.workspaceTasks.map(task => ({ ...task, weight: 0 })), milestones: [], messages: progress.workspace.messages, files: progress.workspace.files, meetings: progress.workspace.meetings, updates: progress.workspace.studentUpdates.map(update => ({ week: update.week, text: update.completed, time: "Today" })), feedback: progress.workspace.weeklyFeedback.map(feedback => feedback.general), issues, setup: { student: progress.preStart.studentConfirmed, sme: progress.preStart.smeConfirmed, agreement: progress.preStart.projectAgreementReviewed, data: progress.preStart.dataAccessReady, start: progress.setupStarted }, lastActivity: "Today" };
}
export function workspaceList(records: Record<string, ManagedWorkspace>, progress: DemoProgress) { const alex = northstarWorkspace(progress); return [...(alex ? [alex] : []), ...Object.values(records)]; }
export function workspaceCounts(workspaces: ManagedWorkspace[]) {
  return { active: workspaces.filter(project => ["active", "needs_attention"].includes(project.status)).length, prestart: workspaces.filter(project => project.status === "prestart").length, attention: workspaces.filter(project => project.status === "needs_attention").length, completed: workspaces.filter(project => project.status === "completed").length };
}
export type WorkspaceAction = { type: "read"; projectId: string; reader: "student" | "sme" } | { type: "task"; projectId: string; taskId: string; status: ManagedWorkspace["tasks"][number]["status"] } | { type: "message"; projectId: string; author: string; text: string; attachment?: DemoAttachment; senderRole?: "sme" | "student" } | { type: "file"; projectId: string; name: string; author: string } | { type: "feedback"; projectId: string; text: string } | { type: "setup"; projectId: string; key: keyof ManagedWorkspace["setup"]; value: boolean } | { type: "status"; projectId: string; status: "paused" | "active" | "completed" | "cancelled" };
export function updateWorkspace(records: Record<string, ManagedWorkspace>, action: WorkspaceAction): Record<string, ManagedWorkspace> {
  const project = records[action.projectId];
  if (!project || project.projectId !== action.projectId) return records;
  if (action.type === "read") {
    const unread = project.unread ?? { student: 0, sme: project.projectId === "customer-feedback-analysis" ? 2 : 0 };
    if (!unread[action.reader] && !project.messages.some(message => message.senderRole === (action.reader === "sme" ? "student" : "sme") && message.status !== "read")) return records;
    return { ...records, [project.projectId]: { ...project, unread: { ...unread, [action.reader]: 0 }, messages: project.messages.map(message => message.senderRole === (action.reader === "sme" ? "student" : "sme") ? { ...message, status: "read" } : message) } };
  }
  if (["completed", "cancelled"].includes(project.status)) return records;
  const major = ["active", "needs_attention"].includes(project.status);
  let next = project;
  if (action.type === "message" && (action.text.trim() || action.attachment) && (!action.attachment || projectAttachmentAllowed(project.projectId, action.attachment))) next = { ...project, unread: { ...(project.unread ?? { sme: 0, student: 0 }), [action.senderRole === "student" ? "sme" : "student"]: (project.unread?.[action.senderRole === "student" ? "sme" : "student"] ?? 0) + 1 }, messages: [...project.messages, { id: Math.max(0, ...project.messages.map(message => message.id)) + 1, conversationId: project.messages[0]?.conversationId ?? `${project.projectId}-conversation`, projectId: project.projectId, senderId: action.senderRole === "student" ? project.student.toLowerCase().replaceAll(" ", "-") : "sarah-collins", author: action.author, senderRole: action.senderRole ?? "sme", text: action.text.trim(), timestamp: "Now", attachment: action.attachment ?? null, status: "sent" }] };
  if (action.type === "task" && major && ["Not Started", "In Progress", "Completed"].includes(action.status) && project.tasks.some(task => task.id === action.taskId)) { const tasks = project.tasks.map(task => task.id === action.taskId ? { ...task, status: action.status } : task); next = { ...project, tasks, progress: tasks.filter(task => task.status === "Completed").reduce((total, task) => total + task.weight, 0) }; }
  if (action.type === "file" && major && ["project-update.pdf", "milestone-summary.docx", "review-notes.txt"].includes(action.name)) next = { ...project, files: [...project.files, { name: action.name, uploadedBy: action.author }] };
  if (action.type === "feedback" && major && action.text.trim()) next = { ...project, feedback: [...project.feedback, action.text.trim()] };
  if (action.type === "setup" && project.status === "prestart" && Object.hasOwn(project.setup, action.key)) { const setup = { ...project.setup, [action.key]: action.value }; const ready = Object.values(setup).every(Boolean); next = { ...project, setup, status: ready ? "active" : "prestart", currentWeek: ready ? 1 : 0 }; }
  if (action.type === "status" && project.status !== "prestart") {
    if (action.status === "active" && project.status === "paused") next = { ...project, status: project.issues.length ? "needs_attention" : "active" };
    if (action.status === "paused" && major) next = { ...project, status: "paused" };
    if (action.status === "cancelled") next = { ...project, status: "cancelled" };
    if (action.status === "completed" && major && project.tasks.every(task => task.status === "Completed")) next = { ...project, status: "completed", currentWeek: project.totalWeeks };
  }
  return next === project ? records : { ...records, [project.projectId]: { ...next, lastActivity: "Now" } };
}
