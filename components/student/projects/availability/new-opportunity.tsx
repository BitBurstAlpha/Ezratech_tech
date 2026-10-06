"use client";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { mockUpcomingProject, newMatchAvailable } from "./availability-data";
import { MatchingNotice, MatchingPrototypeNote, SkillChips } from "./availability-ui";
import { SMECard, SMEAction, SMEDetail } from "@/components/sme/dashboard-ui";
export function NewOpportunity() {
  const { progress, projectsUnlocked } = useDemoProgress();
  if (!newMatchAvailable(progress.matchingAvailability, projectsUnlocked)) return <MatchingNotice title="Project Not Available"><p>This project is awaiting Admin approval. It is not yet available for matching.</p><div className="mt-4"><SMEAction href="/student/projects/no-match">Return to Matching Status</SMEAction></div></MatchingNotice>;
  return <div className="space-y-6"><SMECard title={mockUpcomingProject.title}><p className="mb-5 text-sm text-muted">{mockUpcomingProject.company} · Approved demo opportunity</p><p className="mb-5 text-sm leading-7 text-muted">Review anonymised sales data and develop a bounded retail reporting dashboard, supported by a weekly supervisor check-in.</p><dl className="mb-5 grid gap-5 sm:grid-cols-3"><SMEDetail label="Duration">{mockUpcomingProject.duration}</SMEDetail><SMEDetail label="Weekly Commitment">{mockUpcomingProject.availability}</SMEDetail><SMEDetail label="Working Style">{mockUpcomingProject.workingStyle}</SMEDetail></dl><SkillChips skills={mockUpcomingProject.skills} /></SMECard><MatchingNotice title="Demo Project Preview">This new opportunity demonstrates project availability after approval. Applications for this additional mock project are outside this prototype screen.</MatchingNotice><SMEAction href="/student/projects/no-match">Return to Matching Status</SMEAction><MatchingPrototypeNote /></div>;
}
