"use server";
import { requireMarketplace } from "./access";
import { reviewerActions } from "./record";
import { defaultDemoProgress, loadDemoScenario, type DemoScenarioId } from "@/lib/demo-state";
import { presenterAllowed, session } from "@/lib/packages/session";
import { projectsAccessible, readinessAccessible, type ProgressAction } from "@/components/student/progress/progress-state";
import { updateLearning } from "./store";
import { mockProjects } from "@/components/student/projects/details/project-details-data";
import { assessmentQuestions } from "@/components/student/assessment/assessment-data";
import { mockReassessment } from "@/components/student/assessment/development/development-data";
import { validReadiness, type ReadinessAnswers } from "@/components/student/readiness/readiness-data";

export async function recordLearning(action: ProgressAction, readiness?: ReadinessAnswers) {
  const buyer = await session();
  if (!buyer || buyer.role === "sme") throw new Error("Select a student identity to continue.");
  const user = buyer.role === "admin" ? buyer.space + "/alex" : buyer.user;
  return updateLearning(user, action, progress => {
    if (buyer.role === "admin") {
      if (!reviewerActions.includes(action.type)) throw new Error("Student session required.");
    } else {
      switch (action.type) {
        case "startActivity":
        case "completeActivity":
          break;
        case "setReassessmentAnswers": {
          const { delivery, communication, planning } = action.patch;
          if ((delivery !== undefined && !mockReassessment.deliveryOptions.includes(delivery)) ||
              (communication !== undefined && !mockReassessment.communicationOptions.includes(communication)) ||
              (planning !== undefined && (!Array.isArray(planning) || !planning.every(value => mockReassessment.planningOptions.includes(value))))) throw new Error("Invalid reassessment response.");
          break;
        }
        case "completeReadiness":
          if (!readinessAccessible(progress) || !validReadiness(readiness)) throw new Error("Complete the readiness checks first.");
          break;
        case "submitInterest":
          if (!projectsAccessible(progress)) throw new Error("Marketplace access required.");
          break;
        case "completeReassessmentPractice":
          if (!progress.completedActivities.includes("planning") || (progress.assignedCourses && !progress.assignedCourses.some(course => course.id === "planning" && course.accessible))) throw new Error("Complete the assigned practice first.");
          break;
        case "completeAssessment":
          if (action.evidenceProvided !== true || !action.answers || !assessmentQuestions.every(question => {
            const index = action.answers[question.id];
            return Number.isInteger(index) && index >= 0 && index < question.options.length;
          }) || Object.keys(action.answers).length !== assessmentQuestions.length) throw new Error("Complete the skills assessment first.");
          break;
        case "submitReassessment":
        case "submitAssessmentDispute":
        case "requestAssessmentHumanReview":
          break;
        default:
          throw new Error("Unsupported learning action.");
      }
    }
  });
}

export async function loadLearningFixture(id: DemoScenarioId | "reset", key: string) {
  const buyer = await session();
  if (!buyer || buyer.role === "sme") throw new Error("Select a student or administrator first.");
  if (buyer.role !== "admin" && !(id === "reset" && buyer.role === "student") && !presenterAllowed(key)) {
    throw new Error("Enter the private presenter key to replace the learning record.");
  }
  const user = buyer.role === "student" ? buyer.user : buyer.space + "/alex";
  const progress = id === "reset" ? defaultDemoProgress() : loadDemoScenario(id).progress;
  return updateLearning(user, { type: "replaceDemoProgress", progress });
}

export async function checkMarketplaceAccess(projectId: string) {
  if (!mockProjects.some(project => project.id === projectId)) throw new Error("Choose an approved project.");
  await requireMarketplace();
}
