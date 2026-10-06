// One prototype-owned record shared by the existing state providers, never page-specific keys.
export const demoStorageKey = "ezratech-demo:shared-state:v1";
export type DemoStorage = Pick<Storage, "getItem" | "setItem">;
function record(storage: DemoStorage): Record<string, unknown> {
  try { const parsed: unknown = JSON.parse(storage.getItem(demoStorageKey) ?? "{}"); return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {}; } catch { return {}; }
}
export function readDemoStateField<T>(storage: DemoStorage, field: string, fallback: T, options?: { objectMap?: boolean }): T {
  const value = record(storage)[field];
  if (value === undefined) return fallback;
  if (fallback === null) return value as T;
  if (Array.isArray(fallback)) return Array.isArray(value) ? value as T : fallback;
  if (typeof fallback === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
    const saved = value as Record<string, unknown>;
    if (options?.objectMap) return Object.values(saved).every(item => item && typeof item === "object" && !Array.isArray(item)) ? saved as T : fallback;
    // Ignore incompatible or incomplete records from older versions rather than erasing live progress.
    if (Object.entries(fallback as Record<string, unknown>).some(([key, original]) => original !== null && (Array.isArray(original) ? !Array.isArray(saved[key]) : typeof saved[key] !== typeof original))) return fallback;
    return { ...fallback, ...saved };
  }
  return typeof value === typeof fallback ? value as T : fallback;
}
export function saveDemoStateField<T>(storage: DemoStorage, field: string, value: T) {
  storage.setItem(demoStorageKey, JSON.stringify({ ...record(storage), [field]: value }));
}
