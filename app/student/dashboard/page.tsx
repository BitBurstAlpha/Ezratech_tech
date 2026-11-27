import type { Metadata } from "next";
import { readProfile } from "@/lib/student-profile/store";
import { session } from "@/lib/packages/session";
import { StudentOverview } from "@/components/student/dashboard/student-overview";
import styles from "./dashboard.module.css";

export const metadata: Metadata = { title: "Student Dashboard | EzraTech" };

export default async function StudentDashboardPage() {
  const identity = await session();
  const student =
    identity?.role === "student"
      ? { name: identity.name, actor: identity.actor }
      : null;
  const saved =
    identity?.role === "student"
      ? await readProfile(identity.user).catch(() => null)
      : null;
  const sections = saved?.profile.sections;
  const summary = sections && {
    name: sections.Overview[0]["Full name"],
    careerGoal: sections["Career Goals"][0]["Target role"] ?? "",
    skills: sections.Skills.map((row) => row["Skill name"]),
  };
  return (
    <div className={styles.dashboard}>
      <StudentOverview student={student} summary={summary} />
    </div>
  );
}
