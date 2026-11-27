import "server-only";
import { database } from "@/lib/packages/store";
import type { Profile } from "./model";
export async function readProfile(user: string) {
  const [row] = await database()<
    { profile: Profile; version: number }[]
  >`select profile,version from ezra_profiles.student_profiles where user_id=${user}`;
  return row ?? null;
}
