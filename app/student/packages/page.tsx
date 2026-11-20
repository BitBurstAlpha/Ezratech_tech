import { Catalogue } from "@/components/packages/catalogue";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { session } from "@/lib/packages/session";
export default async function Page() {
  const buyer = await session();
  return <DashboardShell studentName={buyer?.role === "student" ? buyer.name : undefined} activePath="/student/packages" title="Learning & Participation Packages" subtitle="Choose access for your personalised learning plan."><Catalogue role="student"/></DashboardShell>;
}
