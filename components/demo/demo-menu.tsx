"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoControls } from "./demo-controls";
export function DemoMenu() {
  const pathname = usePathname();
  const { currentDemoScenario, presentationMode } = useDemoControls();
  if (pathname === "/demo") return null;
  return <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-primary/10 bg-blue-light px-5 py-2 text-xs leading-5 text-primary"><Link href="/demo" prefetch={false} className="font-semibold hover:underline">Return to Demo Centre</Link><span>{presentationMode ? "Prototype Demo" : `Demo Session · ${currentDemoScenario}`}</span></div>;
}
