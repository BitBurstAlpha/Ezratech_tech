"use client";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Brand } from "@/components/landing/brand";

export function MobileNavigation({
  children,
  close,
}: {
  children: ReactNode;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const trigger = document.activeElement;
    const el = dialog.current;
    el?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus();
      document.body.style.overflow = overflow;
    };
  }, []);
  useEffect(() => {
    const wide = matchMedia("(min-width: 1024px)");
    function resize() {
      if (wide.matches) close();
    }
    wide.addEventListener("change", resize);
    return () => wide.removeEventListener("change", resize);
  }, [close]);
  return (
    <motion.dialog
      ref={dialog}
      aria-label="Student portal menu"
      id="student-mobile-navigation"
      initial={reduced ? false : { x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: reduced ? 0 : "-100%" }}
      transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[90vw] bg-white text-ink shadow-lg"
    >
      <div className="flex min-h-full flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <Brand />
          <button
            type="button"
            onClick={close}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            Close menu
          </button>
        </div>
        {children}
      </div>
    </motion.dialog>
  );
}
