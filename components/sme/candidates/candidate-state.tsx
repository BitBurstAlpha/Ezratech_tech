"use client";
import { useDemoStoredState } from "@/components/demo/use-demo-stored-state";
import { createContext, useContext, type ReactNode } from "react";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { mockAdminMatchReviews, mockMatchingAuditLog, type AdminMatchReview, type AdminMatchingStatus, type MatchingAuditEntry } from "@/components/admin/matching/matching-data";
import { mockCandidateDecision, mockCandidates, type CandidateDecision } from "./candidate-data";
type CandidateState = { resetCandidates: () => void; adminReviews: Record<string, AdminMatchReview>; auditLog: MatchingAuditEntry[]; reviewMatch: (id: string, status: AdminMatchingStatus, reason: string, notes: string) => void; markMatchEvidenceReviewed: (id: string) => void; decisions: Record<string, CandidateDecision>; setNotes: (id: string, notes: string) => void; decide: (id: string, decision: "accepted" | "declined", reason?: string) => void };
const Context = createContext<CandidateState | null>(null);
export function SMECandidateProvider({ children }: { children: ReactNode }) {
  const { progress, dispatch, projectsUnlocked } = useDemoProgress();
  const [records, setDecisions, recordsHydrated] = useDemoStoredState<Record<string, CandidateDecision>>("candidate:records", () => Object.fromEntries(mockCandidates.map(candidate => [candidate.id, { ...mockCandidateDecision, candidateId: candidate.id }])));
  const [adminReviews, setAdminReviews, adminReviewsHydrated] = useDemoStoredState("candidate:adminReviews", () => ({ ...mockAdminMatchReviews }));
  const [auditLog, setAuditLog, auditLogHydrated] = useDemoStoredState<MatchingAuditEntry[]>("candidate:auditLog", () => [...mockMatchingAuditLog]);
  function resetCandidates() {
    setDecisions(Object.fromEntries(mockCandidates.map(candidate => [candidate.id, { ...structuredClone(mockCandidateDecision), candidateId: candidate.id }])));
    setAdminReviews(structuredClone(mockAdminMatchReviews)); setAuditLog(structuredClone(mockMatchingAuditLog));
  }
  function markMatchEvidenceReviewed(id: string) { setAdminReviews(current => ({ ...current, [id]: { ...current[id], evidenceReviewed: true } })); }
  function reviewMatch(id: string, status: AdminMatchingStatus, reason: string, notes: string) {
    if (["cancelled", "partial_review", "closed"].includes(progress.cancellation.status)) return;
    const previous = adminReviews[id];
    if (!previous || (status !== "no_action" && !reason.trim())) return;
    setAdminReviews(current => ({ ...current, [id]: { ...current[id], adminStatus: status, overrideReason: reason.trim() || null, notes } }));
    setAuditLog(current => [...current, { candidateId: id, previousState: previous.adminStatus, newState: status, reason: reason.trim() || "No action needed after review", reviewer: "EzraTech Admin", date: "Today" }]);
  }
  function setNotes(id: string, notes: string) { setDecisions(current => ({ ...current, [id]: { ...current[id], notes } })); }
  function decide(id: string, decision: "accepted" | "declined", reason = "") {
    if (id === "alex-morgan" && (!projectsUnlocked || !progress.interestSubmitted)) return;
    if (["cancelled", "partial_review", "closed"].includes(progress.cancellation.status)) return;
    if (id === "alex-morgan" && progress.applicationStatus === "closed" && records[id].smeDecision !== "declined") return;
    if (adminReviews[id]?.adminStatus === "removed" || adminReviews[id]?.adminStatus === "evidence_requested") return;
    if (id === "alex-morgan") dispatch({ type: decision === "accepted" ? "smeAcceptCandidate" : "declineApplication" });
    setDecisions(current => ({ ...current, [id]: { ...current[id], candidateDecision: decision, smeDecision: decision, smeReviewStatus: decision === "accepted" ? "accepted" : "not_selected", declineReason: decision === "declined" ? reason : "", studentConfirmation: false, preStartComplete: false, workspaceUnlocked: false } }));
  }
  const alexDecision: CandidateDecision["smeDecision"] = progress.applicationStatus === "sme_accepted" ? "accepted" : progress.applicationStatus === "closed" && records["alex-morgan"].smeDecision === "declined" ? "declined" : null;
  const decisions = { ...records, "alex-morgan": { ...records["alex-morgan"], studentInterest: progress.interestSubmitted, candidateDecision: alexDecision, smeDecision: alexDecision, smeReviewStatus: alexDecision === "accepted" ? "accepted" as const : alexDecision === "declined" ? "not_selected" as const : progress.applicationStatus === "closed" ? "withdrawn" as const : "reviewing" as const, studentConfirmation: progress.preStart.studentConfirmed, preStartComplete: progress.preStart.workspaceUnlocked, workspaceUnlocked: progress.preStart.workspaceUnlocked } };
  if (!(recordsHydrated && adminReviewsHydrated && auditLogHydrated)) return null;
  return <Context.Provider value={{ resetCandidates, decisions, setNotes, decide, adminReviews, auditLog, reviewMatch, markMatchEvidenceReviewed }}>{children}</Context.Provider>;
}
export function useSMECandidates() { const context = useContext(Context); if (!context) throw new Error("SME candidate pages require SMECandidateProvider"); return context; }
