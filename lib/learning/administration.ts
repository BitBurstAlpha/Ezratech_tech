import "server-only";
import { database } from "@/lib/packages/store";
import { ensurePlan } from "./store";

export class AdministrationInputError extends Error {}
const identifier = /^[a-z][a-z0-9-]{0,79}$/;
export async function manageLearning(
  actor: { role: string; space: string }, action: string, form: FormData,
) {
  if (actor.role !== "admin") throw new AdministrationInputError("Administrator required.");
  const field = (name: string) => String(form.get(name) ?? "").trim();
  const id = field("id");
  if (!identifier.test(id)) throw new AdministrationInputError("Use a lowercase course or package ID.");
  const sql = database();
  if (action === "assign") {
    const student = field("student");
    if (!["alex","emma"].includes(student)) throw new AdministrationInputError("Select a demo student.");
    const user = actor.space + "/" + student;
    await sql.begin(async tx => {
      await ensurePlan(tx,user);
      await tx`select user_id from ezra_demo.learning_plans where user_id=${user} for update`;
      const inserted = await tx`insert into ezra_demo.course_assignments(user_id,course_id)
        values(${user},${id}) on conflict do nothing returning course_id`;
      if (inserted.length) await tx`update ezra_demo.learning_plans set readiness_complete=false where user_id=${user}`;
    });
    return "Required course assigned.";
  }

  const title = field("title");
  const description = field("description");
  if (!title || title.length > 150 || !description || description.length > 1200) throw new AdministrationInputError("Enter a title and description.");
  if (action === "create-package") {
    const inclusions = field("inclusions").split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (!inclusions.length || inclusions.length > 20 || inclusions.some(line => line.length > 250)) throw new AdministrationInputError("Enter package inclusions.");
    const rows = await sql`insert into ezra_demo.packages(id,audience,name,description,inclusions,active)
      values(${id},'student',${title},${description},${inclusions},false) on conflict do nothing returning id`;
    if (!rows.length) throw new AdministrationInputError("That package ID already exists.");
    return "Learning package created. Set its price and activate it to enable checkout.";
  }
  if (action !== "course" && action !== "create-course") throw new AdministrationInputError("Unknown operation.");
  const minutes = Number(field("minutes"));
  const scenario = field("scenario");
  const question = field("question");
  const packageId = field("package") || null;
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440 || !scenario || !question ||
    scenario.length > 2000 || question.length > 1000) throw new AdministrationInputError("Check the course duration, scenario and question.");
  if (packageId && !(await sql`select id from ezra_demo.packages where id=${packageId} and audience='student' and id<>'free'`).length)
    throw new AdministrationInputError("Choose a student learning package.");
  if (action === "course") {
    const edited = await sql`update ezra_demo.courses set title=${title},description=${description},
      scenario=${scenario},question=${question},minutes=${minutes},package_id=${packageId} where id=${id} returning id`;
    if (!edited.length) throw new AdministrationInputError("Unknown course.");
    return "Course updated.";
  }
  const created = await sql`insert into ezra_demo.courses(id,title,description,scenario,question,minutes,package_id)
    values(${id},${title},${description},${scenario},${question},${minutes},${packageId})
    on conflict do nothing returning id`;
  if (!created.length) throw new AdministrationInputError("That course ID already exists.");
  return "Course saved.";
}
