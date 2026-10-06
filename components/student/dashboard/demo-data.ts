import type { IconName } from "@/components/landing/icon";
export const demoStudent = { name: "Alex Morgan", firstName: "Alex", initials: "AM", careerGoal: "Data Analyst", completion: 80, stage: "Skills Assessment" };
export const navigation: { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: "dashboard" },
  { label: "My Profile", href: "/student/profile", icon: "user" },
  { label: "Skills Assessment", href: "/student/assessment", icon: "assessment" },
  { label: "Learning Plan", href: "/student/learning-plan", icon: "learning" },
  { label: "Projects", href: "/student/projects", icon: "project" },
  { label: "My Workspace", href: "/student/workspace", icon: "workspace" },
  { label: "Messages", href: "/student/messages", icon: "messages" },
  { label: "Portfolio", href: "/student/portfolio", icon: "verified" },
];
export const journey: { label: string; status: "Completed" | "Next Step" | "Locked"; icon: IconName }[] = [
  { label: "Profile", status: "Completed", icon: "check" },
  { label: "Skills Assessment", status: "Next Step", icon: "assessment" },
  { label: "Learning", status: "Locked", icon: "lock" },
  { label: "Project Ready", status: "Locked", icon: "lock" },
  { label: "SME Project", status: "Locked", icon: "lock" },
  { label: "Verified Experience", status: "Locked", icon: "lock" },
];
export const demoSkills = ["SQL", "Excel", "Power BI", "Python", "Data Analysis", "Communication"];
export const activities = ["Profile created", "Career goals added", "Skills added"];
