import postgres from "postgres";

/** @param {string} url @param {string | undefined} ca */
export function connectDatabase(url, ca) {
  const local = ["localhost", "127.0.0.1"].includes(new URL(url).hostname);
  return postgres(url, {
    prepare: false,
    max: 2,
    idle_timeout: 15,
    connect_timeout: 8,
    ssl: local ? false : { rejectUnauthorized: true, ca: ca?.replace(/\\n/g, "\n") },
  });
}
