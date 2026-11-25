"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { PackageForm } from "./forms";

type SandboxSdk = {
  createInstance(options: { clientId: string; components: string[]; pageType: string }): Promise<{
    findEligibleMethods(options: { currencyCode: string }): Promise<{ isEligible(method: string): boolean }>;
  }>;
};

export function SandboxPayment({ id, clientId }: { id: string; clientId?: string }) {
  const [ready, setReady] = useState(false);
  const [guestCard, setGuestCard] = useState(false);
  useEffect(() => {
    if (!ready || !clientId) return;
    let active = true;
    const sdk = (window as Window & { paypal?: SandboxSdk }).paypal;
    async function check(sandboxClientId: string) {
      const instance = await sdk?.createInstance({
        clientId: sandboxClientId, components: ["paypal-guest-payments"], pageType: "checkout",
      });
      const methods = await instance?.findEligibleMethods({ currencyCode: "GBP" });
      if (active) setGuestCard(methods?.isEligible("card") === true);
    }
    void check(clientId).catch(() => { if (active) setGuestCard(false); });
    return () => { active = false; };
  }, [ready, clientId]);
  return <>
    {clientId && <Script src="https://www.sandbox.paypal.com/web-sdk/v6/core" onReady={() => setReady(true)}/>}
    {guestCard && <PackageForm action="order" label="Pay with Test Card">
      <input type="hidden" name="id" value={id}/><input type="hidden" name="method" value="guest-card"/>
    </PackageForm>}
    <PackageForm action="order" label="Pay with PayPal Sandbox"><input type="hidden" name="id" value={id}/></PackageForm>
  </>;
}
