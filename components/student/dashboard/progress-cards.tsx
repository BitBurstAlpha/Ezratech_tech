"use client";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { DashboardCard, DashboardLink } from "./dashboard-card";
import { developmentConfirmed, assessmentCapabilities, capabilityLevels } from "@/components/student/assessment/development/development-data";
import { projectCancelled } from "@/components/projects/closure/closure-data";
import { newMatchAvailable } from "@/components/student/projects/availability/availability-data";
import { Icon } from "@/components/landing/icon";
export function NextJourneyAction() {
  const { learningComplete, readinessUnlocked, projectsUnlocked, progress } = useDemoProgress();
  const noMatch = projectsUnlocked && progress.matchingAvailability.supply === "no_match";
  const href = noMatch ? "/student/projects/no-match" : projectsUnlocked ? "/student/projects" : learningComplete ? readinessUnlocked ? "/student/readiness" : "/student/reassessment" : "/student/learning-plan";
  const title = noMatch ? newMatchAvailable(progress.matchingAvailability, projectsUnlocked) ? "Review your new project opportunity" : "Project Ready · No Suitable Match Yet" : projectsUnlocked ? "Explore suitable SME projects" : learningComplete ? readinessUnlocked ? "Complete your readiness check" : "Complete your skills reassessment" : "Complete your personalised learning plan";
  return <section className="rounded-xl border border-primary/20 bg-blue-light p-6"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Your next step</p><h2 className="text-xl font-semibold">{title}</h2><p className="my-4 text-sm leading-6 text-muted">{noMatch ? "Your readiness and project access remain unchanged. Review matching availability, preferences and your waitlist status." : projectsUnlocked ? "Browse projects aligned with your skills, availability and career goals." : "Complete your personalised learning plan, reassessment and readiness check to unlock suitable SME project opportunities."}</p><DashboardLink href={href} primary>{projectsUnlocked ? "Explore Projects" : learningComplete ? readinessUnlocked ? "Continue to Readiness Check" : "Start Reassessment" : "Continue Learning"}</DashboardLink></section>;
}
export function LearningProgressCard() {
  const { learningComplete, learningPercent } = useDemoProgress();
  return <DashboardCard title="Your Learning Plan" action={<span className={`text-xs font-semibold ${learningComplete ? "text-green-700" : "text-primary"}`}>{learningComplete ? "Completed" : "In Progress"}</span>}><p className="mb-3 text-sm text-muted">{learningPercent}% complete · 3 recommended activities</p><div role="progressbar" aria-label="Learning progress" aria-valuenow={learningPercent} aria-valuemin={0} aria-valuemax={100} className="mb-5 h-2 overflow-hidden rounded-full bg-section"><div className="h-full bg-primary" style={{width: `${learningPercent}%`}} /></div><DashboardLink href="/student/learning-plan">View Learning Plan</DashboardLink></DashboardCard>;
}
export function ProjectAccessCard() {
  const { projectsUnlocked, progress } = useDemoProgress();
  const state = progress.matchingAvailability;
  const noMatch = projectsUnlocked && state.supply === "no_match";
  const opportunity = newMatchAvailable(state, projectsUnlocked);
  return <><section hidden={!projectCancelled(progress)} className="rounded-xl border border-border bg-white p-5"><h2 className="font-semibold">Sales Performance Analysis · Cancelled</h2><p className="my-3 text-sm text-muted">Project Ready: Still Active · Completed evidence preserved</p><DashboardLink href="/student/projects" primary>Explore New Projects</DashboardLink></section><DashboardCard title="Project Opportunities" action={<span className={`flex items-center gap-1.5 text-xs ${projectsUnlocked ? "text-green-700" : "text-muted"}`}><Icon name={projectsUnlocked ? "check" : "lock"} className="h-4 w-4" />{projectsUnlocked ? "Unlocked" : "Locked"}</span>}><p className="mb-5 text-sm leading-7 text-muted">{noMatch ? opportunity ? "Project Ready · New project opportunity available." : "Project Ready · No Suitable Match Yet. Your project access stays unlocked." : projectsUnlocked ? "Your project opportunities are unlocked. Explore suitable SME projects." : "Complete your personalised learning plan, reassessment and readiness check to unlock suitable SME project opportunities."}</p>{noMatch && <p className="mb-5 text-xs text-muted">Waitlist: {state.waitlistStatus === "active" ? "Active" : "Inactive"} · Preferences: Active</p>}{projectsUnlocked && <DashboardLink href={noMatch ? "/student/projects/no-match" : "/student/projects"} primary>{noMatch ? "View Matching Status" : "Explore Projects"}</DashboardLink>}</DashboardCard></>;
}

export function AssessmentStatusCard() {
  const { progress } = useDemoProgress();
  const confirmed = developmentConfirmed(progress);
  return <DashboardCard title="Assessment Review" action={<span className={`text-xs font-semibold ${confirmed ? "text-green-700" : "text-yellow-800"}`}>{confirmed ? "Development Confirmed" : "Further Development Needed"}</span>}><dl className="space-y-3">{assessmentCapabilities.map(item => <div key={item.key}><dt className="text-sm font-medium">{item.name}</dt><dd className="mt-1 text-xs leading-6 text-muted">{capabilityLevels[progress.assessment.levels[item.key]]}</dd></div>)}</dl>{progress.assessment.humanReviewStatus === "pending" && <p className="mt-4 text-xs text-primary">Awaiting Human Review</p>}<div className="mt-5"><DashboardLink href="/student/assessment/result">View Assessment Result</DashboardLink></div></DashboardCard>;
}
