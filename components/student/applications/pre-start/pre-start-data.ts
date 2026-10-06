export const mockPreStartStatus = { studentConfirmed: false, availabilityConfirmed: false, eligibilityAcknowledged: false, projectAgreementReviewed: false, ndaReviewed: false, portfolioPermissionReviewed: false, expectationsConfirmed: false, smeConfirmed: false, supervisorConfirmed: false, dataAccessReady: true, workspaceUnlocked: false };
export type PreStartStatus = typeof mockPreStartStatus;
export type PreStartKey = Exclude<keyof PreStartStatus, "workspaceUnlocked">;
export const preStartChecklist: { key: PreStartKey; label: string }[] = [
  {key: "studentConfirmed", label: "Student Confirmation"}, {key: "availabilityConfirmed", label: "Availability"}, {key: "eligibilityAcknowledged", label: "Eligibility Information"}, {key: "projectAgreementReviewed", label: "Project Agreement"}, {key: "ndaReviewed", label: "Confidentiality Review"}, {key: "portfolioPermissionReviewed", label: "Portfolio Permission"}, {key: "expectationsConfirmed", label: "Project Expectations"},
];
export function preStartComplete(status: PreStartStatus) { return preStartChecklist.every(item => status[item.key]); }
export function projectSetupComplete(status: PreStartStatus) { return preStartComplete(status) && status.smeConfirmed && status.supervisorConfirmed && status.dataAccessReady; }
export const mockPreStartProject = { company: "Northstar Retail Ltd", title: "Sales Performance Analysis", student: "Alex Morgan", summary: [{label: "Company",value: "Northstar Retail Ltd"},{label: "Project",value:"Sales Performance Analysis"},{label:"Duration",value:"6 weeks"},{label:"Weekly Commitment",value:"Approximately 6 hours"},{label:"Working Style",value:"Remote"},{label:"Supervisor",value:"Sarah Collins"},{label:"Expected Meetings",value:"Approximately once per week"},{label:"Start Date",value:"Demo date only"}] };
export const participationChecks = ["I have reviewed the project scope.", "I can commit approximately 6 hours per week.", "I understand the project is expected to run for 6 weeks.", "I still want to participate in this project."];
export const expectationChecks = ["I understand that project tasks may have agreed deadlines.", "I understand that I should communicate blockers early.", "I understand that project files may be confidential.", "I understand that my project work may be reviewed by the SME and EzraTech.", "I understand that project completion does not guarantee employment."];
export const demoAgreements: { key: PreStartKey; title: string; text: string }[] = [
  {key:"projectAgreementReviewed",title:"Project Participation Agreement",text:"This demo agreement would cover project scope, responsibilities, communication expectations and project conduct."},
  {key:"ndaReviewed",title:"Confidentiality / NDA",text:"This would explain confidentiality expectations and how project information may be used."},
  {key:"portfolioPermissionReviewed",title:"Portfolio & Work Evidence Permission",text:"This would define whether approved and redacted project outputs may later appear in the student's EzraTech portfolio."},
];
