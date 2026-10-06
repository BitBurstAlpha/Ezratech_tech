import type { Metadata } from "next";
import { SMECandidateDetail } from "@/components/sme/candidates/candidate-detail";
export const metadata: Metadata = { title: "Emma Clarke | Candidate Review | EzraTech" };
export default function CandidateDetailPage() { return <SMECandidateDetail candidateId="emma-clarke" />; }
