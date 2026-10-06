import { SMEWorkspaceManagerProvider } from "@/components/sme/workspace/workspace-manager-state";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DemoProgressProvider } from "@/components/student/progress/demo-progress";
import { SMECandidateProvider } from "@/components/sme/candidates/candidate-state";
import { SMEProjectProvider } from "@/components/sme/projects/project-state";

import { SMEProvider } from "@/components/sme/sme-state";
import { DemoControlsProvider } from "@/components/demo/demo-controls";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EzraTech | Skills into experience",
  description: "Build practical workplace skills and prove them through supervised projects with real businesses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><DemoProgressProvider><SMEProvider><SMEWorkspaceManagerProvider><SMEProjectProvider><SMECandidateProvider><DemoControlsProvider>{children}</DemoControlsProvider></SMECandidateProvider></SMEProjectProvider></SMEWorkspaceManagerProvider></SMEProvider></DemoProgressProvider></body>
    </html>
  );
}
