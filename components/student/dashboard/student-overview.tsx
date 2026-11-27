"use client";
import { MotionConfig } from "motion/react";
import { Icon } from "@/components/landing/icon";
import { useDemoControls } from "@/components/demo/demo-controls";
import { ClosureLinks } from "@/components/projects/closure/closure-links";
import { experienceVerified } from "../portfolio/evidence-record-data";
import { useDemoProgress } from "../progress/demo-progress";
import { DashboardShell } from "./dashboard-shell";
import { dashboardProfile, type DashboardStudent } from "./profile-summary";
import { OverviewJourney } from "./overview-journey";
import {
  ActivitySummary,
  LearningSummary,
  SkillsSummary,
} from "./overview-cards";
import { ActionLink, Entrance, panel } from "./overview-motion";

type Step = [title: string, label: string, href: string];
export function StudentOverview({ student, summary }: { student: DashboardStudent; summary?: import("../progress/progress-state").StudentDashboardProfile }) {
  const {
    progress,
    actorRole,
    learningComplete,
    projectsUnlocked,
    workspaceUnlocked,
    readinessUnlocked,
  } = useDemoProgress();
  const { currentDemoScenario } = useDemoControls();
  const { alex, name, careerGoal, skills } = dashboardProfile(
    summary && student ? {...student,name:summary.name} : student,
    summary ?? progress.dashboardProfile,
    !actorRole && currentDemoScenario !== "Default Demo",
  );
  const verified = experienceVerified(progress);
  const completedStages = [
    progress.profileComplete,
    progress.assessmentComplete,
    learningComplete,
    projectsUnlocked,
    progress.projectCompletion.smeApproved,
    verified,
  ];
  const incomplete = completedStages.indexOf(false);
  const current = incomplete === -1 ? completedStages.length - 1 : incomplete;
  const marketplace =
    progress.matchingAvailability.supply === "no_match"
      ? "/student/projects/no-match"
      : "/student/projects";
  let next: Step = [
    "Complete your personalised learning plan",
    "Continue Learning",
    "/student/learning-plan",
  ];
  if (!progress.profileComplete)
    next = [
      "Set up your student profile",
      "Continue Profile",
      "/student/onboarding",
    ];
  else if (verified)
    next = [
      "Review your verified experience",
      "View Portfolio",
      "/student/portfolio",
    ];
  else if (progress.projectCompletion.smeApproved)
    next = [
      "Review your completed SME project",
      "View Portfolio",
      "/student/portfolio",
    ];
  else if (workspaceUnlocked)
    next = [
      "Continue your SME project",
      "Open Workspace",
      "/student/workspace/northstar-sales-analysis",
    ];
  else if (projectsUnlocked)
    next = ["Explore suitable SME projects", "Explore Projects", marketplace];
  else if (progress.projectReady)
    next = [
      "Verify your marketplace access",
      "Select student identity",
      "/demo#payment-demo",
    ];
  else if (!progress.assessmentComplete)
    next = [
      "Complete your skills assessment",
      "Start Assessment",
      "/student/assessment",
    ];
  else if (learningComplete)
    next = readinessUnlocked
      ? [
          "Complete your project readiness check",
          "Check Readiness",
          "/student/readiness",
        ]
      : progress.assessment.reassessment.status === "more_practice"
        ? [
            "Complete your additional practice",
            "Continue Learning",
            "/student/learning-plan",
          ]
        : progress.assessment.reassessment.status === "completed"
          ? [
              "Review your outstanding assessment evidence",
              "View Assessment",
              "/student/assessment/result",
            ]
          : [
              "Complete your skills reassessment",
              "Start Reassessment",
              "/student/reassessment",
            ];
  const prerequisites =
    "Complete your required courses, applicable reassessment and readiness checks to unlock suitable SME projects.";
  return (
    <MotionConfig reducedMotion="user">
      <DashboardShell
        studentName={name}
        studentId={student?.actor === "emma" ? "emma-clarke" : undefined}
        title={
          name === "Student"
            ? "Welcome to your dashboard"
            : `Welcome back, ${name.split(" ")[0]}`
        }
      >
        <Entrance className="flex flex-wrap items-center justify-between gap-2">
          <div className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-dashboard-muted">
            Career goal <span className="mx-1.5 opacity-50">/</span>{" "}
            <strong className="text-sm text-ink">
              {careerGoal || "Not set yet"}
            </strong>
          </div>
          <span className="text-xs text-dashboard-muted">
            Student dashboard · Demo profile
          </span>
        </Entrance>
        <OverviewJourney current={current} completed={completedStages} />
        <Entrance
          order={2}
          className="flex flex-col justify-between gap-4 rounded-2xl border border-dashboard-blue/20 bg-dashboard-soft p-5 shadow-sm md:flex-row md:items-center sm:p-6"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-dashboard-blue">
              Your next step
            </p>
            <h2 className="my-1.5 text-xl font-bold">{next[0]}</h2>
            <p className="text-sm text-dashboard-muted">
              {current <= 3
                ? prerequisites
                : "Follow your project journey and keep track of the experience you build."}
            </p>
          </div>
          <div className="shrink-0">
            <ActionLink href={next[2]} primary>
              {next[1]}
            </ActionLink>
          </div>
        </Entrance>
        <div className="grid gap-6 lg:grid-cols-2">
          <LearningSummary />
          <SkillsSummary skills={skills} />
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <Entrance order={5} className={panel + " lg:col-span-5"}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-bold">Project Opportunities</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecedf6] px-2.5 py-1 text-xs">
                <Icon
                  name={projectsUnlocked ? "check" : "lock"}
                  className="size-3.5"
                />
                {projectsUnlocked ? "Unlocked" : "Locked"}
              </span>
            </div>
            <p className="text-sm text-dashboard-muted">
              {projectsUnlocked
                ? "Review your matching status and explore approved project opportunities."
                : progress.projectReady
                  ? "Select a student identity to verify your marketplace access."
                  : prerequisites}
            </p>
            {projectsUnlocked && (
              <div className="mt-4">
                <ActionLink href={marketplace}>View opportunities</ActionLink>
              </div>
            )}
          </Entrance>
          <ActivitySummary />
        </div>
        {alex && <ClosureLinks role="student" />}
      </DashboardShell>
    </MotionConfig>
  );
}
