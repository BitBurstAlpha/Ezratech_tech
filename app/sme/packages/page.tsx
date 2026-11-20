import { Catalogue } from "@/components/packages/catalogue";
import { SMEDashboardShell } from "@/components/sme/dashboard-shell";
export default function Page() {
  return <SMEDashboardShell activeItem="Packages" title="SME Project Packages" subtitle="Proposed one-time packages for the project demo."><Catalogue role="sme"/></SMEDashboardShell>;
}
