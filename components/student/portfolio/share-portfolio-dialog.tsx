"use client";
import { useState } from "react";
import { inputClass, primaryButton, secondaryButton, WorkspaceDialog } from "@/components/student/workspace/workspace-ui";

export function SharePortfolioDialog({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  return <WorkspaceDialog title="Share with Employer" onClose={onClose}>{sent ? <div role="status"><p className="rounded-lg bg-green-50 p-4 text-sm font-semibold text-green-700">Portfolio sharing simulated for demo.</p><button type="button" onClick={onClose} className={`${secondaryButton} mt-5`}>Close</button></div> : <form onSubmit={event => { event.preventDefault(); setSent(true); }} className="space-y-5"><p className="text-xs leading-6 text-muted">Use sample employer details. This prototype only simulates sharing.</p><label className="block text-sm font-medium">Employer Name<input required name="employer-name" maxLength={120} className={`${inputClass} mt-2`} /></label><label className="block text-sm font-medium">Employer Email<input required type="email" name="employer-email" className={`${inputClass} mt-2`} placeholder="employer@example.com" /></label><label className="block text-sm font-medium">Message<textarea required name="message" rows={4} className={`${inputClass} mt-2`} defaultValue="Please find my EzraTech portfolio, which includes my reviewed project experience and demonstrated skills." /></label><button type="submit" className={primaryButton}>Send</button></form>}</WorkspaceDialog>;
}
