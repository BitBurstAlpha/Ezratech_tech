import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { connectDatabase } from "../lib/packages/connection.mjs";

const tables = [
  "courses", "learning_plans", "course_assignments", "course_progress",
  "packages", "orders", "purchases", "entitlements",
];

let db;
let stage = "environment";
try {
  const file = await readFile(new URL("../.env.local", import.meta.url), "utf8");
  const { DATABASE_URL, DEMO_DATABASE_CA } = parseEnv(file);
  if (!DATABASE_URL || !DEMO_DATABASE_CA?.trim()) {
    throw new Error("Missing database configuration");
  }

  stage = "connection";
  db = connectDatabase(DATABASE_URL, DEMO_DATABASE_CA);
  await db.begin("read only", async sql => {
    stage = "login";
    const [role] = await sql`select current_user, session_user`;
    if (role.current_user !== "ezra_checkout" || role.session_user !== "ezra_checkout") {
      console.log("FAIL login: expected both roles to be ezra_checkout");
      process.exitCode = 1;
      return;
    }
    console.log("PASS login: current_user and session_user are ezra_checkout");

    stage = "tables";
    const rows = await sql`
      select c.relname from pg_catalog.pg_class c
      join pg_catalog.pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'ezra_demo' and c.relkind in ('r', 'p')
        and c.relname in ${sql(tables)}
    `;
    const found = new Set(rows.map(row => row.relname));
    const missing = tables.filter(name => !found.has(name));
    if (missing.length) {
      console.log("FAIL tables: missing " + missing.join(", "));
      process.exitCode = 1;
    } else {
      console.log("PASS tables: all 8 present");
    }

    stage = "package catalogue";
    const [counts] = await sql`
      select count(*) as total,
             count(*) filter (where id in ('free', 'learning', 'project', 'starter')) as seeded
      from ezra_demo.packages
    `;
    const pass = Number(counts.seeded) === 4;
    console.log(`${pass ? "PASS" : "FAIL"} package catalogue: ${counts.total} records, ${counts.seeded}/4 seed packages`);
    if (!pass) process.exitCode = 1;
  });
} catch (error) {
  // Driver error messages can contain the connection string or server-provided data.
  const code = /^[A-Z0-9_]{2,50}$/.test(error?.code) ? ` (${error.code})` : "";
  console.error(`FAIL ${stage}${code}`);
  process.exitCode = 1;
} finally {
  if (db) await db.end({ timeout: 2 });
}
