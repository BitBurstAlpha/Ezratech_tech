import type { Metadata } from "next";
import { SMECandidateList } from "@/components/sme/candidates/candidate-list";
export const metadata: Metadata = { title: "Candidate Matching | EzraTech" };
export default function CandidateMatchingPage() { return <SMECandidateList />; }
