"use server";
import { redirect } from "next/navigation";
import { endSession } from "@/lib/packages/session";

export async function signOut() {
  await endSession();
  redirect("/");
}
