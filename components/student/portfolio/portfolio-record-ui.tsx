import type { ReactNode } from "react";
export function RecordDetails({ items }: { items: { label: string; value: ReactNode }[] }) {
  return <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(item => <div key={item.label}><dt className="text-xs text-muted">{item.label}</dt><dd className="mt-2 text-sm font-medium leading-6">{item.value}</dd></div>)}</dl>;
}
export function EvidenceBadge({ children }: { children: ReactNode }) { return <span className="inline-flex rounded-full bg-blue-light px-3 py-1 text-xs font-semibold text-primary">{children}</span>; }
export function PortfolioNote() { return <p className="text-xs leading-6 text-muted"><span className="font-semibold">Prototype Demo</span> · Portfolio records, feedback and verification shown here use simulated data.</p>; }
