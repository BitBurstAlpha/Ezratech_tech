import type { Metadata } from "next";
import { ProjectMatchingReview } from "@/components/admin/matching/project-matching-review";
export const metadata: Metadata = { title: "Matching Review | EzraTech" };
export default function MatchingReviewPage() { return <ProjectMatchingReview />; }
