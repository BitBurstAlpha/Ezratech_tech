import { hasLearningPackage } from "@/lib/learning/package-access";
import Link from "next/link";
import type { ReactNode } from "react";
import { session } from "@/lib/packages/session";
import { owns } from "@/lib/packages/store";
import { SMEDashboardShell } from "@/components/sme/dashboard-shell";
export async function packageAccess(role: "student" | "sme") {
  const buyer = await session();
  const allowed = buyer?.role === role && await (role === "student" ? hasLearningPackage(buyer.user) : owns(buyer.user, "project")).catch(()=>false);
  return { allowed, name: buyer?.role === role ? buyer.name : undefined };
}
export async function SMEPackageGate({ children }: { children: ReactNode }) {
  const { allowed } = await packageAccess("sme");
  if (allowed) return children;
  return <SMEDashboardShell title="SME Project Package required" subtitle="Choose a demo package to continue with project delivery."><Link href="/sme/packages" className="text-primary underline">View SME Project Packages</Link></SMEDashboardShell>;
}
