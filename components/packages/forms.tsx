"use client";
import { useState, type ReactNode } from "react";
import { demoStorageKey } from "@/lib/demo-storage";
import { useRouter } from "next/navigation";

export const button = "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50";
export async function postPackage(action: string, data: FormData) {
  const response = await fetch("/api/packages/" + action, { method: "POST", body: data });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}
export function PackageForm({ action, label, children }: { action: string; label: string; children?: ReactNode }) {
  const router = useRouter();
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  return <form className="grid gap-3" onSubmit={async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      const result = await postPackage(action,data);
      if (result.scope) {
        const previousScope = localStorage.getItem("ezra-workflow-scope");
        const originalJourney = localStorage.getItem(demoStorageKey);
        const destination = demoStorageKey + ":" + result.scope;
        if (!previousScope && data.get("mode") === "resume" && !result.scope.includes("/") && originalJourney && !localStorage.getItem(destination)) {
          localStorage.setItem(destination, originalJourney);
        }
        localStorage.setItem("ezra-workflow-scope",result.scope);
      }
      if (result.url) { location.assign(result.url); return; }
      setMessage(result.message ?? "Order checked.");
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please retry."); }
    setBusy(false);
  }}>{children}<button className={button + " justify-self-start"} disabled={busy}>{busy ? "Please wait…" : label}</button>{message && <p role="status" className="text-sm">{message}</p>}</form>;
}
export function PresenterControls() {
  const [actor,setActor] = useState("alex");
  return <section id="payment-demo" className="space-y-4 rounded-xl border border-border bg-white p-6"><h2 className="text-xl font-semibold">Sandbox Payment Demo</h2>
    <p className="text-sm text-muted">Choose a fictional buyer to test checkout. Fresh scenarios start an isolated payment history. Purchased and cancelled examples use labelled presenter fixtures.</p>
    <PackageForm action="session" label="Load payment scenario">
      <label>Presenter key <input required name="key" type="password" autoComplete="off" className="rounded border p-2" /></label>
      <label>Identity <select className="rounded border p-2" name="actor" value={actor} onChange={e=>setActor(e.target.value)}>
        {Object.entries({alex:"Alex Morgan",emma:"Emma Clarke",northstar:"Northstar Retail",willow:"Willow Studio",admin:"Package administrator"}).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
      <label>Scenario <select key={actor} name="mode" className="rounded border p-2"><option value="resume">Open identity in current demo</option>{actor !== "admin" && <><option value="empty">Fresh buyer without purchase · try Sandbox checkout</option><option value="purchased">Completed test purchase fixture</option><option value="cancelled">Cancelled payment fixture</option></>}</select></label>
    </PackageForm></section>;
}
