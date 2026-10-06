import { Icon } from "@/components/landing/icon";
import type { ProjectReviewStatus } from "./review-data";
type JourneyState = "Completed" | "Current" | "Pending" | "Locked";
export function ReviewJourney({ status }: { status: ProjectReviewStatus }) {
  const approved = status === "approved";
  const changes = status === "changes_requested";
  const rejected = status === "rejected";
  const stages: { label: string; state: JourneyState }[] = [
    { label: "Draft", state: "Completed" }, { label: "Submitted", state: "Completed" },
    { label: "EzraTech Review", state: approved || changes || rejected ? "Completed" : "Current" },
    { label: rejected ? "Not Approved" : "Changes / Approval", state: approved ? "Completed" : changes ? "Current" : "Pending" },
    { label: "Student Matching", state: approved ? "Current" : "Locked" }, { label: "Project Delivery", state: "Locked" },
  ];
  return <nav aria-label="Project status journey"><ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{stages.map((stage, index) => <li key={stage.label} aria-current={stage.state === "Current" ? "step" : undefined} className={`rounded-lg border p-4 ${stage.state === "Completed" ? "border-green-100 bg-green-50/60 text-green-700" : stage.state === "Current" ? changes ? "border-amber-200 bg-amber-50 text-amber-900" : "border-primary/20 bg-blue-light text-primary" : "border-border bg-white text-muted"}`}><p className="text-xs opacity-80">Step {index + 1}</p><p className="mt-2 text-sm font-semibold">{stage.label}</p><p className="mt-3 flex items-center gap-1.5 text-xs">{stage.state === "Completed" && <Icon name="check" className="h-4 w-4" />}{stage.state === "Locked" && <Icon name="lock" className="h-4 w-4" />}{stage.state}</p></li>)}</ol></nav>;
}
