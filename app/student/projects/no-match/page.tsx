import type { Metadata } from "next";
import { StudentMatchingPage } from "@/components/student/projects/availability/student-matching-page";
export const metadata: Metadata = { title: "Project Matching Status | EzraTech" };
export default function NoMatchPage() { return <StudentMatchingPage />; }
