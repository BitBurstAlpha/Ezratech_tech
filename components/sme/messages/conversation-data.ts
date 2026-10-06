import type { ManagedWorkspace } from "../workspace/workspace-manager-data";
import type { SharedMessage } from "@/components/student/messages/message-data";
export const smeSupportId = "sme-ezratech-support";
export const mockSMESupportMessages: SharedMessage[] = [
  { id: 1, conversationId: smeSupportId, author: "EzraTech Support", senderId: "ezratech-support", senderRole: "support", text: "Your Sales Performance Analysis project is currently in Week 2.", timestamp: "2 days ago", attachment: null, status: "read" },
  { id: 2, conversationId: smeSupportId, author: "Sarah Collins", senderId: "sarah-collins", senderRole: "sme", text: "Thanks.", timestamp: "2 days ago", attachment: null, status: "read" },
  { id: 3, conversationId: smeSupportId, author: "EzraTech Support", senderId: "ezratech-support", senderRole: "support", text: "One student blocker is currently open. You can review it in the project workspace.", timestamp: "2 days ago", attachment: null, status: "read" },
];
export function unreadBySME(project: ManagedWorkspace) { return project.unread?.sme ?? (project.projectId === "customer-feedback-analysis" ? 2 : project.projectId === "northstar-sales-analysis" ? 1 : 0); }
export function totalSMEUnread(projects: ManagedWorkspace[]) { return projects.reduce((total, project) => total + unreadBySME(project), 0); }
export function filterProjectConversations(projects: ManagedWorkspace[], filter: string, search: string, projectId: string) {
  const query = search.trim().toLowerCase();
  return projects.filter(project => (projectId === "all" || project.projectId === projectId) && (!query || [project.student, project.title, ...project.messages.map(message => message.text)].some(text => text.toLowerCase().includes(query))) && (filter === "All" || filter === "Unread" && unreadBySME(project) > 0 || filter === "Active Projects" && ["active", "needs_attention", "paused"].includes(project.status) || filter === "Pre-start" && project.status === "prestart" || filter === "Completed" && project.status === "completed"));
}
export function conversationMilestone(project: ManagedWorkspace) { return project.projectId === "northstar-sales-analysis" ? project.progress < 50 ? "Data Preparation" : "Analysis & Insights" : project.projectId === "customer-feedback-analysis" ? "Insight Summary" : project.status === "prestart" ? "Pre-start" : project.milestones.find(milestone => milestone.taskIds.some(id => project.tasks.some(task => task.id === id && task.status === "In Progress")))?.title ?? "Final Delivery"; }
