import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";

export const actors = {
  alex: { name: "Alex Morgan", role: "student" },
  emma: { name: "Emma Clarke", role: "student" },
  northstar: { name: "Northstar Retail", role: "sme" },
  willow: { name: "Willow Studio", role: "sme" },
  admin: { name: "Demo presenter", role: "admin" },
} as const;
export type Actor = keyof typeof actors;
const cookieName = "ezra_package_session";
function sign(value: string) {
  const secret = process.env.DEMO_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Configure the demo session secret.");
  return createHmac("sha256", secret).update(value).digest("hex");
}
export function localStudentAvailable(host: string | null) {
  const origin = process.env.DEMO_APP_ORIGIN;
  return process.env.NODE_ENV === "development" && !process.env.NETLIFY &&
    process.env.DEMO_LOCAL_STUDENT === "true" && process.env.PAYPAL_ENV === "sandbox" &&
    (process.env.DEMO_SESSION_SECRET?.length ?? 0) >= 32 &&
    !!origin && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) &&
    host === new URL(origin).host;
}
export function presenterAllowed(value: string) {
  const expected = process.env.DEMO_PRESENTER_KEY;
  return !!expected && expected.length >= 32 && timingSafeEqual(Buffer.from(sign(value)), Buffer.from(sign(expected)));
}
export async function session() {
  const raw = (await cookies()).get(cookieName)?.value;
  if (!raw) return null;
  const [space, actor, expiry, mac, extra] = raw.split(".");
  if (extra !== undefined || !/^\d+$/.test(expiry) || !space || !process.env.DEMO_SESSION_SECRET || process.env.DEMO_SESSION_SECRET.length < 32) return null;
  const signed = sign([space, actor, expiry].join("."));
  if (!Object.hasOwn(actors, actor) || Number(expiry) <= Date.now() || mac?.length !== 64 || !/^[a-f0-9]{64}$/.test(mac) || !timingSafeEqual(Buffer.from(mac), Buffer.from(signed))) return null;
  return { ...actors[actor as Actor], user: space + "/" + actor, space, actor: actor as Actor };
}
export async function scenarioSpace(fresh: boolean) {
  return (!fresh && (await session())?.space) || randomUUID();
}
export async function issue(actor: Actor, space: string) {
  const value = [space, actor, Date.now() + 8 * 3600000].join(".");
  (await cookies()).set(cookieName, value + "." + sign(value), { httpOnly: true, sameSite: "lax", secure: process.env.DEMO_APP_ORIGIN?.startsWith("https://") ?? true, path: "/", maxAge: 28800 });
}

export async function endSession() {
  (await cookies()).delete(cookieName);
}
