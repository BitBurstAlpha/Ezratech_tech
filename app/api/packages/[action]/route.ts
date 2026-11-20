import { NextResponse } from "next/server";
import { actors, issue, presenterAllowed, scenarioSpace, session, type Actor } from "@/lib/packages/session";
import { database, owns } from "@/lib/packages/store";
import { CheckoutNotice, fixture, settle, startCheckout } from "@/lib/packages/checkout";

const error = (message: string, status: number) => NextResponse.json({ message }, { status });
export async function POST(request: Request, context: RouteContext<"/api/packages/[action]">) {
  const origin = process.env.DEMO_APP_ORIGIN;
  if (!origin || request.headers.get("origin") !== origin) return error("Open the configured demo site to continue.", 403);
  const { action } = await context.params;
  try {
    const form = await request.formData();
    const field = (key: string) => String(form.get(key) ?? "");
    const id = field("id");
    if (action === "session") {
      if (!presenterAllowed(field("key"))) return error("Enter the private presenter key.", 403);
      const actor = field("actor") as Actor;
      const mode = field("mode");
      if (!Object.hasOwn(actors,actor) || !["resume","empty","purchased","cancelled"].includes(mode) || (actor === "admin" && mode !== "resume")) return error("Choose a valid scenario.", 400);
      const space = await scenarioSpace(mode !== "resume");
      const user = space + "/" + actor;
      const role = actors[actor].role;
      let url = "/" + role + "/packages";
      if (mode === "purchased" || mode === "cancelled") {
        const order = await fixture(user,role,mode === "purchased");
        url = "/checkout/" + (mode === "purchased" ? "success" : "cancel") + "?order=" + order;
      }
      await issue(actor, space);
      return NextResponse.json({ url, scope: ["alex","northstar","admin"].includes(actor) ? space : user });
    }
    const buyer = await session();
    if (!buyer) return error("Select a payment identity in the Demo Control Centre.", 403);
    if (action === "order") return NextResponse.json({ url: await startCheckout(buyer,id,origin) });
    if (action === "capture" || action === "cancel") {
      if (!/^[a-f0-9-]{36}$/i.test(id)) return error("Invalid order.",400);
      return NextResponse.json({ status: await settle(buyer.user,id,action === "cancel") });
    }
    if (action === "edit") {
      if (buyer.role !== "admin") return error("Presenter administration required.",403);
      const description = field("description").trim();
      const inclusions = field("inclusions").split(/\r?\n/).map(item => item.trim()).filter(Boolean);
      const price = field("price").trim();
      const free = ["free","starter"].includes(id);
      if (!description || description.length > 1200 || !inclusions.length || inclusions.length > 20 || inclusions.some(item => item.length > 250) ||
        (free ? price !== "0" : price && (!/^\d{1,7}(\.\d{1,2})?$/.test(price) || Number(price) <= 0))) return error("Check the description, inclusions and demo price.",400);
      const sql = database();
      const rows = await sql`update ezra_demo.packages set description=${description}, inclusions=${inclusions}, price=${price || null}, active=${form.has("active")} where id=${id} returning id`;
      if (!rows.length) return error("Unknown package.",404);
      return NextResponse.json({ message: "Package saved." });
    }
    if (action === "activity") {
      if (buyer.role !== "student" || id !== "planning" || !await owns(buyer.user,"learning")) return error("An active Learning Package is required.",403);
      const status = field("status");
      if (!["started","completed"].includes(status)) return error("Unknown activity state.",400);
      const sql = database();
      if (status === "completed") {
        const rows = await sql`update ezra_demo.course_progress set status='completed' where user_id=${buyer.user} and activity_id=${id} returning activity_id`;
        if (!rows.length) return error("Start the activity first.",409);
      } else await sql`insert into ezra_demo.course_progress values(${buyer.user},${id},'started') on conflict do nothing`;
      return NextResponse.json({ status });
    }
    return error("Unknown package action.",404);
  } catch (cause) {
    if (cause instanceof CheckoutNotice) return error(cause.message,409);
    return error("The demo service is unavailable. Check the configuration or retry this request.",503);
  }
}
