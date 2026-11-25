import "server-only";
const host = "https://api-m.sandbox.paypal.com";
type Money = { value: string; currency_code: string };
export type ProviderOrder = {
  id: string; status: string; links?: { rel: string; href: string }[];
  purchase_units?: { reference_id: string; amount: Money; payments?: { captures?: { id: string; status: string; amount: Money }[] } }[];
};
export class CaptureDeclined extends Error {}
export async function sandbox() {
  const { PAYPAL_ENV, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
  if (PAYPAL_ENV !== "sandbox" || !PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) throw new Error("Sandbox credentials unavailable");
  const token = await fetch(host + "/v1/oauth2/token", {
    method: "POST", headers: { Authorization: "Basic " + Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials", cache: "no-store", signal: AbortSignal.timeout(8000)
  });
  if (!token.ok) throw new Error("Sandbox authentication unavailable");
  const { access_token } = await token.json();
  return async (path: string, body?: object, key?: string): Promise<ProviderOrder> => {
    const response = await fetch(host + "/v2/checkout/orders" + path, {
      method: body ? "POST" : "GET", cache: "no-store", signal: AbortSignal.timeout(10000),
      headers: { Authorization: "Bearer " + access_token, "Content-Type": "application/json", Prefer: "return=representation", ...(key && { "PayPal-Request-Id": key }) },
      ...(body && { body: JSON.stringify(body) })
    });
    if (!response.ok) {
      const problem = await response.json().catch(() => null);
      if (path.endsWith("/capture") && problem?.details?.some((detail: { issue: string }) =>
        ["INSTRUMENT_DECLINED","TRANSACTION_REFUSED","PAYER_CANNOT_PAY"].includes(detail.issue))) throw new CaptureDeclined();
      throw new Error("Sandbox order request unavailable");
    }
    return response.json();
  };
}
