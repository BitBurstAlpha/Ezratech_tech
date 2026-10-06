import type { WorkspaceCollaboration } from "@/components/sme/workspace/workspace-data";
export const attendanceStatuses = ["Pending", "Present", "Absent"] as const;
export type AttendanceStatus = typeof attendanceStatuses[number];
export function attendanceSummary(workspace: WorkspaceCollaboration) {
  const required = workspace.meetings.map((meeting, index) => ({ meeting, index })).filter(({ meeting }) => meeting.status !== "Cancelled");
  const present = required.filter(({ index }) => workspace.attendance?.[index] === "Present").length;
  const absent = required.filter(({ index }) => workspace.attendance?.[index] === "Absent").length;
  const recorded = present + absent;
  return { required: required.length, present, absent, pending: required.length - recorded, percent: recorded ? Math.round(present / recorded * 100) : null, eligible: required.length > 0 && present === required.length };
}
