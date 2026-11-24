import "server-only";
import { redirect } from "next/navigation";
import { learningComplete, projectsAccessible } from "@/components/student/progress/progress-state";
import { session } from "@/lib/packages/session";
import { readLearning } from "./store";

export async function requireMarketplace() {
  const buyer = await session();
  if (buyer?.role !== "student") redirect("/student/learning-plan?marketplace=session");
  const progress = await readLearning(buyer.user);
  if (!learningComplete(progress)) redirect("/student/learning-plan?marketplace=courses");
  if (!projectsAccessible(progress)) redirect("/student/readiness?marketplace=pending");
}
