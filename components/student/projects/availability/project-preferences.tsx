"use client";
import { useState } from "react";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { WorkspaceDialog, primaryButton, secondaryButton } from "@/components/student/workspace/workspace-ui";
import { ProjectSelect, ProjectMultiSelect } from "@/components/sme/projects/project-fields";
import type { MatchingPreferences } from "./availability-data";
function PreferencesDialog({ onClose }: { onClose: () => void }) {
  const { progress, dispatch } = useDemoProgress();
  const [preferences, setPreferences] = useState<MatchingPreferences>(progress.matchingAvailability.preferences);
  function update(key: keyof MatchingPreferences, value: string | string[]) { setPreferences(current => ({ ...current, [key]: value })); }
  return <WorkspaceDialog title="Update Project Preferences" onClose={onClose}><form className="space-y-5" onSubmit={event => { event.preventDefault(); if (!preferences.projectAreas.length) return; dispatch({ type: "saveMatchingPreferences", preferences }); onClose(); }}><p className="text-sm leading-7 text-muted">Record changes to your circumstances. Your project readiness stays unchanged; essential project requirements still apply.</p><ProjectSelect label="Weekly Availability" value={preferences.availability} options={[...new Set([preferences.availability, "3–5 hours/week", "6–8 hours/week", "9–12 hours/week"])]} onChange={value => update("availability", value)} /><ProjectSelect label="Preferred Duration" value={preferences.duration} options={[...new Set([preferences.duration, "2–4 weeks", "4–6 weeks", "6–8 weeks"])]} onChange={value => update("duration", value)} /><ProjectSelect label="Working Style" value={preferences.workingStyle} options={[...new Set([preferences.workingStyle, "Remote / Hybrid", "Remote", "Hybrid", "On-site", "Flexible"])]} onChange={value => update("workingStyle", value)} /><ProjectMultiSelect label="Project Areas" value={preferences.projectAreas} options={[...new Set([...preferences.projectAreas, "Data Analysis", "Dashboard / Reporting", "Business Analysis", "Research", "Marketing"])]} onChange={value => update("projectAreas", value)} /><p className="text-xs text-muted">Preferences are saved for this demo session. Matching is simulated.</p><div className="flex gap-3"><button type="button" className={secondaryButton} onClick={onClose}>Cancel</button><button type="submit" disabled={!preferences.projectAreas.length} className={primaryButton}>Save Preferences</button></div></form></WorkspaceDialog>;
}
export function ProjectPreferencesEditor() {
  const { progress } = useDemoProgress();
  const [open, setOpen] = useState(false);
  const preferences = progress.matchingAvailability.preferences;
  return <section className="rounded-xl border border-border bg-white p-6"><h2 className="font-semibold">Current Project Preferences</h2><p className="my-4 text-sm leading-7 text-muted">{preferences.availability} · {preferences.duration} · {preferences.workingStyle}<br />{preferences.projectAreas.join(" · ")}</p><button type="button" className={secondaryButton} onClick={() => setOpen(true)}>Update Preferences</button>{open && <PreferencesDialog onClose={() => setOpen(false)} />}</section>;
}
