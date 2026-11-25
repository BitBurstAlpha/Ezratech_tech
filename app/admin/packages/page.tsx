import { Catalogue } from "@/components/packages/catalogue";
import { AdminShell } from "@/components/admin/admin-shell";
export default function Page() {
  return <AdminShell activeItem="Packages" title="Prototype Pricing" subtitle="These are configurable demonstration prices."><Catalogue role="admin"/></AdminShell>;
}
