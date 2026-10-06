import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/landing/icon";
export function DashboardCard({ title, children, className = "", action }: { title: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return <section className={`rounded-xl border border-border bg-white p-6 shadow-[0_2px_8px_rgba(51,52,56,0.025)] ${className}`}><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-base font-semibold tracking-tight">{title}</h2>{action}</div>{children}</section>;
}
export function DashboardLink({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return <Link href={href} prefetch={false} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${primary ? "bg-primary text-white hover:bg-primary-hover" : "border border-border text-primary hover:border-primary/30 hover:bg-blue-light"}`}>{children}<Icon name="arrow" className="h-4 w-4" /></Link>;
}
