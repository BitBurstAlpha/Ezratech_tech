import "server-only";
import postgres from "postgres";

let pool: ReturnType<typeof postgres> | undefined;
export function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Demo database is not configured.");
  const local = ["localhost", "127.0.0.1"].includes(new URL(url).hostname);
  return pool ??= postgres(url, { prepare: false, max: 2, idle_timeout: 15, connect_timeout: 8, ssl: local ? false : { rejectUnauthorized: true, ca: process.env.DEMO_DATABASE_CA?.replace(/\\n/g, "\n") } });
}
export type Package = { id: string; name: string; audience: "student" | "sme"; description: string; inclusions: string[]; price: string | null; active: boolean };
export async function catalogue() {
  return database()<Package[]>`select * from ezra_demo.packages order by audience,price nulls last`;
}
export async function owns(user: string, id: string) {
  const rows = await database()`select 1 from ezra_demo.entitlements where user_id=${user} and package_id=${id} and status='active'`;
  return rows.length > 0;
}
