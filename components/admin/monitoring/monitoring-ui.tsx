import type { ReactNode } from "react";
export function MonitoringBadge({ children }: { children: ReactNode }) {
  const text = String(children);
  const style = ["On Track", "Resolved", "resolved", "Completed"].includes(text) ? "bg-green-50 text-green-700" : ["Paused", "Escalated", "escalated"].includes(text) ? "bg-red-50 text-red-700" : ["Needs Attention", "Open", "open", "Awaiting SME Response"].includes(text) ? "bg-yellow-50 text-yellow-800" : text === "Upcoming" ? "bg-section text-muted" : "bg-blue-light text-primary";
  return <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${style}`}>{children}</span>;
}
export function MonitoringPrototypeNote() { return <footer className="text-xs leading-6 text-muted"><span className="font-semibold">Prototype Demo</span> · Project monitoring, issues, interventions and escalation shown here use simulated data. State lasts until the page is refreshed.</footer>; }
