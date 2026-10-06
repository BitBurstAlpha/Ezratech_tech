import { mockCandidates } from "@/components/sme/candidates/candidate-data";
export type AdminMatchingStatus = "no_action" | "included" | "removed" | "evidence_requested";
export const matchingStatusLabels: Record<AdminMatchingStatus, string> = { no_action: "No Action Needed", included: "Included in Shortlist", removed: "Removed from Shortlist", evidence_requested: "Additional Evidence Requested" };
export const matchingActions = { no_action: "No Action Needed", included: "Include in Shortlist", removed: "Remove from Shortlist", evidence_requested: "Request Additional Evidence" };
export const removalReasons = ["Essential skill requirement not met", "Availability mismatch", "Project eligibility issue", "Evidence insufficient", "Project requirement changed", "Other"];
export const evidenceAreas = ["SQL", "Power BI", "Data Analysis", "Communication", "Availability", "Other"];
export type AdminMatchReview = { projectId: string; candidateId: string; systemRecommendation: "relevant"; adminStatus: AdminMatchingStatus; evidenceReviewed: boolean; overrideReason: string | null; notes: string };
export type MatchingAuditEntry = { candidateId: string; previousState: AdminMatchingStatus; newState: AdminMatchingStatus; reason: string; reviewer: string; date: string };
export const mockAdminMatchReviews: Record<string, AdminMatchReview> = Object.fromEntries(mockCandidates.map(candidate => [candidate.id, { projectId: "northstar-sales-analysis", candidateId: candidate.id, systemRecommendation: "relevant", adminStatus: "no_action", evidenceReviewed: false, overrideReason: null, notes: "" }]));
export const mockMatchingAuditLog: MatchingAuditEntry[] = [];
export const mockMatchingCandidates = mockCandidates;
export const mockMatchingProjects = [
  { id: "northstar-sales-analysis", title: "Sales Performance Analysis", company: "Northstar Retail Ltd", category: "Data Analysis", interested: 3, suitable: 3, attention: "None" },
  { id: "customer-feedback-analysis", title: "Customer Feedback Analysis", company: "BrightPath Services Ltd", category: "Research", interested: 5, suitable: 4, attention: "1 manual review required" },
  { id: "marketing-dashboard-prototype", title: "Marketing Dashboard Prototype", company: "Oakwell Digital Ltd", category: "Dashboard / Reporting", interested: 3, suitable: 2, attention: "Missing Power BI evidence" },
];
export const mockMatchingAttention = [
  { title: "Availability Conflict", projectId: "customer-feedback-analysis", project: "Customer Feedback Analysis", issue: "Student availability does not fully meet the required weekly commitment." },
  { title: "Missing Evidence", projectId: "marketing-dashboard-prototype", project: "Marketing Dashboard Prototype", issue: "Power BI is listed in the profile but relevant evidence has not yet been reviewed." },
];
