import type { Metadata } from "next";
import { DemoCentre } from "@/components/demo/demo-centre";
export const metadata: Metadata = { title: "Prototype Demo Centre | EzraTech", description: "Explore EzraTech’s simulated Student, SME and Admin journeys." };
export default function DemoPage() { return <DemoCentre />; }
