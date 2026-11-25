import { database, type Package } from "@/lib/packages/store";
import { assessmentQuestions } from "@/components/student/assessment/assessment-data";
import { readLearning, type Course } from "@/lib/learning/store";
import { PackageForm } from "./forms";

function CourseEditor({ course, packages }: { course?: Course; packages: Package[] }) {
  return <details><summary>{course?.title ?? "Create a course"}</summary>
    <PackageForm action={course ? "course" : "create-course"} label="Save course">
      <label>Course ID <input required name="id" maxLength={80} readOnly={!!course} defaultValue={course?.id}/></label>
      <label>Title <input required name="title" defaultValue={course?.title}/></label>
      <label>Description <textarea required name="description" defaultValue={course?.description}/></label>
      <label>Practice scenario <textarea required name="scenario" defaultValue={course?.scenario}/></label>
      <label>Student question <textarea required name="question" defaultValue={course?.question}/></label>
      <label>Duration in minutes <input required name="minutes" type="number" min="1" max="1440" defaultValue={course?.minutes}/></label>
      <label>Required package <select name="package" defaultValue={course?.package_id ?? ""}>
        <option value="">Free access</option>{packages.filter(p => p.audience === "student" && p.id !== "free").map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select></label>
    </PackageForm></details>;
}

export async function LearningEditor({ packages, space }: { packages: Package[]; space: string }) {
  const courses = await database()<Course[]>`select * from ezra_demo.courses order by title`;
  const students = await Promise.all(["alex","emma"].map(async actor => {
    const plan = await readLearning(space + "/" + actor);
    return { name: actor === "alex" ? "Alex Morgan" : "Emma Clarke", plan };
  }));
  return <section className="grid gap-5 rounded-xl border border-border bg-white p-6"><h2 className="text-xl font-semibold">Learning administration</h2>
    {courses.map(course => <CourseEditor key={course.id} course={course} packages={packages}/>)}
    <CourseEditor packages={packages}/>
    {students.map(({name,plan}) => <details key={name}><summary>{name}’s assessment and assignments</summary>
      <p>{plan.assessmentComplete ? "Skills assessment complete" : "Skills assessment pending"}</p>
      {plan.assessment.initialAnswers && <ul>{assessmentQuestions.map(question => <li key={question.id}>{question.category} · {question.options[plan.assessment.initialAnswers![question.id]]}</li>)}</ul>}
      <ul>{plan.assignedCourses?.map(course => <li key={course.id}>{course.title} · {plan.completedActivities.includes(course.id) ? "Completed" : "Required"}</li>)}</ul>
    </details>)}
    <details><summary>Assign a required course</summary><PackageForm action="assign" label="Assign course">
      <label>Student in this demo session <select name="student"><option value="alex">Alex Morgan</option><option value="emma">Emma Clarke</option></select></label>
      <label>Course <select name="id">{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
    </PackageForm></details>
    <details><summary>Create a learning package</summary><PackageForm action="create-package" label="Create package">
      <label>Package ID <input required name="id" maxLength={80}/></label>
      <label>Name <input required name="title"/></label><label>Description <textarea required name="description"/></label>
      <label>Inclusions, one per line <textarea required name="inclusions"/></label>
    </PackageForm></details>
  </section>;
}
