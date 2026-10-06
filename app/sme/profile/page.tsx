import type { Metadata } from "next";
import { CompanyProfile } from "@/components/sme/profile/company-profile";
export const metadata: Metadata = { title: "Company Profile | EzraTech" };
export default function SMEProfilePage() { return <CompanyProfile />; }
