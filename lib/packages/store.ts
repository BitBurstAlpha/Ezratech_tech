import "server-only";
import { connectDatabase } from "./connection.mjs";

let pool: ReturnType<typeof connectDatabase> | undefined;
export function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Demo database is not configured.");
  return pool ??= connectDatabase(url, process.env.DEMO_DATABASE_CA);
}
export type Package = { id: string; name: string; audience: "student" | "sme"; description: string; inclusions: string[]; price: string | null; active: boolean };
export async function catalogue() {
  return database()<Package[]>`select * from ezra_demo.packages order by audience,price nulls last`;
}
export async function owns(user: string, id: string) {
  const rows = await database()`select 1 from ezra_demo.entitlements where user_id=${user} and package_id=${id} and status='active'`;
  return rows.length > 0;
}
