"use server";
import { requireMarketplace } from "./access";
import { reviewerActions } from "./record";
import { defaultDemoProgress, loadDemoScenario, type DemoScenarioId } from "@/lib/demo-state";
import { presenterAllowed, session } from "@/lib/packages/session";
import { learningActivityIds, projectsAccessible, readinessAccessible, type ProgressAction } from "@/components/student/progress/progress-state";
import { readLearning, updateLearning } from "./store";
import { hasLearningPackage } from "./package-access";
import { mockReassessment } from "@/components/student/assessment/development/development-data";
import { validReadiness, type ReadinessAnswers } from "@/components/student/readiness/readiness-data";

export async function recordLearning(action: ProgressAction, readiness?: ReadinessAnswers) {
  const buyer = await session();
  if (!buyer || buyer.role === "sme") throw new Error("Select a student identity to continue.");
  const user = buyer.role === "admin" ? buyer.space + "/alex" : buyer.user;
  const progress = readLearning(user);
  if (buyer.role === "admin") {
    if (!reviewerActions.includes(action.type)) throw new Error("Student session required.");
  } else {
    switch (action.type) {
      case "startActivity":
      case "completeActivity":
        if (!learningActivityIds.includes(action.id) || action.id === "planning") throw new Error("Use the paid course entry point.");
        if (action.type === "completeActivity" && !progress.startedActivities.includes(action.id)) throw new Error("Start the course first.");
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
        if (!await hasLearningPackage(user)) throw new Error("Learning Package required.");
        break;
      case "completeAssessment":
      case "submitReassessment":
      case "submitAssessmentDispute":
      case "requestAssessmentHumanReview":
        break;
      default:
        throw new Error("Unsupported learning action.");
    }
  }
  return updateLearning(user, action);
}

export async function loadLearningFixture(id: DemoScenarioId | "reset", key: string) {
  const buyer = await session();
  if (!buyer) throw new Error("Select a demo identity first.");
  if (buyer.role !== "admin" && !(id === "reset" && buyer.role === "student") && !presenterAllowed(key)) {
    throw new Error("Enter the private presenter key to replace the learning record.");
  }
  const user = buyer.role === "student" ? buyer.user : buyer.space + "/alex";
  const progress = id === "reset" ? defaultDemoProgress() : loadDemoScenario(id).progress;
  return updateLearning(user, { type: "replaceDemoProgress", progress });
}

export async function checkMarketplaceAccess() {
  await requireMarketplace();
}
