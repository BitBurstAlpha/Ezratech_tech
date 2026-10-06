import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "@/components/landing/brand";
import { Icon } from "@/components/landing/icon";
export const smePrimary = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-muted";
export const smeSecondary = "rounded-lg border border-border bg-white px-5 py-3 text-sm font-semibold text-primary hover:bg-blue-light";
export function SMEShell({ children }: { children: ReactNode }) {
  return <><header className="border-b border-border bg-white"><div className="mx-auto flex min-h-22 max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10"><Brand /><Link href="/get-started" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary"><Icon name="arrow" className="h-4 w-4 rotate-180" />Back to role selection</Link></div></header>{children}</>;
}
export function SMEChoices({ question, name, options, selected, onChange }: { question: string; name: string; options: string[]; selected: string; onChange: (value: string) => void }) {
  return <fieldset><legend className="mb-3 text-sm font-semibold leading-6">{question}</legend><div className="grid gap-3 sm:grid-cols-2">{options.map(option => <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-6 ${selected === option ? "border-primary bg-blue-light text-primary" : "border-border bg-white"}`}><input required type="radio" name={name} value={option} checked={selected === option} onChange={() => onChange(option)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />{option}</label>)}</div></fieldset>;
}
