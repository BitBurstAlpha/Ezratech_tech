"use server";
import { session } from "@/lib/packages/session";
import { database } from "@/lib/packages/store";
import { issue, type Profile } from "@/lib/student-profile/model";
import { revalidatePath } from "next/cache";
export async function saveProfile(
  profile: Profile,
  version: number,
  expectedUser: string,
) {
  const who = await session();
  if (who?.role !== "student" || who.user !== expectedUser)
    return {
      error: "Your student session has changed. Reload before editing.",
    };
  const error = issue(profile);
  if (error) return { error };
  try {
    const sql = database();
    const payload = sql.json(profile);
    const rows =
      version === 0
        ? await sql`insert into ezra_profiles.student_profiles(user_id,profile) values (${who.user},${payload}::jsonb) on conflict do nothing returning version`
        : await sql`update ezra_profiles.student_profiles set profile=${payload}::jsonb,version=version+1 where user_id=${who.user} and version=${version} returning version`;
    if (!rows.length)
      return {
        error:
          "Another edit was saved first. Reload to see the latest profile.",
      };
    revalidatePath("/student/dashboard");
    return { version: Number(rows[0].version) };
  } catch {
    return {
      error:
        "Could not save your profile. Your edits are still here. Please try again.",
    };
  }
}
