"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import { dashboardProfile } from "@/components/student/dashboard/profile-summary";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import {
  initial,
  issue,
  multiple,
  preview,
  tabs,
  type Profile,
  type Tab,
  type Row,
} from "@/lib/student-profile/model";
import styles from "./profile.module.css";
import { PrivacySettings } from "./privacy-settings";
import { saveProfile } from "./actions";
import { RecordFields, card, button, control } from "./profile-fields";

const enter = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};
const headings: Partial<Record<Tab, string>> = {
  Overview: "Personal Information",
  Education: "Education Details",
  Skills: "Professional Skills",
  Experience: "Work Experience",
  Achievements: "Certifications & Achievements",
  "Documents & Links": "Professional Links",
  "Project Preferences": "Project Interests & Availability",
};
export function ProfileEditor({
  student,
  saved,
  unavailable,
  skillsTab,
}: {
  student: { name: string; actor: string; user: string } | null;
  saved: { profile: Profile; version: number } | null;
  unavailable: boolean;
  skillsTab: boolean;
}) {
  const { progress, projectsUnlocked } = useDemoProgress();
  const summary = dashboardProfile(
    student,
    student ? progress.dashboardProfile : undefined,
    false,
  );
  const seed =
    saved?.profile ?? initial(summary.name, summary.careerGoal, summary.skills);
  const [draft, setDraft] = useState<Profile | null>(null);
  const [baseline, setBaseline] = useState<Profile | null>(
    saved?.profile ?? null,
  );
  const profile = draft ?? baseline ?? seed;
  const dirty =
    !!draft && JSON.stringify(draft) !== JSON.stringify(baseline ?? seed);
  const [version, setVersion] = useState(saved?.version ?? 0);
  const [tab, setTab] = useState<Tab>(skillsTab ? "Skills" : "Overview");
  const [view, setView] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(
    null,
  );
  const [remove, setRemove] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (remove !== null) dialog.current?.showModal();
  }, [remove]);
  useEffect(() => {
    if (!notice || notice.error) return;
    const timer = setTimeout(() => setNotice(null), 5500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (!dirty) return;
    function unload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    function leave(e: MouseEvent) {
      const a = e.target instanceof Element && e.target.closest("a[href]");
      if (
        a &&
        !e.ctrlKey &&
        !e.metaKey &&
        !window.confirm("Leave and discard unsaved profile changes?")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    const navigation = (window as Window & { navigation?: EventTarget })
      .navigation;
    function traverse(event: Event) {
      if (
        (event as Event & { navigationType?: string }).navigationType ===
          "traverse" &&
        event.cancelable &&
        !window.confirm("Leave and discard unsaved profile changes?")
      )
        event.preventDefault();
    }
    navigation?.addEventListener("navigate", traverse);
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", leave, true);
    return () => {
      navigation?.removeEventListener("navigate", traverse);
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", leave, true);
    };
  }, [dirty]);
  function rows(next: Row[]) {
    setDraft({ ...profile, sections: { ...profile.sections, [tab]: next } });
  }
  async function save() {
    if (busy || !student) return;
    const invalid = issue(profile);
    if (invalid) {
      setNotice({ text: invalid, error: true });
      return;
    }
    setBusy(true);
    try {
      const result = await saveProfile(profile, version, student.user);
      if (result.version === undefined) {
        setNotice({ text: result.error ?? "Save failed.", error: true });
        return;
      }
      setVersion(result.version);
      setBaseline(profile);
      setDraft(null);
      setNotice({ text: "Profile changes saved.", error: false });
    } catch {
      setNotice({
        text: "Save failed. Your changes are still available here.",
        error: true,
      });
    } finally {
      setBusy(false);
    }
  }
  const overview = profile.sections.Overview[0],
    name = overview["Full name"] || "Student";
  const visible = view ? preview(profile) : profile.sections;
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.24 }}>
      <DashboardShell
        title="My Profile"
        subtitle="Manage your academic background, skills, career goals, and SME sharing preferences."
        activePath="/student/profile"
        studentName={name}
      >
        <motion.div {...enter} className="space-y-6 text-[#191c21]">
          <section
            className={
              card + " flex flex-wrap items-center justify-between gap-5"
            }
          >
            {visible && (
              <div className="flex min-w-0 items-center gap-4">
                <span
                  aria-hidden
                  className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-blue-200 bg-[#edf5fc] text-xl font-bold text-[#004e99]"
                >
                  {name
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold">{name}</h2>
                    <span className="rounded-full bg-[#edf5fc] px-2.5 py-1 text-xs text-[#004e99]">
                      {profile.sharing &&
                      profile.visibility === "Approved SMEs & Mentors"
                        ? "SME sharing enabled"
                        : "Private profile"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {[
                      overview["Professional headline"] ||
                        profile.sections["Career Goals"][0]["Target role"],
                      profile.sections.Education[0]?.Qualification,
                      overview.City,
                      overview.Country,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs font-semibold text-[#004e99]">
                    <Link href="/student/assessment">
                      Skills Assessment
                      {progress.assessmentComplete ? " · Completed" : ""}
                    </Link>
                    <Link href="/student/learning-plan">Learning Plan</Link>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                className={button}
                aria-pressed={view}
                onClick={() => setView(!view)}
              >
                {view ? "Return to Edit Mode" : "Preview Profile"}
              </button>
              {!view && (
                <button
                  disabled={busy || !student || unavailable}
                  onClick={save}
                  className="rounded-xl bg-[#004e99] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {busy ? "Saving…" : "Save Changes"}
                </button>
              )}
            </div>
          </section>
          {(!student || unavailable) && (
            <p role="status" className="rounded-xl bg-amber-50 p-4">
              {student
                ? "Profile storage is unavailable. Reload when the database is ready."
                : "Select a student identity in the Demo Control Centre to save a profile."}
            </p>
          )}
          {view && (
            <p
              role="status"
              className="rounded-xl bg-[#edf5fc] p-4 text-[#004e99]"
            >
              {visible
                ? "SME preview · Profile visible to an authorised matched SME"
                : "SME preview · Your privacy settings hide this profile from SMEs."}
            </p>
          )}
          {visible && (
            <>
              <div
                role="tablist"
                aria-label="Student profile sections"
                className={card + " flex flex-wrap gap-1 !p-2"}
              >
                {tabs.map((t, i) => (
                  <button
                    key={t}
                    role="tab"
                    id={"profile-tab-" + i}
                    aria-selected={tab === t}
                    aria-controls="profile-panel"
                    tabIndex={tab === t ? 0 : -1}
                    className="relative rounded-xl px-3 py-2 text-sm"
                    onClick={() => setTab(t)}
                    onKeyDown={(e) => {
                      const next = (
                        {
                          ArrowRight: (i + 1) % 8,
                          ArrowLeft: (i + 7) % 8,
                          Home: 0,
                          End: 7,
                        } as Record<string, number>
                      )[e.key];
                      if (next !== undefined) {
                        e.preventDefault();
                        setTab(tabs[next]);
                        document.getElementById("profile-tab-" + next)?.focus();
                      }
                    }}
                  >
                    {tab === t && (
                      <motion.span
                        layoutId="active-profile-tab"
                        className="absolute inset-0 rounded-xl bg-[#edf5fc]"
                      />
                    )}
                    <span className="relative">{t}</span>
                  </button>
                ))}
              </div>
              <motion.section
                {...enter}
                key={tab + view}
                id="profile-panel"
                role="tabpanel"
                aria-labelledby={"profile-tab-" + tabs.indexOf(tab)}
                className={
                  "grid items-start gap-6 " +
                  (tab === "Overview" && !view ? "lg:grid-cols-[2fr_1fr]" : "")
                }
              >
                <fieldset
                  disabled={busy}
                  className={card + " min-w-0 space-y-4"}
                >
                  <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <h3 className="font-bold">{headings[tab] ?? tab}</h3>
                    {!view && multiple.has(tab) && (
                      <button
                        className={button}
                        onClick={() => rows([...visible[tab], {}])}
                      >
                        Add record
                      </button>
                    )}
                  </header>
                  {tab === "Skills" && (
                    <p className="text-sm text-slate-600">
                      Self-reported skills. Assessed capabilities appear in
                      Skills Assessment.
                    </p>
                  )}
                  {tab === "Project Preferences" && (
                    <p className="text-sm">
                      SME projects · {projectsUnlocked ? "Unlocked" : "Locked"}
                    </p>
                  )}
                  {!visible[tab].length && (
                    <p className="text-sm text-slate-600">No records added.</p>
                  )}
                  <AnimatePresence initial={false}>
                    {visible[tab].map((row, i) => (
                      <motion.div
                        {...enter}
                        key={i}
                        className={
                          multiple.has(tab)
                            ? "space-y-3 rounded-xl border border-slate-200 p-4"
                            : ""
                        }
                      >
                        {view ? (
                          <dl className="grid gap-3 sm:grid-cols-2">
                            {Object.entries(row)
                              .filter(([, v]) => v)
                              .map(([k, v]) => (
                                <div key={k}>
                                  <dt className="text-xs text-slate-600">
                                    {k}
                                  </dt>
                                  <dd className="whitespace-pre-wrap break-words">
                                    {v}
                                  </dd>
                                </div>
                              ))}
                          </dl>
                        ) : (
                          <>
                            <RecordFields
                              tab={tab}
                              row={row}
                              update={(k, v) =>
                                rows(
                                  visible[tab].map((r, j) =>
                                    i === j ? { ...r, [k]: v } : r,
                                  ),
                                )
                              }
                            />
                            {multiple.has(tab) && (
                              <button
                                className="text-sm text-red-800 underline"
                                onClick={() => setRemove(i)}
                              >
                                Remove record
                              </button>
                            )}
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {tab === "Skills" &&
                    (view ? (
                      <p>{profile.languages}</p>
                    ) : (
                      <label className="block text-xs">
                        Languages spoken
                        <input
                          className={control}
                          value={profile.languages}
                          onChange={(e) =>
                            setDraft({ ...profile, languages: e.target.value })
                          }
                        />
                      </label>
                    ))}
                  {!view &&
                    ["Achievements", "Documents & Links"].includes(tab) && (
                      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm">
                        CV and supporting file uploads are unavailable until
                        secure storage is configured.
                      </p>
                    )}
                </fieldset>
                {tab === "Overview" && !view && (
                  <PrivacySettings
                    busy={busy}
                    profile={profile}
                    setDraft={setDraft}
                  />
                )}
              </motion.section>
            </>
          )}
          <dialog
            ref={dialog}
            aria-labelledby="remove-record-title"
            onClose={() => setRemove(null)}
            className={styles.confirm+" fixed m-auto rounded-2xl p-6 shadow-lg backdrop:bg-black/30"}
          >
            <motion.div key={String(remove)} {...enter}>
              <h3 id="remove-record-title" className="font-bold">
                Remove this record?
              </h3>
              <p className="my-3 text-sm">
                Save Changes will apply the deletion.
              </p>
              <div className="flex gap-2">
                <button
                  autoFocus
                  className={button}
                  onClick={() => dialog.current?.close()}
                >
                  Cancel
                </button>
                <button
                  className={button}
                  onClick={() => {
                    rows(profile.sections[tab].filter((_, i) => i !== remove));
                    dialog.current?.close();
                  }}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </dialog>
          <AnimatePresence>
            {notice && (
              <motion.div
                {...enter}
                role={notice.error ? "alert" : "status"}
                className={
                  "fixed right-4 top-4 z-50 max-w-[90vw] rounded-xl border bg-white p-4 shadow-lg " +
                  (notice.error ? "text-red-800" : "text-green-800")
                }
              >
                {notice.text}
                <button
                  className="ml-4 underline"
                  onClick={() => setNotice(null)}
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DashboardShell>
    </MotionConfig>
  );
}
