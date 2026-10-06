import type { DemoProgress } from "@/components/student/progress/progress-state";
export const projectConversationId = "northstar-alex-sarah";
export const supportConversationId = "ezratech-support";
export const attachmentOptions = ["cleaned-sales-data.xlsx", "week-2-update.pdf", "dashboard-screenshot.png"] as const;
export const smeAttachments = {
  "northstar-sales-analysis": ["sales-category-notes.pdf", "updated-sales-data.xlsx", "dashboard-feedback.png"],
  "customer-feedback-analysis": ["customer-feedback-summary.pdf", "recommendations-draft.docx"],
  "inventory-reporting-improvement": ["inventory-sample.xlsx"],
} as const;
export type DemoAttachment = typeof attachmentOptions[number] | typeof smeAttachments[keyof typeof smeAttachments][number];
export function projectAttachmentOptions(projectId: string): readonly DemoAttachment[] { return smeAttachments[projectId as keyof typeof smeAttachments] ?? []; }
export function projectAttachmentAllowed(projectId: string, attachment: DemoAttachment) { return projectAttachmentOptions(projectId).includes(attachment) || (projectId === "northstar-sales-analysis" && (attachmentOptions as readonly string[]).includes(attachment)); }
export type SharedMessage = {
  id: number; author: string; text: string; projectId?: string;
  conversationId?: string; senderId?: string; senderRole?: "student" | "sme" | "support";
  timestamp?: string; attachment?: DemoAttachment | null; status?: "sent" | "read";
};
export const mockConversations = [
  { id: projectConversationId, name: "Sarah Collins", role: "SME Supervisor", company: "Northstar Retail Ltd", project: "Sales Performance Analysis", unreadByStudent: 1, unreadBySME: 0, time: "10:42 AM", preview: "I am checking this with our reporting team and will confirm shortly." },
  { id: supportConversationId, name: "EzraTech Support", role: "Programme Support", company: "", project: "", unreadByStudent: 0, unreadBySME: 0, time: "Yesterday", preview: "Your Week 2 update has been recorded." },
  { id: "project-updates", name: "Project Updates", role: "System / Project Feed", company: "", project: "", unreadByStudent: 0, unreadBySME: 0, time: "Week 2", preview: 'Milestone "Data Preparation" is currently in progress.' },
] as const;
export const mockProjectMessages: SharedMessage[] = [
  { id: 1, author: "Alex Morgan", text: "Hi Sarah, I found two product category labels that may refer to the same group. Could you confirm which one should be used?", timestamp: "10:15 AM", senderRole: "student" as const, senderId: "alex-morgan" },
  { id: 2, author: "Sarah Collins", text: "Thanks Alex. I am checking this with our reporting team and will confirm shortly.", timestamp: "10:42 AM", senderRole: "sme" as const, senderId: "sarah-collins" },
  { id: 3, author: "Alex Morgan", text: "No problem. I will continue reviewing the remaining records while I wait.", timestamp: "10:45 AM", senderRole: "student" as const, senderId: "alex-morgan" },
  { id: 4, author: "Sarah Collins", text: "That sounds good. Please document the category issue in your Week 2 update as well.", timestamp: "10:48 AM", senderRole: "sme" as const, senderId: "sarah-collins" },
].map(message => ({ ...message, conversationId: projectConversationId, projectId: "northstar-sales-analysis", attachment: null, status: "sent" }));
export const mockSupportMessages: SharedMessage[] = [
  { id: 1, author: "EzraTech Support", text: "Your Week 2 project update has been recorded.", senderRole: "support" as const, timestamp: "Yesterday" },
  { id: 2, author: "Alex Morgan", text: "Thanks.", senderRole: "student" as const, timestamp: "Yesterday" },
  { id: 3, author: "EzraTech Support", text: "If the data clarification issue remains unresolved, you can request support from the project workspace.", senderRole: "support" as const, timestamp: "Yesterday" },
].map(message => ({ ...message, conversationId: supportConversationId, attachment: null, status: "read" }));
export function projectConversationAvailable(progress: DemoProgress) { return progress.preStart.workspaceUnlocked || progress.applicationStatus === "sme_accepted"; }
export function studentUnreadCount(progress: DemoProgress) { return projectConversationAvailable(progress) ? progress.workspace.messageUnread?.student ?? 1 : 0; }
export function projectFeed(progress: DemoProgress) {
  return [
    "Project started",
    "Week 1 completed",
    progress.workspace.studentUpdates.some(update => update.week === 2) ? "Week 2 update submitted" : "Week 2 update pending",
    progress.workspace.blockerResolved ? "Data clarification issue resolved" : "Data clarification issue reported",
    `Milestone \"Data Preparation\" ${progress.workspaceTasks.find(task => task.id === "cleaning")?.status === "Completed" ? "completed" : "currently in progress"}`,
  ];
}

export const studentProjectAssignments = { "emma-clarke": { projectId: "customer-feedback-analysis", name: "Emma Clarke" }, "daniel-lee": { projectId: "inventory-reporting-improvement", name: "Daniel Lee" } } as const;
