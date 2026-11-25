import Link from "next/link";
import { database } from "@/lib/packages/store";
import { session } from "@/lib/packages/session";
import { DemoIdentityLink, notice } from "./catalogue";
import { PackageForm } from "./forms";
export async function Receipt({ id, cancel }: { id?: string; cancel: boolean }) {
  const buyer = await session();
  const rows = buyer && id && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)
    ? await database()`select o.status,o.provider,o.amount,p.name from ezra_demo.orders o join ezra_demo.packages p on p.id=o.package_id where o.id=${id} and o.user_id=${buyer.user}`.catch(()=>[]) : [];
  const row = rows[0];
  const terminal = ["completed","cancelled","failed"].includes(row?.status);
  const title = row?.status === "completed" ? "Payment Successful (Sandbox)" : row?.status === "cancelled" ? "Payment Cancelled" : row?.status === "failed" ? "Payment Failed" : "Check payment status";
  return <main className="mx-auto my-12 grid w-full max-w-xl gap-5 rounded-xl border border-border bg-white p-8"><p className="text-sm text-muted">{notice}</p><h1 className="text-3xl font-semibold">{title}</h1>
    {row ? <><p>{buyer?.name} · {row.name} · £{row.amount}</p>{row.provider === "presenter-fixture" && <p>Presenter fixture · prerecorded example without a PayPal transaction.</p>}
    {!terminal && <PackageForm action={cancel ? "cancel" : "capture"} label={cancel ? "Confirm cancellation" : "Verify and finish checkout"}><input type="hidden" name="id" value={id}/></PackageForm>}
    <p>Order status · {row.status}</p></> : <p>No matching order for the current demo identity.</p>}
    {buyer ? <Link className="text-primary underline" href={"/"+buyer.role+"/packages"}>Return to packages</Link> : <DemoIdentityLink/>}</main>;
}
