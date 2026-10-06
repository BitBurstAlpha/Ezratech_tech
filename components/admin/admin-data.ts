import type { IconName } from "@/components/landing/icon";
export const adminReviewRoute = "/admin/project-reviews/northstar-sales-analysis";
export const adminCheckLabels = { scope: "Project Scope", businessProblem: "Business Problem", deliverables: "Deliverables", skills: "Required Skills", supervision: "Supervision", timeCommitment: "Time Commitment", dataConfidentiality: "Data & Confidentiality", acceptanceCriteria: "Acceptance Criteria" };
export type AdminCheckKey = keyof typeof adminCheckLabels;
export type AdminCheckStatus = "approved" | "clarification" | "changes_requested";
export type AdminReviewStatus = "awaiting_review" | "changes_requested" | "resubmitted" | "approved" | "rejected";
export const adminCheckStatusLabels: Record<AdminCheckStatus, string> = { approved: "Meets Requirements", clarification: "Needs Clarification", changes_requested: "Needs Changes" };
export const adminStatusLabels: Record<AdminReviewStatus, string> = { awaiting_review: "Awaiting Review", changes_requested: "Changes Requested", resubmitted: "Changes Submitted", approved: "Approved", rejected: "Project Not Approved" };
export const mockAdminProjectReview = {
  projectId: "northstar-sales-analysis", status: "awaiting_review" as AdminReviewStatus,
  checks: { scope: "approved", businessProblem: "approved", deliverables: "approved", skills: "approved", supervision: "approved", timeCommitment: "approved", dataConfidentiality: "clarification", acceptanceCriteria: "approved" } as Record<AdminCheckKey, AdminCheckStatus>,
  adminNotes: "The project is well scoped overall.\n\nPlease clarify how the anonymised dataset will be provided to the student and confirm that no customer-identifiable information will be included.",
  changesRequested: [], approved: false, matchingUnlocked: false,
};
export const defaultChangeRequest = "Please confirm how the anonymised sales dataset will be shared with the student and confirm that no customer-identifiable information will be included.";
export const changeCategories = ["Project Scope", "Deliverables", "Required Skills", "Supervision", "Time Commitment", "Data & Confidentiality", "Acceptance Criteria", "Other"];
export const rejectionReasons = ["Project is unsuitable for student delivery", "Insufficient supervision", "Data or confidentiality risk", "Scope cannot be safely bounded", "Other"];
export const adminNavigation: { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" }, { label: "Students", href: "/admin/students", icon: "student" },
  { label: "SMEs", href: "/admin/smes", icon: "user" }, { label: "Projects", href: "/admin/projects", icon: "project" },
  { label: "Project Reviews", href: "/admin/dashboard#review-queue", icon: "assessment" }, { label: "Assessments", href: "/admin/assessments/alex-morgan", icon: "verified" },
  { label: "Assessment Reviews", href: "/admin/assessment-disputes", icon: "assessment" },
  { label: "Capability Reviews", href: "/admin/capability-reviews/northstar-sales-analysis/alex-morgan", icon: "verified" }, { label: "Matching", href: "/admin/matching", icon: "student" }, { label: "Active Projects", href: "/admin/active-projects", icon: "workspace" },
  { label: "Issues", href: "/admin/issues", icon: "messages" }, { label: "Reports", href: "/admin/outcomes", icon: "assessment" },
];
export const mockAdminSummary = [{ label: "Students", value: 126 }, { label: "SMEs", value: 18 }, { label: "Projects Awaiting Review", value: 3 }, { label: "Approved Projects", value: 12 }, { label: "Active Projects", value: 6 }, { label: "Open Issues", value: 2 }];
export const mockAdminReviewQueue = [
  { id: "northstar-sales-analysis", title: "Sales Performance Analysis", company: "Northstar Retail Ltd", category: "Data Analysis", submitted: "Today", status: "Awaiting Review", href: adminReviewRoute },
  { id: "customer-feedback-analysis", title: "Customer Feedback Analysis", company: "BrightPath Services Ltd", category: "Research", submitted: "Yesterday", status: "Changes Submitted", href: "/admin/project-reviews/customer-feedback-analysis" },
  { id: "marketing-dashboard-prototype", title: "Marketing Dashboard Prototype", company: "Oakwell Digital Ltd", category: "Dashboard / Reporting", submitted: "2 days ago", status: "Awaiting Review", href: "/admin/project-reviews/marketing-dashboard-prototype" },
];
export const mockAdminActivity = [{ text: "Northstar Retail submitted a new project", time: "Today" }, { text: "Alex Morgan completed a skills assessment", time: "Today" }, { text: "BrightPath submitted requested project changes", time: "Yesterday" }, { text: "Oakwell Digital completed SME onboarding", time: "2 days ago" }];
export const adminQuickActions = [{ label: "Review Projects", href: "#review-queue" }, { label: "Review Assessments", href: "/admin/assessments/alex-morgan" }, { label: "View Matching", href: "/admin/matching" }, { label: "View Active Projects", href: "/admin/active-projects" }, { label: "View Issues", href: "/admin/issues" }];
