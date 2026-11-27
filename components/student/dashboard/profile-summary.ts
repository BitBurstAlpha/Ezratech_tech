import { demoSkills, demoStudent } from "./demo-data";
import type { StudentDashboardProfile } from "../progress/progress-state";

export type DashboardStudent = { name: string; actor: string } | null;
export function dashboardProfile(
  student: DashboardStudent,
  saved: StudentDashboardProfile | undefined,
  demoScenario: boolean,
) {
  const alex = student?.actor === "alex" || (!student && demoScenario);
  return {
    alex,
    name: student?.name ?? saved?.name ?? (alex ? demoStudent.name : "Student"),
    careerGoal: saved?.careerGoal ?? (alex ? demoStudent.careerGoal : ""),
    skills: saved?.skills ?? (alex ? demoSkills : []),
  };
}
