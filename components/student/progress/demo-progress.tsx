"use client";
import { createContext, useContext, useCallback, type Dispatch, type ReactNode } from "react";
import { learningComplete, completedLearningCount, learningProgress, learningActivityStatus, readinessAccessible, workspaceAccessible, projectsAccessible, progressReducer, type DemoProgress, type ProgressAction } from "./progress-state";
import { useDemoStoredState } from "@/components/demo/use-demo-stored-state";
import { defaultDemoProgress } from "@/lib/demo-state";
const ProgressContext = createContext<{ progress: DemoProgress; dispatch: Dispatch<ProgressAction> } | null>(null);
export function DemoProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress, hydrated] = useDemoStoredState("progress", defaultDemoProgress);
  const dispatch = useCallback((action: ProgressAction) => setProgress(current => progressReducer(current, action)), [setProgress]);
  if (!hydrated) return <p role="status" className="p-5 text-sm text-muted">Restoring demo progress…</p>;
  return <ProgressContext.Provider value={{ progress, dispatch }}>{children}</ProgressContext.Provider>;
}
export function useDemoProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("Student demo progress requires DemoProgressProvider");
  return { ...context, learningComplete: learningComplete(context.progress), projectsUnlocked: projectsAccessible(context.progress), learningPercent: learningProgress(context.progress), learningCompletedCount: completedLearningCount(context.progress), activityStatus: (id: string) => learningActivityStatus(context.progress, id), readinessUnlocked: readinessAccessible(context.progress), workspaceUnlocked: workspaceAccessible(context.progress) };
}
