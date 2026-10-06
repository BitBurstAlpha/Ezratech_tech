export const smeSteps = ["Organisation", "Company Contact", "Business Needs", "Project Capacity", "Review"];
export const industries = ["Retail", "Technology", "Professional Services", "Finance", "Education", "Marketing", "Hospitality", "Healthcare", "Manufacturing", "Other"];
export const companySizes = ["1–9 employees", "10–49 employees", "50–249 employees", "250+ employees"];
export const projectAreas = ["Data Analysis", "Business Analysis", "Dashboard / Reporting", "Market Research", "Process Improvement", "Digital Operations", "Software / Technology", "Marketing", "Reporting", "Power BI", "Customer Research", "Dashboard Prototyping", "Other"];
export const joiningReasons = ["Complete a small business project", "Explore emerging talent", "Support a future recruitment pipeline", "Get help with a defined piece of work", "Support student development", "Explore the platform", "Other"];
export const supportTimes = ["Less than 1 hour per week", "Around 1 hour per week", "1–2 hours per week", "More than 2 hours per week", "Not sure yet"];
export const durations = ["2–4 weeks", "4–6 weeks", "6–8 weeks", "Flexible"];
export const workingStyles = ["Remote", "Hybrid", "On-site", "Remote / Hybrid", "Flexible"];
export const setupConfirmations = ["I confirm that the information provided is correct for this prototype.", "I understand that projects would require review before becoming available to students.", "I understand that submitting an SME profile does not automatically approve a project."];
export const mockSMEProfile = {
  companyName: "Northstar Retail Ltd", website: "https://www.northstarretail.demo", industry: "Retail", companySize: "10–49 employees", headOffice: "London", city: "London", country: "United Kingdom", description: "Northstar Retail Ltd is a growing retail business focused on improving operational reporting, sales visibility and customer insight.\n\nThe company works with internal sales and operational data and is interested in small, clearly scoped data and reporting projects.",
  primaryContact: { firstName: "Sarah", lastName: "Collins", jobTitle: "Operations Manager", email: "sarah.collins@northstar.demo", phone: "Demo only" },
  supervisesProjects: "Yes", supervisor: { name: "", jobTitle: "", email: "" },
  projectAreas: ["Data Analysis", "Reporting", "Power BI", "Business Analysis"], joiningReason: "Complete a small business project", hasProject: "Yes", projectDescription: "Understand monthly sales performance and develop a dashboard prototype.",
  supportTime: "Around 1 hour per week", preferredDuration: "4–6 weeks", workingStyle: "Remote / Hybrid", companyData: "Yes", finalReviewer: "Yes",
};
export type SMEProfile = typeof mockSMEProfile;
export const mockSMEOnboarding = { smeOnboardingComplete: false, step: 0, confirmations: [] as string[] };
export function validateSMEStep(profile: SMEProfile, step: number): string {
  const email = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (step === 0 && (![profile.companyName, profile.headOffice, profile.city, profile.country, profile.description].every(value => value.trim()) || !industries.includes(profile.industry) || !companySizes.includes(profile.companySize))) return "Complete the required organisation information.";
  if (step === 0 && profile.website && !/^https?:\/\/\S+$/i.test(profile.website)) return "Enter a website beginning with https:// or http://, or leave it blank.";
  if (step === 1 && (!Object.values(profile.primaryContact).every(value => value.trim()) || !email(profile.primaryContact.email) || !["Yes", "No"].includes(profile.supervisesProjects))) return "Complete the company contact information and choose who will supervise projects.";
  if (step === 1 && profile.supervisesProjects === "No" && (!Object.values(profile.supervisor).every(value => value.trim()) || !email(profile.supervisor.email))) return "Add the named supervisor’s name, job title and email.";
  if (step === 2 && (!profile.projectAreas.length || !joiningReasons.includes(profile.joiningReason) || !["Yes", "Not yet", "Not sure"].includes(profile.hasProject))) return "Choose at least one project area, your main reason for joining and whether you have a project.";
  if (step === 3 && (!supportTimes.includes(profile.supportTime) || !durations.includes(profile.preferredDuration) || !workingStyles.includes(profile.workingStyle) || !["Yes", "No", "Not sure"].includes(profile.companyData) || !["Yes", "No", "Not sure"].includes(profile.finalReviewer))) return "Answer each project capacity question before continuing.";
  return "";
}
