import { requireMarketplace } from "@/lib/learning/access";
import type { Metadata } from "next";
import { StudentMatchingPage } from "@/components/student/projects/availability/student-matching-page";
export const metadata: Metadata = { title: "Project Matching Status | EzraTech" };
export default async function NoMatchPage() {
  await requireMarketplace();
 return <StudentMatchingPage />; }
