import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
export const metadata: Metadata = { title: "Administration | EzraTech" };
export default function AdminDashboardPage() { return <AdminDashboard />; }
