import type { Metadata } from "next";
import { StudentDispute } from "@/components/student/assessment/disputes/student-dispute";
export const metadata: Metadata = { title: "Request Assessment Review | EzraTech" };
export default function Page() { return <StudentDispute />; }
