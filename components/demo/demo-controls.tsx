"use client";
import { useSMEWorkspaces } from "@/components/sme/workspace/workspace-manager-state";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { useSME } from "@/components/sme/sme-state";
import { useSMEProjectDraft } from "@/components/sme/projects/project-state";
import { useSMECandidates } from "@/components/sme/candidates/candidate-state";
import { clearEzraTechDemoStorage, defaultDemoSnapshot, loadDemoScenario as createScenario, demoScenarios, type DemoScenarioId, type DemoSnapshot } from "@/lib/demo-state";
import { useDemoStoredState } from "./use-demo-stored-state";
import { DemoMenu } from "./demo-menu";
function useControlsValue() {
  const { reset: resetWorkspaces, workspaces } = useSMEWorkspaces();
  const { progress, dispatch } = useDemoProgress();
  const { profile, onboarding, resetSME } = useSME();
  const project = useSMEProjectDraft();
  const candidates = useSMECandidates();
  const [currentDemoScenario, setScenario] = useDemoStoredState("session:scenario", "Default Demo");
  const [presentationMode, setPresentationMode] = useDemoStoredState("session:presentation", false);
  const [developerControls, setDeveloperControls] = useDemoStoredState("session:developer", true);
  const [checklist, setChecklist] = useDemoStoredState<string[]>("session:checklist", []);
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState("");
  function clearStorage() { try { clearEzraTechDemoStorage(window.localStorage); } catch { setNotice("Browser storage is unavailable. Shared in-memory demo data was still restored."); } }
  function applySnapshot(snapshot: DemoSnapshot) {
    dispatch({ type: "replaceDemoProgress", progress: snapshot.progress });
    project.restoreProject(snapshot); resetWorkspaces(); resetSME(snapshot.smeOnboarded); candidates.resetCandidates(); setRevision(value => value + 1);
  }
  function resetEzraTechDemo() { clearStorage(); applySnapshot(defaultDemoSnapshot()); setScenario("Default Demo"); setChecklist([]); }
  function loadDemoScenario(id: DemoScenarioId) { applySnapshot(createScenario(id)); setScenario(demoScenarios.find(item => item.id === id)!.title); }
  function startJourney(role: "student" | "sme" | "admin" | "full") {
    // Journey navigation preserves progress. Only explicit reset or scenario loading replaces it.
    setScenario(role === "full" ? "Full EzraTech Journey" : `${role[0].toUpperCase()}${role.slice(1)} Journey`);
  }
  function getDemoState() { return { currentDemoScenario, progress, workspaces, sme: { profile, onboarding }, project: { draft: project.draft, review: project.review, adminChecks: project.adminChecks }, matching: { decisions: candidates.decisions, adminReviews: candidates.adminReviews, auditLog: candidates.auditLog } }; }
  return { currentDemoScenario, presentationMode, setPresentationMode, developerControls, setDeveloperControls, checklist, setChecklist, revision, notice, resetEzraTechDemo, loadDemoScenario, startJourney, getDemoState };
}
type Controls = ReturnType<typeof useControlsValue>;
const Context = createContext<Controls | null>(null);
export function DemoControlsProvider({ children }: { children: ReactNode }) {

  const controls = useControlsValue();
  return <Context.Provider value={controls}><DemoMenu /><div key={controls.revision} className="contents">{children}</div></Context.Provider>;
}
export function useDemoControls() { const context = useContext(Context); if (!context) throw new Error("Demo controls require DemoControlsProvider"); return context; }
