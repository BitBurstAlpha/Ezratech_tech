import {
  NextJourneyAction,
  AssessmentStatusCard,
  LearningProgressCard,
  ProjectAccessCard,
} from "@/components/student/dashboard/progress-cards";
import type { Metadata } from "next";
import { Icon } from "@/components/landing/icon";
import {
  DashboardCard,
  DashboardLink,
} from "@/components/student/dashboard/dashboard-card";
import { DashboardShell } from "@/components/student/dashboard/dashboard-shell";
import {
  activities,
  demoSkills,
  demoStudent,
} from "@/components/student/dashboard/demo-data";
import { JourneyCard } from "@/components/student/dashboard/journey-card";
export const metadata: Metadata = {
  title: "Student Dashboard | EzraTech",
  description:
    "Follow your EzraTech journey and take your next step towards real project opportunities.",
};
export default function StudentDashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Career goal <span className="mx-2 text-border">/</span>
          <span className="font-semibold text-ink">
            {demoStudent.careerGoal}
          </span>
        </p>
        <span className="text-xs text-muted">
          Student dashboard · Demo profile
        </span>
      </div>
      <JourneyCard />
      <NextJourneyAction />
      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardCard title="Profile Completion">
          <div className="mb-3 flex items-end justify-between">
            <span className="text-sm text-muted">
              Your profile is taking shape
            </span>
            <span className="text-2xl font-semibold text-primary">{100}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Profile completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={100}
            className="h-2 overflow-hidden rounded-full bg-section"
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${100}%` }}
            />
          </div>
          <ul className="my-5 grid gap-3 sm:grid-cols-2">
            {["Education", "Career Goals", "Experience", "Skills"].map(
              (label) => (
                <li
                  key={label}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>{label}</span>
                  <span className="flex items-center gap-1 text-xs text-green-700">
                    <Icon name="check" className="h-3.5 w-3.5" />
                    Completed
                  </span>
                </li>
              ),
            )}
          </ul>
          <p className="mb-4 text-xs text-muted">
            You can update your profile at any time.
          </p>
          <DashboardLink href="/student/profile">View Profile</DashboardLink>
        </DashboardCard>
        <DashboardCard
          title="Your Skills"
          action={
            <span className="rounded-full bg-section px-2.5 py-1 text-[11px] text-muted">
              Self-reported
            </span>
          }
        >
          <ul className="mb-5 grid gap-3 sm:grid-cols-2">
            {demoSkills.map((skill) => (
              <li
                key={skill}
                className="rounded-lg border border-border px-3.5 py-3"
              >
                <p className="text-sm font-medium">{skill}</p>
                <p className="mt-1 text-xs text-muted">
                  Assessment completed for demo
                </p>
              </li>
            ))}
          </ul>
          <DashboardLink href="/student/skills">View Skills</DashboardLink>
        </DashboardCard>
        <AssessmentStatusCard />
        <LearningProgressCard />
        <ProjectAccessCard />
      </div>
      <DashboardCard title="Recent Activity">
        <ul className="grid gap-4 md:grid-cols-3">
          {activities.map((activity) => (
            <li key={activity} className="flex items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-light text-primary">
                <Icon name="check" className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium">{activity}</p>
                <p className="mt-1 text-xs text-muted">Today</p>
              </div>
            </li>
          ))}
        </ul>
      </DashboardCard>
    </DashboardShell>
  );
}
