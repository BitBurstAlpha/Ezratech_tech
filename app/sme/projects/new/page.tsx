import type { Metadata } from "next";
import { SMEProjectCreation } from "@/components/sme/projects/project-creation";
export const metadata: Metadata = { title: "Create a New Project | EzraTech" };
export default function NewSMEProjectPage() { return <SMEProjectCreation />; }
