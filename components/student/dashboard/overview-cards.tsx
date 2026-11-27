"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Icon } from "@/components/landing/icon";
import {
  developmentActivities,
  mockAssessmentState,
} from "../assessment/development/development-data";
import { useDemoProgress } from "../progress/demo-progress";
import { ActionLink, Entrance, Fill, panel } from "./overview-motion";

export function LearningSummary() {
  const {
    progress,
    learningPercent,
    learningCompletedCount,
    learningComplete,
    activityStatus,
  } = useDemoProgress();
  const courses = progress.assessmentComplete
    ? (progress.assignedCourses ?? developmentActivities)
    : [];
  const percent = courses.length ? learningPercent : 0;
  return (
    <Entrance order={3} className={panel + " flex flex-col gap-3"}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-bold">Your Learning Plan</h2>
        {courses.length > 0 && (
          <span className="rounded-full bg-dashboard-soft px-3 py-1 text-xs text-dashboard-blue">
            {learningComplete ? "Completed" : "In progress"}
          </span>
        )}
      </div>
      {courses.length ? (
        <>
          <p className="text-xs text-dashboard-muted">
            {percent}% complete · {learningCompletedCount} of {courses.length}{" "}
            required courses
          </p>
          <div
            role="progressbar"
            aria-label="Required course completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="h-2 overflow-hidden rounded-full bg-[#ecedf6]"
          >
            <Fill value={percent} />
          </div>
          <ul className="space-y-2">
            {courses.map((c) => {
              const state = activityStatus(c.id);
              const locked =
                progress.assignedCourses?.find((row) => row.id === c.id)
                  ?.accessible === false;
              return (
                <li key={c.id}>
                  <Link
                    prefetch={false}
                    href={`/student/learning-plan#course-${encodeURIComponent(c.id)}`}
                    className="flex items-center gap-2.5 rounded-xl bg-[#f5f6fb] p-3 text-sm hover:bg-dashboard-soft"
                  >
                    <Icon
                      className="size-4 shrink-0 text-dashboard-blue"
                      name={
                        state === "completed"
                          ? "check"
                          : locked
                            ? "lock"
                            : "learning"
                      }
                    />
                    <span className="flex-1 font-medium">{c.title}</span>
                    <span className="text-xs text-dashboard-muted">
                      {state === "completed"
                        ? "Completed"
                        : state === "in_progress"
                          ? "In progress"
                          : locked
                            ? "Package required"
                            : c.duration}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="text-sm text-dashboard-muted">
          {progress.assessmentComplete
            ? "No courses assigned yet."
            : "Complete your skills assessment to see your assigned courses."}
        </p>
      )}
      <div className="mt-auto pt-2">
        <ActionLink href="/student/learning-plan">
          View Learning Plan
        </ActionLink>
      </div>
    </Entrance>
  );
}
export function SkillsSummary({ skills }: { skills: string[] }) {
  return (
    <Entrance order={4} className={panel + " flex flex-col gap-4"}>
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Your Skills</h2>
        <span className="text-xs text-dashboard-muted">Self-reported</span>
      </div>
      {skills.length ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {skills.map((skill) => (
            <motion.li
              key={skill}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-3 rounded-xl border border-dashboard-line p-3"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-dashboard-soft text-dashboard-blue">
                <Icon name="assessment" className="size-4" />
              </span>
              <div className="min-w-0">
                <strong className="break-words text-sm">{skill}</strong>
                <p className="text-xs text-dashboard-muted">
                  Self-reported skill
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-dashboard-muted">
          Your self-reported skills will appear here when you complete your
          profile.
        </p>
      )}
      <div className="mt-auto">
        <ActionLink href="/student/profile?section=skills">
          View Skills
        </ActionLink>
      </div>
    </Entrance>
  );
}
export function ActivitySummary() {
  const { progress } = useDemoProgress();
  // The initial demo assessment log contains illustration text even before assessment.
  const reviewEvents = progress.assessment.log.filter(
    (e) =>
      !mockAssessmentState.log.some(
        (seed) => e.text === seed.text && e.date === seed.date,
      ),
  );
  const events = [
    ...(progress.projectClosure?.history ?? [])
      .slice()
      .reverse()
      .map((text) => ({ text, date: "" })),
    ...reviewEvents.reverse(),
    ...progress.completedActivities
      .slice()
      .reverse()
      .flatMap((id) => {
        const course = (progress.assignedCourses ?? developmentActivities).find(
          (item) => item.id === id,
        );
        return course ? [{ text: course.title + " completed", date: "" }] : [];
      }),
  ].slice(0, 3);
  if (events.length < 3 && progress.assessmentComplete)
    events.push({ text: "Skills assessment completed", date: "" });
  if (events.length < 3 && progress.profileComplete)
    events.push({ text: "Student profile completed", date: "" });
  return (
    <Entrance order={6} className={panel + " lg:col-span-7"}>
      <h2 className="mb-4 font-bold">Recent Activity</h2>
      {events.length ? (
        <ul className="grid gap-4 sm:grid-cols-3">
          {events.map((e, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-dashboard-soft text-dashboard-blue">
                <Icon name="clock" className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium">{e.text}</p>
                {e.date && (
                  <p className="text-xs text-dashboard-muted">{e.date}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-dashboard-muted">
          No activity recorded yet.
        </p>
      )}
    </Entrance>
  );
}
