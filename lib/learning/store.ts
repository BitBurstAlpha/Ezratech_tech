import "server-only";
import type { TransactionSql } from "postgres";
import { database } from "@/lib/packages/store";
import { defaultDemoProgress } from "@/lib/demo-state";
import { developmentActivities } from "@/components/student/assessment/development/development-data";
import { progressReducer, type DemoProgress, type ProgressAction } from "@/components/student/progress/progress-state";
import { learningRecord, type LearningRecord } from "./record";
import { isLearningFixture } from "./package-access";

export type Course = {
  id: string; title: string; description: string; scenario: string; question: string;
  minutes: number; package_id: string | null;
};
type Plan = {
  assessment_complete: boolean; readiness_complete: boolean; interest_submitted: boolean;
  assessment: DemoProgress["assessment"]; assessment_dispute: DemoProgress["assessmentDispute"];
};

// The explicitly selected, credential-free rehearsal still works without PostgreSQL.
const runtime = globalThis as typeof globalThis & { ezraLearningFixtures?: Map<string, LearningRecord> };
const fixtures = runtime.ezraLearningFixtures ??= new Map<string, LearningRecord>();
function offlineFixture(user: string) {
  return !process.env.DATABASE_URL && isLearningFixture(user);
}

export async function ensurePlan(tx: TransactionSql, user: string) {
  const initial = defaultDemoProgress();
  const inserted = await tx`insert into ezra_demo.learning_plans(user_id,assessment,assessment_dispute)
    values(${user},${tx.json(initial.assessment)},${tx.json(initial.assessmentDispute)})
    on conflict do nothing returning user_id`;
  if (inserted.length) {
    await tx`insert into ezra_demo.course_assignments(user_id,course_id)
      select ${user},id from ezra_demo.courses where id in ('communication','planning','updates')`;
  }
}

async function snapshot(tx: TransactionSql, user: string, lock = false): Promise<DemoProgress> {
  const initial = defaultDemoProgress();
  const [plan] = await tx<Plan[]>`select * from ezra_demo.learning_plans where user_id=${user} ${lock ? tx`for update` : tx``}`;
  if (!plan) return { ...initial, assignedCourses: [] };
  const rows = await tx<(Course & { status: string | null; accessible: boolean })[]>`
    select c.*,p.status,(c.package_id is null or e.id is not null) as accessible
    from ezra_demo.course_assignments a join ezra_demo.courses c on c.id=a.course_id
    left join ezra_demo.course_progress p on p.user_id=a.user_id and p.activity_id=c.id
    left join ezra_demo.entitlements e on e.user_id=a.user_id and e.package_id=c.package_id and e.status='active'
    where a.user_id=${user} order by c.id`;
  return { ...initial, assessment: plan.assessment, assessmentDispute: plan.assessment_dispute,
    assessmentComplete: plan.assessment_complete, readinessComplete: plan.readiness_complete,
    interestSubmitted: plan.interest_submitted,
    assignedCourses: rows.map(row => ({ ...row, duration: row.minutes + " minutes", type: "Course",
      button: "Start course", packageId: row.package_id,
      accessible: row.accessible || (row.package_id === "learning" && isLearningFixture(user)) })),
    startedActivities: rows.filter(row => row.status).map(row => row.id),
    completedActivities: rows.filter(row => row.status === "completed").map(row => row.id),
  };
}

export async function readLearning(user: string): Promise<DemoProgress> {
  if (offlineFixture(user)) return { ...defaultDemoProgress(), ...fixtures.get(user) };
  if (!process.env.DATABASE_URL) return { ...defaultDemoProgress(), assignedCourses: [] };
  return database().begin("isolation level repeatable read read only", tx => snapshot(tx,user));
}

export async function updateLearning(user: string, action: ProgressAction, validate?: (progress: DemoProgress) => void) {
  function apply(current: DemoProgress) {
    validate?.(current);
    if (action.type === "startActivity" || action.type === "completeActivity") {
      const assigned = current.assignedCourses?.find(course => course.id === action.id);
      const allowed = current.assignedCourses ? assigned?.accessible : developmentActivities.some(course => course.id === action.id);
      if (!current.assessmentComplete || !allowed) throw new Error("An assessed student and an accessible assigned course are required.");
      if (action.type === "completeActivity" && !current.startedActivities.includes(action.id)) throw new Error("Start the course first.");
    }
    return progressReducer(current, action);
  }
  if (offlineFixture(user)) {
    const next = apply({ ...defaultDemoProgress(), ...fixtures.get(user) });
    const record = learningRecord(next);
    fixtures.set(user, record);
    return record;
  }
  return database().begin(async tx => {
    await ensurePlan(tx,user);
    const current = await snapshot(tx,user,true);
    const next = apply(current);
    if (action.type === "replaceDemoProgress") {
      await tx`delete from ezra_demo.course_progress where user_id=${user}`;
    }
    for (const course of current.assignedCourses ?? []) {
      const status = next.completedActivities.includes(course.id) ? "completed" : next.startedActivities.includes(course.id) ? "started" : null;
      if (status && (action.type === "replaceDemoProgress" || (("id" in action) && action.id === course.id))) {
        await tx`insert into ezra_demo.course_progress(user_id,activity_id,status) values(${user},${course.id},${status})
          on conflict(user_id,activity_id) do update set status=excluded.status`;
      }
    }
    await tx`update ezra_demo.learning_plans set assessment_complete=${next.assessmentComplete},
      readiness_complete=${next.readinessComplete},interest_submitted=${next.interestSubmitted},
      assessment=${tx.json(next.assessment)},assessment_dispute=${tx.json(next.assessmentDispute)} where user_id=${user}`;
    return learningRecord({ ...next, assignedCourses: current.assignedCourses });
  });
}
