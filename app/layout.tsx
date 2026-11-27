import { session } from "@/lib/packages/session";
import { readLearning } from "@/lib/learning/store";
import { learningRecord } from "@/lib/learning/record";
import { SMEWorkspaceManagerProvider } from "@/components/sme/workspace/workspace-manager-state";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
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

export const metadata: Metadata = {
  title: "EzraTech | Skills into experience",
  description: "Build practical workplace skills and prove them through supervised projects with real businesses.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const buyer = await session();
  const user = buyer?.role === "student" ? buyer.user : buyer?.role === "admin" ? buyer.space + "/alex" : null;
  const initialLearning = user ? learningRecord(await readLearning(user)) : null;
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><DemoProgressProvider key={JSON.stringify([buyer?.user, initialLearning])} actorRole={buyer?.role} initialLearning={initialLearning}><SMEProvider><SMEWorkspaceManagerProvider><SMEProjectProvider><SMECandidateProvider><DemoControlsProvider>{children}</DemoControlsProvider></SMECandidateProvider></SMEProjectProvider></SMEWorkspaceManagerProvider></SMEProvider></DemoProgressProvider></body>
    </html>
  );
}
