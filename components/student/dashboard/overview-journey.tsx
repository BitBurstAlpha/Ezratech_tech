"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon, type IconName } from "@/components/landing/icon";
import { Entrance, Fill, panel } from "./overview-motion";

const stages: { label: string; icon: IconName; detail: string }[] = [
  {
    label: "Profile",
    icon: "user",
    detail:
      "Add your background, career goals and skills to your student profile.",
  },
  {
    label: "Assessment",
    icon: "assessment",
    detail:
      "Your skills assessment identifies the learning you need for project work.",
  },
  {
    label: "Learning",
    icon: "learning",
    detail: "Complete the required courses in your personalised learning plan.",
  },
  {
    label: "Project Ready",
    icon: "verified",
    detail:
      "Finish the applicable reassessment and readiness checks before accessing projects.",
  },
  {
    label: "SME Project",
    icon: "project",
    detail:
      "Match with an SME and complete mutual confirmations before the workspace opens.",
  },
  {
    label: "Verified Experience",
    icon: "verified",
    detail:
      "Reviewed project evidence can become verified experience in your portfolio.",
  },
];
export function OverviewJourney({
  current,
  completed,
}: {
  current: number;
  completed: boolean[];
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const selected = choice ?? current;
  const percent = Math.round((current / (stages.length - 1)) * 100);
  const status = (i: number) =>
    completed[i] ? "Completed" : i === current ? "Current" : "Locked";
  return (
    <Entrance order={1} className={panel}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">Your EzraTech Journey</h2>
          <p className="mt-1 text-xs text-dashboard-muted">
            Step {current + 1} of 6 · Select a milestone to inspect your
            progress
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
          {stages[current].label}
        </span>
      </div>
      <div className="relative mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <div
          aria-hidden
          className="absolute inset-x-[8.33%] top-6 hidden h-0.5 bg-[#e1e2ea] lg:block"
        >
          <Fill value={percent} />
        </div>
        {stages.map(({ label, icon }, i) => (
          <motion.button
            whileHover={reduced ? undefined : { y: -1 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.18 }}
            key={label}
            type="button"
            aria-pressed={selected === i}
            aria-controls="milestone-detail"
            aria-current={i === current ? "step" : undefined}
            onClick={() => setChoice(i)}
            className="relative isolate flex flex-col items-center gap-1 rounded-xl px-1 pb-2 text-center"
          >
            {i === selected && (
              <motion.span
                aria-hidden
                layoutId="dashboard-selected-stage"
                className="absolute inset-0 -z-10 rounded-xl bg-dashboard-soft/70 ring-1 ring-inset ring-dashboard-blue/15"
                transition={{ duration: reduced ? 0 : 0.2 }}
              />
            )}
            <span
              className={`relative grid size-12 place-items-center rounded-full border-4 border-white ${status(i) === "Completed" ? "bg-green-100 text-green-700" : i === current ? "bg-[#0a66c2] text-white" : "bg-[#ecedf6] text-[#727783]"}`}
            >
              <Icon
                name={
                  status(i) === "Completed"
                    ? "check"
                    : i === current
                      ? icon
                      : "lock"
                }
                className="size-5"
              />
            </span>
            <span className="text-sm font-semibold">{label}</span>
            <span
              className={`text-xs ${completed[i] ? "text-green-700" : i === current ? "text-dashboard-blue" : "text-dashboard-muted"}`}
            >
              {status(i)}
            </span>
          </motion.button>
        ))}
      </div>
      <div
        id="milestone-detail"
        aria-live="polite"
        className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-dashboard-line pt-4 text-xs"
      >
        <motion.p
          key={selected}
          initial={reduced ? false : { opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="text-dashboard-muted"
        >
          <strong className="text-dashboard-ink">
            {stages[selected].label} · {status(selected)}.{" "}
          </strong>
          {stages[selected].detail}
        </motion.p>
        <span className="tabular-nums font-semibold text-dashboard-blue">
          {percent}% Journey
        </span>
      </div>
    </Entrance>
  );
}
