"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/landing/icon";

export const panel =
  "rounded-2xl border border-dashboard-line bg-white p-5 shadow-sm sm:p-6";
export function Entrance({
  children,
  order = 0,
  className = "",
}: {
  children: ReactNode;
  order?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      className={className}
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0 : 0.36,
        delay: reduced ? 0 : order * 0.035,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.section>
  );
}
export function Fill({ value }: { value: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="h-full origin-left rounded-full bg-[#0a66c2]"
      initial={reduced ? false : { scaleX: 0 }}
      animate={{ scaleX: value / 100 }}
      transition={{ duration: reduced ? 0 : 0.7, ease: "easeOut" }}
    />
  );
}
export function ActionLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <motion.span
      className="inline-flex self-start"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
    >
      <Link
        href={href}
        prefetch={false}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${primary ? "border-transparent bg-[#0a66c2] text-white hover:bg-dashboard-blue" : "border-dashboard-line bg-white text-dashboard-blue hover:bg-dashboard-soft"}`}
      >
        {children}
        <Icon name="arrow" className="size-4" />
      </Link>
    </motion.span>
  );
}
