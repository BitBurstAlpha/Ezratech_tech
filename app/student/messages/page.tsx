import { notFound } from "next/navigation";
import { studentProjectAssignments } from "@/components/student/messages/message-data";
import { AssignedProjectMessages } from "@/components/student/messages/assigned-project-messages";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { StudentMessages } from "@/components/student/messages/student-messages";
export const metadata: Metadata = { title: "Messages | EzraTech" };
export default async function StudentMessagesPage({ searchParams }: { searchParams: Promise<{ student?: string }> }) {
  const { student } = await searchParams;
  if (student && student !== "alex-morgan") { if (!Object.hasOwn(studentProjectAssignments, student)) notFound(); return <AssignedProjectMessages key={student} studentId={student as keyof typeof studentProjectAssignments} />; }
  return <DashboardShell activePath="/student/messages" title="Messages" subtitle="Communicate with your SME supervisor and EzraTech support during your project."><StudentMessages /></DashboardShell>;
}
