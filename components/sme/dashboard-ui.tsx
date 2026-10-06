import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/landing/icon";
import type { SMEProjectStatus } from "./dashboard-data";

export function SMECard({ title, children, action, id, className = "" }: { title: string; children: ReactNode; action?: ReactNode; id?: string; className?: string }) {
  return <section id={id} className={`rounded-xl border border-border bg-white p-5 shadow-[0_2px_8px_rgba(51,52,56,0.025)] sm:p-6 ${className}`}><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-base font-semibold tracking-tight">{title}</h2>{action}</div>{children}</section>;
}
export function SMEAction({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return <Link href={href} prefetch={false} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${primary ? "bg-primary text-white hover:bg-primary-hover" : "border border-border bg-white text-primary hover:bg-blue-light"}`}>{children}<Icon name="arrow" className="h-4 w-4 shrink-0" /></Link>;
}
const statusStyles: Record<SMEProjectStatus, string> = {
  Paused: "bg-red-50 text-red-700", "Pre-Start": "bg-blue-light text-primary", Draft: "bg-section text-muted", Submitted: "bg-blue-light text-primary",
  "Under EzraTech Review": "bg-blue-light text-primary", "Changes Requested": "bg-amber-50 text-amber-800",
  Approved: "bg-green-50 text-green-700", Matching: "bg-blue-light text-primary",
  Active: "bg-green-50 text-green-700", Completed: "bg-green-50 text-green-700", Cancelled: "bg-section text-muted",
};
export function SMEStatusBadge({ status }: { status: SMEProjectStatus }) {
  return <span className={`inline-flex h-fit shrink-0 self-start items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>{status}</span>;
}
export function SMEEmptyState({ title = "No Active Projects", description = "When a project begins, you will be able to track progress and communicate with the student here.", actionLabel = "Create Project", href = "/sme/projects/new" }: { title?: string; description?: string; actionLabel?: string; href?: string }) {
  return <div className="rounded-lg border border-dashed border-border bg-section p-6 text-center"><Icon name="project" className="mx-auto mb-3 h-7 w-7 text-primary" /><h3 className="font-semibold">{title}</h3><p className="mx-auto mb-5 mt-2 max-w-md text-sm leading-6 text-muted">{description}</p><SMEAction href={href}>{actionLabel}</SMEAction></div>;
}
export function SMEDetail({ label, children }: { label: string; children: ReactNode }) {
  return <div><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 text-sm font-medium">{children}</dd></div>;
}
