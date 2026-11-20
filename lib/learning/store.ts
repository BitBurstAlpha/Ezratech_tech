import "server-only";
import { defaultDemoProgress } from "@/lib/demo-state";
import { progressReducer, type ProgressAction } from "@/components/student/progress/progress-state";
import { learningRecord, type LearningRecord } from "./record";

// Single-process demo repository. Only server-issued session identities are used as keys.
type StudentRecord = LearningRecord & { interestSubmitted: boolean };
const runtime = globalThis as typeof globalThis & { ezraStudentLearning?: Map<string, StudentRecord> };
const records = runtime.ezraStudentLearning ??= new Map<string, StudentRecord>();

export function readLearning(user: string) {
  return { ...defaultDemoProgress(), ...records.get(user) };
}

export function updateLearning(user: string, action: ProgressAction) {
  const progress = progressReducer(readLearning(user), action);
  const record = learningRecord(progress);
  records.set(user, { ...record, interestSubmitted: progress.interestSubmitted });
  return record;
}
