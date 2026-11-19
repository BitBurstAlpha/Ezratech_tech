import type { DemoProgress } from "@/components/student/progress/progress-state";
import { projectCancelled } from "@/components/projects/closure/closure-data";
export const smeResponsibilities = [
  "I confirm the project scope is still accurate.",
  "I confirm Sarah Collins will supervise the project.",
  "I confirm approximately one hour per week of supervision is available.",
  "I confirm the student will only receive approved project data.",
  "I understand project changes should be communicated through the agreed process.",
  "I confirm the required project agreement and confidentiality arrangements are complete.",
];

export const [scope, supervisor, supervisionTime, dataAccess, communication, agreement] = smeResponsibilities;

export function initiationChecklist(progress: DemoProgress) {
  const { preStart, smeResponsibilityConfirmations } = progress;
  const confirmed = (key: string) => smeResponsibilityConfirmations.includes(key);
  return {
    student: preStart.studentConfirmed,
    sme: progress.applicationStatus === "sme_accepted" && progress.interestSubmitted,
    scope: confirmed(scope),
    supervisor: preStart.supervisorConfirmed && [supervisor, supervisionTime, communication].every(confirmed),
    agreement: confirmed(agreement) && preStart.projectAgreementReviewed && preStart.ndaReviewed && preStart.portfolioPermissionReviewed,
    data: preStart.dataAccessReady && confirmed(dataAccess),
    eligibility: progress.projectReady && preStart.eligibilityAcknowledged && preStart.availabilityConfirmed && preStart.expectationsConfirmed,
  };
}

export function projectInitiation(progress: DemoProgress) {
  const projectStarted = progress.preStart.workspaceUnlocked;
  const ready = Object.values(initiationChecklist(progress)).every(Boolean);
  const projectStatus = projectCancelled(progress) ? "cancelled" : progress.projectCompletion.smeApproved ? "completed"
    : progress.monitoring.paused ? "paused" : projectStarted ? "active" : "not_started";
  return { projectStarted, projectStatus, initiationStatus: ready || projectStarted ? "completed" : "pending" } as const;
}
