"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { workflowKey, readDemoStateField, saveDemoStateField } from "@/lib/demo-storage";
const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
export function useDemoStoredState<T>(field: string, initial: T | (() => T), options?: { objectMap?: boolean; syncTabs?: boolean }) {
  // Restore once on client mount. The server renders only the restoration placeholder,
  // so neither stale defaults nor consumer effects can overwrite saved progress during hydration.
  const [state, setState] = useState<T>(() => {
    const fallback = typeof initial === "function" ? (initial as () => T)() : initial;
    try { return typeof window === "undefined" ? fallback : readDemoStateField(window.localStorage, field, fallback, options); }
    catch { return fallback; }
  });
  const hydrated = useSyncExternalStore(subscribe, clientReady, serverReady);
  const remoteState = useRef<T | undefined>(undefined);
  const syncTabs = options?.syncTabs;
  const objectMap = options?.objectMap;
  useEffect(() => {
    if (!hydrated || !syncTabs) return;
    function restore(event: StorageEvent) {
      if (event.key === "ezra-workflow-scope") { window.location.reload(); return; }
      if (event.key !== workflowKey(window.localStorage) || event.storageArea !== window.localStorage) return;
      try {
        const before = JSON.parse(event.oldValue ?? "{}")?.[field];
        const after = JSON.parse(event.newValue ?? "{}")?.[field];
        if (JSON.stringify(before) === JSON.stringify(after)) return;
        const fallback = typeof initial === "function" ? (initial as () => T)() : initial;
        const latest = readDemoStateField(window.localStorage, field, fallback, { objectMap });
        remoteState.current = latest;
        setState(latest);
      } catch { /* A malformed external value must not replace the current session. */ }
    }
    window.addEventListener("storage", restore);
    return () => window.removeEventListener("storage", restore);
  }, [field, hydrated, initial, objectMap, syncTabs]);
  useEffect(() => {
    if (!hydrated) return;
    if (remoteState.current === state) return;
    try { saveDemoStateField(window.localStorage, field, state); } catch { /* Retain shared in-memory progress when storage is unavailable. */ }
  }, [field, hydrated, state]);
  return [state, setState, hydrated] as const;
}
