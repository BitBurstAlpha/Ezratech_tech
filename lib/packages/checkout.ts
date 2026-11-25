import "server-only";
import type { TransactionSql } from "postgres";
import { database } from "./store";
import { CaptureDeclined, sandbox, type ProviderOrder } from "./paypal";

type Order = { id: string; user_id: string; package_id: string; amount: string; currency: string; status: string; provider: string; provider_order_id: string | null };
export class CheckoutNotice extends Error {}
type Buyer = { user: string; role: string };
export async function startCheckout(buyer: Buyer, id: string, origin: string, guestCard = false) {
  const sql = database();
  const [order] = await sql<Order[]>`
    insert into ezra_demo.orders(user_id,package_id,provider,amount,currency)
    select ${buyer.user},id,'paypal-sandbox',price,currency from ezra_demo.packages
    where id=${id} and audience=${buyer.role} and active and price>0
    and not exists(select 1 from ezra_demo.entitlements where user_id=${buyer.user} and package_id=${id})
    on conflict(user_id,package_id) where status in ('pending','approved') do update set status=ezra_demo.orders.status
    returning *`;
  if (!order) throw new CheckoutNotice("This package is unavailable or already active.");
  return sql.begin(async tx => {
    const [locked] = await tx<Order[]>`select * from ezra_demo.orders where id=${order.id} for update`;
    if (!["pending","approved"].includes(locked.status) || await ownsWithin(tx,buyer.user,id)) throw new CheckoutNotice("Refresh your package status.");
    const [quote] = await tx`select price,active from ezra_demo.packages where id=${id}`;
    if (!quote.active || quote.price !== locked.amount) {
      if (locked.provider_order_id) return origin + "/checkout/cancel?order=" + locked.id;
      await tx`update ezra_demo.orders set status='cancelled' where id=${locked.id}`;
      return origin + "/"+buyer.role+"/packages";
    }
    const api = await sandbox();
    const remote = locked.provider_order_id ? await api("/" + locked.provider_order_id) : await api("", {
      intent: "CAPTURE", purchase_units: [{ reference_id: locked.id, amount: { currency_code: locked.currency, value: locked.amount } }],
      payment_source: { paypal: { experience_context: { ...(guestCard && { landing_page: "GUEST_CHECKOUT" }), shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW",
        return_url: origin + "/checkout/success?order=" + locked.id, cancel_url: origin + "/checkout/cancel?order=" + locked.id } } }
    }, locked.id);
    await tx`update ezra_demo.orders set provider_order_id=${remote.id} where id=${locked.id}`;
    if (["APPROVED","COMPLETED","VOIDED"].includes(remote.status)) return origin + "/checkout/success?order=" + locked.id;
    const link = remote.links?.find(item => ["payer-action","approve"].includes(item.rel))?.href;
    if (!link || new URL(link).origin !== "https://www.sandbox.paypal.com") throw new Error("Missing Sandbox approval link");
    return link;
  });
}
async function ownsWithin(tx: TransactionSql, user: string, id: string) {
  return (await tx`select 1 from ezra_demo.entitlements where user_id=${user} and package_id=${id}`).length > 0;
}
async function record(tx: TransactionSql, order: Order, capture: string) {
  const [purchase] = await tx`insert into ezra_demo.purchases(order_id,user_id,package_id,provider_capture_id)
    values(${order.id},${order.user_id},${order.package_id},${capture}) returning id`;
  await tx`insert into ezra_demo.entitlements(user_id,package_id,purchase_id) values(${order.user_id},${order.package_id},${purchase.id})`;
  await tx`update ezra_demo.orders set status='completed' where id=${order.id}`;
}
export function verifiedCapture(remote: ProviderOrder, order: Order) {
  const units = remote.purchase_units;
  const captures = units?.[0]?.payments?.captures;
  const capture = captures?.[0];
  if (remote.id !== order.provider_order_id || units?.length !== 1 || units[0].reference_id !== order.id ||
    units[0].amount.currency_code !== order.currency || Number(units[0].amount.value) !== Number(order.amount)) throw new Error("Order mismatch");
  if (capture && (captures?.length !== 1 || capture.amount.currency_code !== order.currency || Number(capture.amount.value) !== Number(order.amount))) throw new Error("Capture mismatch");
  return capture;
}
export async function settle(user: string, id: string, cancel: boolean) {
  return database().begin(async tx => {
    const [order] = await tx<Order[]>`select * from ezra_demo.orders where id=${id} and user_id=${user} for update`;
    if (!order) throw new CheckoutNotice("Select an order belonging to this demo identity.");
    if (["completed","failed","cancelled"].includes(order.status)) return order.status;
    if (!order.provider_order_id || order.provider !== "paypal-sandbox") throw new Error("Order unavailable");
    const api = await sandbox();
    const path = "/" + order.provider_order_id;
    let remote = await api(path);
    let capture = verifiedCapture(remote,order);
    let declined = false;
    if (!cancel && remote.status === "APPROVED" && !capture) {
      try { await api(path + "/capture", {}, order.id + "-c"); }
      catch (error) { declined = error instanceof CaptureDeclined; }
      remote = await api(path);
      capture = verifiedCapture(remote,order);
    }
    if (remote.status === "COMPLETED" && capture?.status === "COMPLETED" && capture.id) {
      await record(tx,order,capture.id);
      return "completed";
    }
    const failed = declined || remote.status === "VOIDED" || ["DECLINED","DENIED","FAILED","REFUNDED","REVERSED"].includes(capture?.status ?? "");
    const status = failed ? "failed" : cancel && !capture ? "cancelled" : remote.status === "APPROVED" ? "approved" : "pending";
    await tx`update ezra_demo.orders set status=${status} where id=${id}`;
    return status;
  });
}
// Presenter-only, fresh namespace. Fixture IDs can never be mistaken for PayPal captures.
export async function fixture(user: string, role: string, completed: boolean) {
  const pkg = role === "student" ? "learning" : "project";
  return database().begin(async tx => {
    const [order] = await tx<Order[]>`insert into ezra_demo.orders(user_id,package_id,amount,currency,provider,status)
      select ${user},id,coalesce(price,0),currency,'presenter-fixture',${completed ? "pending" : "cancelled"} from ezra_demo.packages where id=${pkg} returning *`;
    if (completed) await record(tx,order,"fixture-" + order.id);
    return order.id;
  });
}
