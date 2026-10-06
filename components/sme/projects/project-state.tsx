"use client";
import { useSME } from "../sme-state";
import { profileProjectDraft, companyProfileComplete } from "../profile/profile-data";
import { useDemoStoredState } from "@/components/demo/use-demo-stored-state";
import { projectCancelled } from "@/components/projects/closure/closure-data";
import { createContext, useContext, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { mockSMEProjectDraft, type ProjectDraft } from "./project-data";
import { mockProjectReview, transitionProjectReview, type ProjectReview } from "./review-data";
import { adminCheckLabels, mockAdminProjectReview, type AdminCheckKey, type AdminCheckStatus, type AdminReviewStatus } from "@/components/admin/admin-data";
import { defaultProjectReview, type DemoSnapshot } from "@/lib/demo-state";
type ProjectContext = {
  restoreProject: (snapshot: Pick<DemoSnapshot, "review" | "draft">) => void;
  draft: ProjectDraft; updateDraft: (patch: Partial<ProjectDraft>) => void; saveDraft: () => void;
  projectStatus: string; review: ProjectReview; setReview: Dispatch<SetStateAction<ProjectReview>>; adminReviewStatus: AdminReviewStatus;
  adminChecks: Record<AdminCheckKey, AdminCheckStatus>; updateAdminCheck: (key: AdminCheckKey, status: AdminCheckStatus) => void;
  adminNotes: string; setAdminNotes: (notes: string) => void; requestChanges: (categories: string[], text: string) => void;
  approveProject: () => void; rejectProject: (reason: string, explanation: string) => void; rejection: { reason: string; explanation: string } | null;
};
const Context = createContext<ProjectContext | null>(null);
export function SMEProjectProvider({ children }: { children: ReactNode }) {
  const { progress } = useDemoProgress();
  const { profile } = useSME();
  const [draft, setDraft, draftHydrated] = useDemoStoredState<ProjectDraft>("project:draft", () => structuredClone(mockSMEProjectDraft));
  const [review, setReviewState, reviewHydrated] = useDemoStoredState<ProjectReview>("project:review", () => defaultProjectReview());
  const [adminChecks, setAdminChecks, adminChecksHydrated] = useDemoStoredState("project:adminChecks", () => Object.fromEntries(Object.keys(mockAdminProjectReview.checks).map(key => [key, "approved"])) as Record<AdminCheckKey, AdminCheckStatus>);
  const [adminNotes, setAdminNotes, adminNotesHydrated] = useDemoStoredState("project:adminNotes", "Demo project meets the agreed pilot criteria.");
  const [rejection, setRejection, rejectionHydrated] = useDemoStoredState<{ reason: string; explanation: string } | null>("project:rejection", null);
  function restoreProject(snapshot: Pick<DemoSnapshot, "review" | "draft">) {
    setDraft(structuredClone(snapshot.draft)); setReviewState(structuredClone(snapshot.review));
    setAdminChecks(Object.fromEntries(Object.keys(mockAdminProjectReview.checks).map(key => [key, key === "businessProblem" ? "approved" : snapshot.review.checks[key as keyof ProjectReview["checks"]] === "approved" ? "approved" : "clarification"])) as Record<AdminCheckKey, AdminCheckStatus>);
    setAdminNotes(snapshot.review.status === "approved" ? "Demo project meets the agreed pilot criteria." : mockAdminProjectReview.adminNotes); setRejection(null);
  }
  function setReview(action: SetStateAction<ProjectReview>) {
    const next = typeof action === "function" ? action(review) : action;
    setReviewState(next);
    setAdminChecks(current => next.status === "under_review" ? { ...mockAdminProjectReview.checks } : { ...current, ...Object.fromEntries(Object.entries(next.checks).map(([key, status]) => [key, status === "approved" ? "approved" : status === "pending" ? "clarification" : "changes_requested"])), ...(next.status === "approved" ? { businessProblem: "approved" as const } : {}) });
    setRejection(null);
  }
  const adminReviewStatus: AdminReviewStatus = review.status === "under_review" ? "awaiting_review" : review.status === "reviewing_update" ? "resubmitted" : review.status;
  function updateDraft(patch: Partial<ProjectDraft>) {
    if (patch.status === "under-review" && !companyProfileComplete(profile)) return;
    setDraft(current => ({ ...current, ...patch }));
    if (patch.status === "under-review") { setReviewState(structuredClone(mockProjectReview)); setAdminChecks({ ...mockAdminProjectReview.checks }); setRejection(null); }
  }
  function updateAdminCheck(key: AdminCheckKey, status: AdminCheckStatus) {
    setAdminChecks(current => ({ ...current, [key]: status }));
    if (key !== "businessProblem") setReviewState(current => ({ ...current, checks: { ...current.checks, [key]: status === "approved" ? "approved" : "changes_requested" } }));
  }
  function requestChanges(categories: string[], text: string) {
    const keys = Object.entries(adminCheckLabels).filter(([, label]) => categories.includes(label)).map(([key]) => key as AdminCheckKey);
    setAdminChecks(current => ({ ...current, ...Object.fromEntries(keys.map(key => [key, "changes_requested"])) }));
    setReviewState(current => ({ ...current, status: "changes_requested", matchingUnlocked: false, changesRequested: categories.map((title, index) => ({ id: `change-${index}`, title, request: text })), checks: { ...current.checks, ...Object.fromEntries(keys.filter(key => key !== "businessProblem").map(key => [key, "changes_requested"])) }, submittedUpdate: null }));
    setRejection(null);
  }
  function approveProject() { if (!Object.values(adminChecks).every(status => status === "approved")) return; setReviewState(current => transitionProjectReview(current, "approved")); setRejection(null); }
  function rejectProject(reason: string, explanation: string) { setReviewState(current => ({ ...current, status: "rejected", matchingUnlocked: false })); setRejection({ reason, explanation }); }
  const projectStatus = projectCancelled(progress) ? "cancelled" : progress.projectCompletion.smeApproved ? "completed" : progress.monitoring.paused ? "paused" : progress.projectCompletion.changesRequested ? "revision_requested" : progress.setupStarted && progress.applicationStatus === "sme_accepted" ? progress.preStart.workspaceUnlocked ? "active" : "pre_start" : review.status === "under_review" ? "submitted" : review.status === "reviewing_update" ? "resubmitted" : review.status;
  if (!(draftHydrated && reviewHydrated && adminChecksHydrated && adminNotesHydrated && rejectionHydrated)) return null;
  return <Context.Provider value={{ restoreProject, draft: profileProjectDraft(draft, profile), updateDraft, saveDraft: () => setDraft(current => ({ ...current, status: "draft" })), projectStatus, review: projectCancelled(progress) ? { ...review, matchingUnlocked: false } : review, setReview, adminReviewStatus, adminChecks, updateAdminCheck, adminNotes, setAdminNotes, requestChanges, approveProject, rejectProject, rejection }}>{children}</Context.Provider>;
}
export function useSMEProjectDraft() { const context = useContext(Context); if (!context) throw new Error("SME and Admin projects require SMEProjectProvider"); return context; }
