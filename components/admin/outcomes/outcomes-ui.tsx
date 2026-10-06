import Link from "next/link";
import type { ReactNode } from "react";
import { AdminShell } from "../admin-shell";
import { SMECard } from "@/components/sme/dashboard-ui";
import { outcomeRoutes } from "./outcomes-data";

export function OutcomesShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <AdminShell activeItem="Reports" title={title} subtitle={subtitle}><nav aria-label="Report tabs" className="flex border-b border-border"><Link href={outcomeRoutes.dashboard} prefetch={false} aria-current="page" className="border-b-2 border-primary px-4 pb-3 text-sm font-semibold text-primary">Outcomes</Link></nav><div className="rounded-lg border border-primary/15 bg-blue-light px-4 py-3 text-xs leading-6 text-muted"><span className="mr-2 font-semibold text-primary">Prototype Demo</span>All pilot outcomes, follow-up records and reporting figures shown here are simulated.</div>{children}</AdminShell>;
}
export function OutcomeBadge({ children }: { children: string }) {
  const color = /Cancelled|Serious Open/.test(children) ? "bg-red-50 text-red-700" : /Pending|Needs Improvement|Development/.test(children) ? "bg-amber-50 text-amber-800" : /Completed|Complete|Confirmed|Verified|Useful|Yes|Updated/.test(children) ? "bg-green-50 text-green-700" : /Not Due|Not Started|Not yet|Unavailable/.test(children) ? "bg-section text-muted" : "bg-blue-light text-primary";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${color}`}>{children}</span>;
}
export function MetricSection({ title, items, note }: { title: string; items: { label: string; value: number | string; tone?: "green" | "yellow" | "red" }[]; note?: string }) {
  return <SMECard title={title}><dl className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{items.map(item => <div key={item.label} className="rounded-lg border border-border bg-section/60 p-4"><dt className="text-xs leading-5 text-muted">{item.label}</dt><dd className={`mt-3 text-xl font-semibold ${item.tone === "green" ? "text-green-700" : item.tone === "yellow" ? "text-amber-800" : item.tone === "red" ? "text-red-700" : "text-primary"}`}>{item.value}</dd></div>)}</dl>{note && <p className="mt-5 text-xs leading-6 text-muted">{note}</p>}</SMECard>;
}
export function RecordFields({ items }: { items: [string, ReactNode][] }) { return <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(([label, value]) => <div key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 text-sm font-medium">{value}</dd></div>)}</dl>; }
export function FollowUpSchedule({ name, completed, day30, day90 }: { name: string; completed: boolean; day30: boolean; day90: boolean }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-section text-xs"><tr>{["Student", "Project Completion", "30-Day Follow-Up", "90-Day Follow-Up", "6-Month Follow-Up"].map(label => <th scope="col" key={label} className="p-3 font-semibold">{label}</th>)}</tr></thead><tbody><tr className="border-b border-border"><th scope="row" className="p-3 font-medium">{name}</th>{[completed ? "Complete" : "Pending", day30 ? "Complete" : completed ? "Pending" : "Not Due", day90 ? "Complete" : completed ? "Pending" : "Not Due", "Not Due"].map((status, index) => <td key={index} className="p-3"><OutcomeBadge>{status}</OutcomeBadge></td>)}</tr></tbody></table></div>;
}
