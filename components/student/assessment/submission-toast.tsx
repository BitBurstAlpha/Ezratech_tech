"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Icon } from "@/components/landing/icon";

export function SubmissionToast({notice, recommended, dismiss}: {
  notice: "success" | "error" | null; recommended: boolean; dismiss: () => void;
}) {
  const reduced = useReducedMotion();
  const success = notice === "success";
  const title = success ? "Assessment Submitted Successfully!" : "Assessment could not be saved";
  const message = success
    ? recommended
      ? "Your skills assessment has been submitted. Based on your results, we’ve recommended courses to help you develop your skills and prepare for SME projects. Visit your Learning Plan to see your recommended courses and next steps."
      : "Your skills assessment has been submitted. Visit your Learning Plan to check for course recommendations and next steps."
    : "Your answers are still here. Please try submitting your assessment again.";
  return <>
    <span className="sr-only" role="status" aria-atomic="true">{success && title + " " + message}</span>
    <span className="sr-only" role="alert">{notice === "error" && title + ". " + message}</span>
    <AnimatePresence>{notice && <motion.aside key={notice} aria-label="Assessment submission notification"
      initial={reduced ? false : {opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:reduced?0:16}}
      transition={{duration:reduced?0:0.24,ease:"easeOut"}}
      className="fixed inset-x-4 top-4 z-50 flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-lg sm:left-auto sm:right-6 sm:top-6 sm:max-w-md">
      <span aria-hidden className={`grid size-8 shrink-0 place-items-center rounded-full font-bold ${success?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{success?<Icon name="check" className="size-5"/>:"!"}</span>
      <div><strong>{title}</strong><p className="mt-1 text-sm leading-5 text-muted">{message}</p>
      {success && <Link href="/student/learning-plan" className="mt-2 inline-block text-sm font-semibold text-primary underline">View Learning Plan</Link>}</div>
      <button type="button" aria-label="Dismiss notification" onClick={dismiss} className="shrink-0 rounded px-2 text-lg">×</button>
    </motion.aside>}</AnimatePresence>
  </>;
}
