import { session } from "@/lib/packages/session";
import { readProfile } from "@/lib/student-profile/store";
import { ProfileEditor } from "./profile-editor";
import styles from "../dashboard/dashboard.module.css";
export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const who = await session();
  const student = who?.role === "student" ? who : null;
  let unavailable = false;
  const saved = student
    ? await readProfile(student.user).catch(() => {
        unavailable = true;
        return null;
      })
    : null;
  return (
    <div className={styles.dashboard}>
      <ProfileEditor
        skillsTab={(await searchParams).section === "skills"}
        key={student?.user}
        student={
          student && {
            name: student.name,
            actor: student.actor,
            user: student.user,
          }
        }
        saved={saved}
        unavailable={unavailable}
      />
    </div>
  );
}
