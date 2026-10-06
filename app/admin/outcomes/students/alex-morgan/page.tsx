import type { Metadata } from "next";
import { StudentOutcome } from "@/components/admin/outcomes/student-outcome";
export const metadata: Metadata = { title: "Student Outcome Record | EzraTech" };
export default function StudentOutcomePage() { return <StudentOutcome />; }
