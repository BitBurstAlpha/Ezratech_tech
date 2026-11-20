import "server-only";
import { owns } from "@/lib/packages/store";

// Isolated presenter-issued practice namespaces can exercise the course without checkout.
export function isLearningFixture(user: string) {
  const [space, actor] = user.split("/");
  return space.startsWith("learning-fixture-" + actor + "-");
}
export async function hasLearningPackage(user: string) {
  return isLearningFixture(user) || owns(user, "learning");
}
