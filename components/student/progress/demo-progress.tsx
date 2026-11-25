"use client";
import { createContext, useContext, useCallback, useState, useRef, type ReactNode } from "react";
import { learningComplete, completedLearningCount, learningProgress, learningActivityStatus, readinessAccessible, workspaceAccessible, projectsAccessible, progressReducer, type DemoProgress, type ProgressAction } from "./progress-state";
import { useDemoStoredState } from "@/components/demo/use-demo-stored-state";
import { defaultDemoProgress, type DemoScenarioId } from "@/lib/demo-state";
import { loadLearningFixture, recordLearning } from "@/lib/learning/actions";
import { studentLearningActions, reviewerActions, type LearningRecord } from "@/lib/learning/record";
import type { ReadinessAnswers } from "@/components/student/readiness/readiness-data";
import { postPackage } from "@/components/packages/forms";

type Role = "student" | "sme" | "admin";
type Save = (action: ProgressAction, answers?: ReadinessAnswers) => Promise<boolean>;
const ProgressContext = createContext<{ progress: DemoProgress; dispatch: Save; restoreLearning: (id: DemoScenarioId | "reset", key: string) => Promise<boolean>; actorRole?: Role } | null>(null);

export function DemoProgressProvider({ children, actorRole, initialLearning }: {
  children: ReactNode; actorRole?: Role; initialLearning: LearningRecord | null;
}) {
  const [local, setProgress, hydrated] = useDemoStoredState("progress", defaultDemoProgress, { syncTabs: true });
  const [record, setRecord] = useState(initialLearning);
  const latest = useRef(initialLearning);
  const [error, setError] = useState("");
  const pending = useRef(Promise.resolve(true));
  const progress = { ...local, ...record };
  progress.projectReady = projectsAccessible(progress);
  progress.projectAccessUnlocked = progress.projectReady;

  const dispatch: Save = useCallback((action, answers) => {
    const applyLocal = (saved?: LearningRecord) => {
      const before = latest.current;
      if (saved) {
        latest.current = saved;
        setRecord(saved);
      }
      setProgress(current => {
        const base = { ...current, ...before };
        base.projectReady = projectsAccessible(base);
        base.projectAccessUnlocked = base.projectReady;
        const next = { ...progressReducer(base, action), ...saved };
        next.projectReady = projectsAccessible(next);
        next.projectAccessUnlocked = next.projectReady;
        return next;
      });
      return true;
    };
    const controlled = studentLearningActions.includes(action.type) || reviewerActions.includes(action.type);
    if (!controlled || (!actorRole && action.type !== "submitInterest")) return Promise.resolve(applyLocal());
    const save = async () => {
      try {
        let saved: LearningRecord;
        if ((action.type === "startActivity" || action.type === "completeActivity") && action.id === "planning") {
          const data = new FormData();
          data.set("id", action.id);
          data.set("status", action.type === "startActivity" ? "started" : "completed");
          saved = (await postPackage("activity", data)).record;
        } else {
          saved = await recordLearning(action, answers);
        }
        setError("");
        return applyLocal(saved);
      } catch {
        setError("Progress could not be saved. Check your demo identity and course access, then try again.");
        return false;
      }
    };
    pending.current = pending.current.then(save);
    return pending.current;
  }, [actorRole, setProgress]);
  async function restoreLearning(id: DemoScenarioId | "reset", key: string) {
    if (!actorRole) return true;
    try {
      await pending.current;
      const fixture = await loadLearningFixture(id, key);
      latest.current = fixture;
      setRecord(fixture);
      setError("");
      return true;
    } catch {
      setError("Enter the private presenter key to load a scenario for this demo identity.");
      return false;
    }
  }
  if (!hydrated) return <p role="status" className="p-5 text-sm text-muted">Restoring demo progress…</p>;
  return <ProgressContext.Provider value={{ progress, dispatch, actorRole, restoreLearning }}>{error && <p role="alert" className="p-4">{error}</p>}{children}</ProgressContext.Provider>;
}
export function useDemoProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("Student demo progress requires DemoProgressProvider");
  return { ...context, learningComplete: learningComplete(context.progress), projectsUnlocked: context.actorRole === "student" && projectsAccessible(context.progress), learningPercent: learningProgress(context.progress), learningCompletedCount: completedLearningCount(context.progress), activityStatus: (id: string) => learningActivityStatus(context.progress, id), readinessUnlocked: readinessAccessible(context.progress), workspaceUnlocked: workspaceAccessible(context.progress) };
}
