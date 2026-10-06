"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { readDemoStateField, saveDemoStateField } from "@/lib/demo-storage";
const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
export function useDemoStoredState<T>(field: string, initial: T | (() => T), options?: { objectMap?: boolean }) {
  // Restore once on client mount. The server renders only the restoration placeholder,
  // so neither stale defaults nor consumer effects can overwrite saved progress during hydration.
  const [state, setState] = useState<T>(() => {
    const fallback = typeof initial === "function" ? (initial as () => T)() : initial;
    try { return typeof window === "undefined" ? fallback : readDemoStateField(window.localStorage, field, fallback, options); }
    catch { return fallback; }
  });
  const hydrated = useSyncExternalStore(subscribe, clientReady, serverReady);
  useEffect(() => {
    if (!hydrated) return;
    try { saveDemoStateField(window.localStorage, field, state); } catch { /* Retain shared in-memory progress when storage is unavailable. */ }
  }, [field, hydrated, state]);
  return [state, setState, hydrated] as const;
}
