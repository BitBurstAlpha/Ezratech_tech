import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/landing/brand";
import { Icon } from "@/components/landing/icon";

import { AdminDemoLogin } from "@/components/demo/admin-demo-login";

export const metadata: Metadata = { title: "Admin Login | EzraTech" };

export default function AdminLoginPage() {
  return <main className="flex min-h-screen items-center justify-center bg-section px-5 py-10">
    <section className="w-full max-w-md rounded-2xl border border-border bg-white p-7 shadow-sm sm:p-10">
      <Brand />
      <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-light px-3 py-1.5 text-xs font-semibold text-primary"><Icon name="verified" className="h-4 w-4" />Admin Demo Access</div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">EzraTech Admin Login</h1>
      <p className="mt-3 text-sm leading-7 text-muted">Enter the administration demo to review projects, assess evidence and explore the delivery workflow.</p>
      <AdminDemoLogin />
      <Link href="/" className="mt-4 block rounded-lg py-2 text-center text-sm font-medium text-muted hover:text-primary">Return to EzraTech</Link>
      <p className="mt-7 border-t border-border pt-5 text-xs leading-6 text-muted"><span className="font-semibold">Prototype Demo</span> · Admin access and workflow activity use simulated data.</p>
    </section>
  </main>;
}
