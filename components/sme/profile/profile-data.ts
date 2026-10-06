import type { SMEProfile } from "../sme-data";
import type { DemoProgress } from "@/components/student/progress/progress-state";
import type { ProjectDraft } from "../projects/project-data";
export const companyProjectAreas = ["Data Analysis", "Reporting", "Power BI", "Business Analysis", "Process Improvement", "Customer Research", "Dashboard Prototyping"];
export function organisationContact(profile: SMEProfile) { return `${profile.primaryContact.firstName} ${profile.primaryContact.lastName}`.trim(); }
export function organisationSupervisor(profile: SMEProfile) { return profile.supervisesProjects === "Yes" ? { name: organisationContact(profile), jobTitle: profile.primaryContact.jobTitle, email: profile.primaryContact.email } : profile.supervisor; }
export function organisationLocation(profile: SMEProfile) { return [profile.city, profile.country === "United Kingdom" ? "UK" : profile.country].filter(Boolean).join(", "); }
export function organisationWorkingStyles(profile: SMEProfile) { return profile.workingStyle === "Flexible" ? ["Remote", "Hybrid", "On-site"] : profile.workingStyle.split(" / ").filter(Boolean); }
export function companyProfileChecklist(profile: SMEProfile) {
  const supervisor = organisationSupervisor(profile);
  return [
    { label: "Company Details", complete: [profile.companyName, profile.industry, profile.companySize, profile.city, profile.country, profile.description].every(value => !!value.trim()) },
    { label: "Primary Contact", complete: [organisationContact(profile), profile.primaryContact.jobTitle, profile.primaryContact.email].every(value => !!value.trim()) },
    { label: "Authorised Contact", complete: !!organisationContact(profile) && !!profile.primaryContact.email.trim() },
    { label: "Supervisor", complete: [supervisor.name, supervisor.jobTitle, supervisor.email].every(value => !!value.trim()) && profile.finalReviewer === "Yes" },
    { label: "Supervision Availability", complete: !!profile.supportTime.trim() && profile.supportTime !== "Not sure yet" },
    { label: "Project Preferences", complete: profile.projectAreas.length > 0 && organisationWorkingStyles(profile).length > 0 && !!profile.preferredDuration },
    { label: "Data & Confidentiality", complete: ["Yes", "No"].includes(profile.companyData) },
  ];
}
export function companyProfileComplete(profile: SMEProfile) { return companyProfileChecklist(profile).every(item => item.complete); }
export function companyCapacity(progress: DemoProgress) { const active = Number(progress.activeProject && !progress.projectCompletion.smeApproved); return { active, maximum: 2, available: Math.max(0, 2 - active) }; }
export function profileProjectDraft(draft: ProjectDraft, profile: SMEProfile): ProjectDraft {
  const supervisor = organisationSupervisor(profile);
  const styles = organisationWorkingStyles(profile);
  return { ...draft, company: profile.companyName, supervisionTime: profile.supportTime, workingStyle: styles.includes(draft.workingStyle) ? draft.workingStyle : styles[0] ?? "", supervisor: draft.supervisor.usePrimaryContact === "Yes" ? { ...draft.supervisor, ...supervisor } : draft.supervisor };
}
export type CompanyProfileEdits = Pick<SMEProfile, "description" | "companySize" | "city" | "country" | "headOffice" | "website" | "projectAreas" | "workingStyle" | "supportTime">;
export function editCompanyProfile(profile: SMEProfile, edits: CompanyProfileEdits): SMEProfile {
  return { ...profile, description: edits.description, companySize: edits.companySize, city: edits.city, country: edits.country, headOffice: edits.headOffice, website: edits.website, projectAreas: [...edits.projectAreas], workingStyle: edits.workingStyle, supportTime: edits.supportTime };
}
