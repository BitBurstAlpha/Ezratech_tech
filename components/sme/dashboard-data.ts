import type { IconName } from "@/components/landing/icon";

export const mockSMEDashboard = {
  company: "Northstar Retail Ltd", primaryContact: "Sarah Collins", role: "Operations Manager",
  industry: "Retail", location: "London, UK", profileComplete: true,
  projectsSubmitted: 2, approvedProjects: 1, interestedStudents: 3, activeProjects: 1,
};
export const projectStatuses = ["Draft", "Submitted", "Under EzraTech Review", "Changes Requested", "Approved", "Matching", "Active", "Completed", "Cancelled", "Pre-Start", "Paused"] as const;
export type SMEProjectStatus = typeof projectStatuses[number];
export type SMEProject = {
  id: string; title: string; status: SMEProjectStatus; category: string; duration: string;
  students: string[]; workingStyle?: string; week?: string; progress?: number;
  milestone?: string; supervisor?: string; health?: string; update?: string; href: string;
};
export const mockSMEProjects: SMEProject[] = [
  { id: "northstar-sales-analysis", title: "Sales Performance Analysis", status: "Active", category: "Data Analysis", duration: "6 weeks", workingStyle: "Remote", students: ["Alex Morgan"], week: "2 of 6", progress: 30, milestone: "Data Preparation", supervisor: "Sarah Collins", health: "On Track", update: "Started reviewing duplicate customer records and inconsistent product categories.", href: "/sme/workspace/northstar-sales-analysis" },
  { id: "customer-reporting-improvement", title: "Customer Reporting Improvement", status: "Draft", category: "Dashboard / Reporting", duration: "Not Confirmed", students: [], href: "/sme/projects/customer-reporting-improvement/edit" },
];
export const mockCandidates = [
  { id: "alex-morgan", name: "Alex Morgan", role: "Data Analyst", skills: ["SQL", "Power BI", "Data Analysis"], status: "Ready for Review" },
  { id: "emma-clarke", name: "Emma Clarke", role: "", skills: ["Excel", "Power BI", "Research"], status: "Ready for Review" },
  { id: "daniel-lee", name: "Daniel Lee", role: "", skills: ["SQL", "Python", "Data Analysis"], status: "Ready for Review" },
];
export const candidateHref = (id: string) => `/sme/projects/northstar-sales-analysis/candidates/${id}`;
export const mockSMEMessages = [{ id: "message-1", sender: "Alex Morgan", message: "Thanks Sarah. I have started reviewing the dataset structure.", time: "10:25 AM" }];
export const mockSMEActivity = [
  { id: "interest", text: "Alex Morgan submitted interest in Sales Performance Analysis", time: "Today" },
  { id: "started", text: "Sales Performance Analysis started", time: "2 days ago" },
  { id: "agreement", text: "Project agreement completed", time: "2 days ago" },
  { id: "profile", text: "Company profile completed", time: "1 week ago" },
];
export const mockSMEPipeline = [
  { label: "Draft", count: 1 }, { label: "Under Review", count: 0 },
  { label: "Approved / Matching", count: 0 }, { label: "Active", count: 1 }, { label: "Completed", count: 0 },
];
export const smeNavigation: { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/sme/dashboard", icon: "dashboard" },
  { label: "Company Profile", href: "/sme/profile", icon: "user" },
  { label: "Projects", href: "/sme/projects", icon: "project" },
  { label: "Candidates", href: "/sme/projects/northstar-sales-analysis/candidates", icon: "student" },
  { label: "Workspace", href: "/sme/workspace", icon: "workspace" },
  { label: "Messages", href: "/sme/messages", icon: "messages" },
];
export const smeQuickActions = [
  { label: "Create Project", href: "/sme/projects/new" },
  { label: "Review Candidates", href: "#candidates" },
  { label: "Open Active Workspace", href: "/sme/workspace/northstar-sales-analysis" },
  { label: "View Messages", href: "/sme/messages" },
  { label: "Company Profile", href: "/sme/profile" },
];
