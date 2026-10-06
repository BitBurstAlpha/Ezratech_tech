"use client";
import { mockSMESupportMessages, smeSupportId } from "../messages/conversation-data";
import type { SharedMessage } from "@/components/student/messages/message-data";
import { createContext, useContext, type ReactNode } from "react";
import { useDemoStoredState } from "@/components/demo/use-demo-stored-state";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { mockSMEWorkspaces, updateWorkspace, workspaceCounts, workspaceList, type ManagedWorkspace, type WorkspaceAction } from "./workspace-manager-data";
const Context = createContext<{ supportMessages: SharedMessage[]; sendSupport: (text: string, author: string) => void; records: Record<string, ManagedWorkspace>; dispatch: (action: WorkspaceAction) => void; reset: () => void } | null>(null);
export function SMEWorkspaceManagerProvider({ children }: { children: ReactNode }) {
  const [records, setRecords, hydrated] = useDemoStoredState("sme:workspaces", () => structuredClone(mockSMEWorkspaces), { objectMap: true });
  const [supportMessages, setSupport, supportHydrated] = useDemoStoredState("sme:support-messages", () => structuredClone(mockSMESupportMessages));
  if (!hydrated || !supportHydrated) return null;
  return <Context.Provider value={{ supportMessages, sendSupport: (text, author) => { if (!text.trim()) return; setSupport(current => [...current, { id: Math.max(0, ...current.map(message => message.id)) + 1, conversationId: smeSupportId, author, senderId: "sarah-collins", senderRole: "sme", text: text.trim(), timestamp: "Now", attachment: null, status: "sent" }]); }, records, dispatch: action => setRecords(current => updateWorkspace(current, action)), reset: () => { setRecords(structuredClone(mockSMEWorkspaces)); setSupport(structuredClone(mockSMESupportMessages)); } }}>{children}</Context.Provider>;
}
export function useSMEWorkspaces() {
  const context = useContext(Context);
  const { progress } = useDemoProgress();
  if (!context) throw new Error("SME workspaces require SMEWorkspaceManagerProvider");
  const workspaces = workspaceList(context.records, progress);
  return { ...context, workspaces, counts: workspaceCounts(workspaces) };
}
