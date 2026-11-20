/* eslint-disable @typescript-eslint/no-require-imports -- Uses the existing isolated TypeScript test loader. */
require("./test-outcomes.cjs");
const assert = require("node:assert/strict");
const Module = require("node:module");
const { randomUUID } = require("node:crypto");

const jar = new Map();
const original = Module._load;
Module._load = function (name, ...args) {
  if (name === "server-only") return {};
  if (name === "next/headers") return { cookies: async () => ({
    get: key => jar.get(key),
    set: (key, value) => jar.set(key, { value }),
  }) };
  if (name === "next/navigation") return { redirect: path => { throw new Error(path); } };
  return original.call(this, name, ...args);
};
const { POST } = require("../app/api/packages/[action]/route.ts");
const { recordLearning, loadLearningFixture } = require("../lib/learning/actions.ts");
const { requireMarketplace } = require("../lib/learning/access.ts");
const { session } = require("../lib/packages/session.ts");
const { readLearning } = require("../lib/learning/store.ts");
const { mockReassessment } = require("../components/student/assessment/development/development-data.ts");
const { mockAvailability, mockProjectPreferences } = require("../components/student/readiness/readiness-data.ts");
const origin = "http://localhost:3000";
Object.assign(process.env, { DEMO_APP_ORIGIN: origin, DEMO_PRESENTER_KEY: randomUUID(), DEMO_SESSION_SECRET: randomUUID() });

async function post(action, fields) {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.set(key, value);
  return POST(new Request(origin + "/api/packages/" + action, { method: "POST", headers: { origin }, body }), { params: Promise.resolve({ action }) });
}
async function login(actor, mode) {
  assert.equal((await post("session", { actor, mode, key: process.env.DEMO_PRESENTER_KEY })).status, 200);
}
async function locked(reason) {
  await assert.rejects(requireMarketplace, new RegExp("marketplace=" + reason));
  await assert.rejects(() => recordLearning({ type: "submitInterest" }));
}

async function run() {
  await locked("session");
  await login("alex", "learning-fixture");
  const user = (await session()).user;
  assert.deepEqual(readLearning(user).completedActivities, []);
  await locked("courses");
  await assert.rejects(() => loadLearningFixture("student-project-ready", "wrong"));
  await assert.rejects(() => recordLearning({ type: "replaceDemoProgress", progress: { projectReady: true } }));
  await recordLearning({ type: "completeAssessment" });
  for (const id of ["communication", "updates"]) {
    await recordLearning({ type: "startActivity", id });
    await recordLearning({ type: "completeActivity", id });
    await locked("courses");
  }
  assert.equal((await post("activity", { id: "planning", status: "completed" })).status, 409);
  for (const status of ["started", "completed"]) assert.equal((await post("activity", { id: "planning", status })).status, 200);
  await locked("pending");
  await recordLearning({ type: "setReassessmentAnswers", patch: {
    delivery: mockReassessment.deliveryOptions[1], communication: mockReassessment.communicationOptions[1],
    planning: mockReassessment.planningOptions.slice(0, 4),
  } });
  await recordLearning({ type: "submitReassessment" });
  await locked("pending");
  await assert.rejects(() => recordLearning({ type: "completeReadiness" }));
  await recordLearning({ type: "completeReadiness" }, {
    availability: { hours: mockAvailability.hours[0], schedule: mockAvailability.schedules[0], duration: mockAvailability.durations[0] },
    working: { style: mockProjectPreferences.workingStyles[0], city: "London", country: "UK", uk: "Yes", permission: "Yes" },
    types: mockProjectPreferences.types.slice(0, 1), goals: mockProjectPreferences.goals.slice(0, 1), commitments: mockProjectPreferences.commitments,
  });
  await requireMarketplace();
  await recordLearning({ type: "submitInterest" });
  assert.equal(readLearning(user).interestSubmitted, true);
  await login("emma", "resume");
  await locked("courses");
  await login("northstar", "resume");
  await locked("session");
  await login("alex", "resume");
  await requireMarketplace();
  const cookie = jar.get("ezra_package_session").value;
  jar.set("ezra_package_session", { value: cookie.replace(".alex.", ".emma.") });
  await locked("session");
  console.log("Marketplace checks passed for session, identity, entitlement, course counts, reassessment, readiness and interest.");
}
run().catch(error => { console.error(error); process.exitCode = 1; });
