import type { Metadata } from "next";
import { SMEMessages } from "@/components/sme/messages/sme-messages";
export const metadata: Metadata = { title: "SME Messages | EzraTech" };
export default function SMEMessagesPage() { return <SMEMessages />; }
