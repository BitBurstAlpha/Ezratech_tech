import type { Metadata } from "next";
import { SMEProjectReviewFlow } from "@/components/sme/projects/project-review-flow";
export const metadata: Metadata = { title: "Project Review | EzraTech" };
export default function SMEProjectReviewPage() { return <SMEProjectReviewFlow />; }
