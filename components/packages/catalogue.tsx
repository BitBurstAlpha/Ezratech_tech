import { LearningEditor } from "./learning-editor";
import Link from "next/link";
import { catalogue, database, type Package } from "@/lib/packages/store";
import { session } from "@/lib/packages/session";
import { PackageForm } from "./forms";

export const notice = "Sandbox Payment Demo · All transactions are simulated. No real money is charged.";
export function DemoIdentityLink() {
  return <Link prefetch={false} className="font-semibold text-primary underline" href="/demo#payment-demo">Select a payment identity in the Demo Control Centre</Link>;
}
const card = "grid content-start gap-4 rounded-xl border border-border bg-white p-6";
function Editor({ item }: { item: Package }) {
  const free = ["free","starter"].includes(item.id);
  return <PackageForm action="edit" label="Save package"><input type="hidden" name="id" value={item.id}/>
    <label>Description<textarea className="block w-full rounded border p-2" required name="description" maxLength={1200} defaultValue={item.description}/></label>
    <label>Inclusions, one per line<textarea className="block w-full rounded border p-2" rows={5} required name="inclusions" defaultValue={item.inclusions.join("\n")}/></label>
    <label>Demo price in GBP<input className="block rounded border p-2" name="price" type="number" step=".01" min={free ? 0 : .01} max="9999999.99" readOnly={free} defaultValue={free ? "0" : item.price ?? ""} placeholder="To Be Confirmed"/></label>
    <label><input name="active" type="checkbox" defaultChecked={item.active}/> Active</label></PackageForm>;
}
export async function Catalogue({ role }: { role: "student" | "sme" | "admin" }) {
  const buyer = await session();
  const admin = role === "admin";
  if (admin && buyer?.role !== "admin") return <DemoIdentityLink/>;
  const data = await (async () => {
    const packages = (await catalogue()).filter(item=>admin || (item.audience === role && item.active));
    const active = buyer?.role === role && !admin ? await database()`select package_id from ezra_demo.entitlements where user_id=${buyer.user} and status='active'` : [];
    const records = admin ? await database()`select o.user_id,p.name,o.amount,o.currency,o.status,o.provider,b.provider_capture_id from ezra_demo.orders o join ezra_demo.packages p on p.id=o.package_id left join ezra_demo.purchases b on b.order_id=o.id order by o.created_at desc limit 100` : [];
    return { packages, active, records };
  })().catch(() => null);
  if (!data) return <p role="status">{notice} The package database is unavailable. Check the demo configuration and reload.</p>;
  const { packages, active, records } = data;
  return <div className="space-y-5"><p className="text-sm">{notice}</p>{buyer?.role === role ? <p>Demo identity · {buyer.name}</p> : <DemoIdentityLink/>}
      <div className="grid gap-5 lg:grid-cols-2">{packages.map(item=>{
        const free = Number(item.price) === 0 && item.price !== null;
        const href = role === "student" ? "/student/learning-plan" : free ? "/sme/profile" : "/sme/projects";
        return <article key={item.id} className={card}>{admin && <span className="text-xs uppercase text-primary">{item.audience}</span>}<h2 className="text-xl font-semibold">{item.name}</h2>
          {admin ? <Editor item={item}/> : <><p>{item.description}</p><p className="text-2xl font-semibold">{item.price === null ? "To Be Confirmed" : free ? "£0" : "£"+item.price}</p>
          <ul className="list-disc space-y-2 pl-5 text-sm">{item.inclusions.map((entry,i)=><li key={i}>{entry}</li>)}</ul>
          {free || active.some(row => row.package_id === item.id) ? <Link className="font-semibold text-primary" href={href}>{free ? "Use free access" : "Package active · Continue"}</Link> : item.price !== null && buyer?.role === role ? <PackageForm action="order" label="One-time PayPal Sandbox checkout"><input type="hidden" name="id" value={item.id}/></PackageForm> : <p className="text-sm text-muted">{item.price === null ? "Checkout opens when a demo price is set." : "Select a demo identity to check out."}</p>}</>}
        </article>;
      })}</div>{!packages.length && <p>No active packages are available.</p>}
      {admin && buyer?.role === "admin" && <LearningEditor packages={packages} space={buyer.space}/>}
      {admin && <section className={card}><h2 className="text-xl font-semibold">Recent test purchases and orders</h2>{!records.length && <p>No test orders yet.</p>}{records.map((r,i)=><p key={i} className="break-words border-t pt-3 text-sm">{r.name} · {r.user_id} · {r.currency} {r.amount} · {r.status} · {r.provider} {r.provider_capture_id}</p>)}</section>}
      {role === "student" && <p className="text-sm">Marketplace access requires completed learning and readiness checks. Placement and employment are not guaranteed.</p>}
      {role === "sme" && <p className="text-sm">Project approval and initiation checks still apply. Student wages are separate. A service package does not authorise unpaid productive work.</p>}
    </div>;
}
