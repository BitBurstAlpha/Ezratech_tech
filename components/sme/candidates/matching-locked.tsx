import { SMEDashboardShell } from "../dashboard-shell";
import { SMEAction, SMECard } from "../dashboard-ui";
import { CandidatePrototypeNote } from "./candidate-ui";
export function MatchingLocked() {
  return <SMEDashboardShell activeItem="Candidates" title="Candidate Matching" subtitle="Sales Performance Analysis"><SMECard title="Matching Locked"><p className="mb-5 text-sm leading-7 text-muted">This project must complete EzraTech’s human review before matching becomes available. Student visibility is not available while the project is awaiting review or updates.</p><SMEAction href="/sme/projects/northstar-sales-analysis/review">View Project Review</SMEAction></SMECard><CandidatePrototypeNote /></SMEDashboardShell>;
}
