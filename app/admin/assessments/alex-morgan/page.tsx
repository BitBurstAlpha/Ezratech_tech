import type { Metadata } from "next";
import { AdminAssessmentReview } from "@/components/admin/assessments/assessment-review";
export const metadata: Metadata = { title: "Assessment Review | EzraTech" };
export default function AssessmentReviewPage() { return <AdminAssessmentReview />; }
