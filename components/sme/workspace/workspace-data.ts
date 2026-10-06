import { mockProjectMessages, mockSupportMessages, type SharedMessage } from "@/components/student/messages/message-data";
import type { AttendanceStatus } from "@/components/student/workspace/attendance-data";
import { mockTasks, mockFiles, mockMeetings } from "@/components/student/workspace/workspace-data";
export const mockSMEWorkspace = { projectId: "northstar-sales-analysis", company: "Northstar Retail Ltd", title: "Sales Performance Analysis", student: "Alex Morgan", supervisor: "Sarah Collins", currentWeek: 2, totalWeeks: 6, progress: 30, status: "active", blockerCount: 1, workspaceUnlocked: true };
export const mockSharedTasks = mockTasks;
export const mockSharedMessages = mockProjectMessages;
export const mockSharedFiles = mockFiles;
export const mockProjectIssues: ProjectIssue[] = [];
export const mockSupervisorFeedback = { cleaning: "Please confirm duplicate records before removing them and document any category changes." };
export const smeWorkspaceTabs = ["Overview", "Tasks", "Milestones", "Messages", "Files", "Meetings", "Calendar", "Attendance", "Student Updates", "Feedback", "Project Settings"] as const;
export type SMEWorkspaceTab = typeof smeWorkspaceTabs[number];
export type SupervisorResponse = { feedback: string; guidance: string; actionRequired: string };
export type StudentUpdate = { week: number; status: string; completed: string; next: string; blockers: string; feedback: string; response: SupervisorResponse | null };
export const mockStudentUpdates: StudentUpdate[] = [
  { week: 1, status: "Completed", completed: "Reviewed the project brief and dataset structure.", next: "Review data quality and begin cleaning.", blockers: "", feedback: "Good start. Continue with the data quality review.", response: null },
  { week: 2, status: "Current", completed: "Reviewed the sales dataset structure and started identifying duplicate customer records.", next: "Complete the cleaned dataset and begin exploratory analysis.", blockers: "Two product category labels need clarification.", feedback: "", response: null },
];
export type WeeklyFeedback = { week: string; communication: string; progress: string; quality: string; reliability: string; general: string };
export type ProjectIssue = { id: number; type: string; description: string; urgency: string };
export type ScopeChange = { reason: string; change: string; timelineImpact: string; deliverablesImpact: string };
export type WorkspaceCollaboration = {
  supportMessages?: SharedMessage[];
  messageUnread?: { student: number; sme: number };
  attendance?: Record<number, AttendanceStatus>;
  messages: SharedMessage[]; files: typeof mockSharedFiles; meetings: typeof mockMeetings;
  studentUpdates: StudentUpdate[]; taskFeedback: Record<string, string>; weeklyFeedback: WeeklyFeedback[];
  issues: ProjectIssue[]; scopeChanges: ScopeChange[]; blockerResolved: boolean;
};
export function createWorkspaceCollaboration(): WorkspaceCollaboration {
  return { supportMessages: mockSupportMessages.map(message => ({ ...message })), messageUnread: { student: 1, sme: 1 }, attendance: {}, messages: mockSharedMessages.map(item => ({ ...item })), files: mockSharedFiles.map(item => ({ ...item })), meetings: mockMeetings.map(item => ({ ...item, participants: [...item.participants] })), studentUpdates: mockStudentUpdates.map(item => ({ ...item })), taskFeedback: { ...mockSupervisorFeedback }, weeklyFeedback: [], issues: [], scopeChanges: [], blockerResolved: false };
}
export const qualitativeOptions = ["Needs Support", "Developing", "Positive", "Strong"];
export const supervisorEzraOptions = ["Summarise the latest student update", "Suggest feedback for the current task", "Summarise project blockers", "Prepare questions for the next meeting"] as const;
export const milestoneTaskIds = [["orientation", "review"], ["cleaning"], ["analysis"], ["dashboard"], ["presentation"]];
export const milestoneOutputs = [["Project brief reviewed", "Dataset structure understood"], ["Cleaned dataset", "Data quality notes", "Outstanding questions"], ["Sales trends", "Analysis summary"], ["Dashboard prototype", "Agreed business measures"], ["Final presentation", "Final deliverables"]];
