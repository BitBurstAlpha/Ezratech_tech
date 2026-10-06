"use client";
import { useEffect, useRef, useState } from "react";
import { DashboardLink } from "@/components/student/dashboard/dashboard-card";
import { useSME } from "@/components/sme/sme-state";
import { organisationSupervisor } from "@/components/sme/profile/profile-data";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { projectCancelled } from "@/components/projects/closure/closure-data";
import { inputClass, primaryButton, secondaryButton, WorkspaceDialog } from "@/components/student/workspace/workspace-ui";
import { attachmentOptions, mockConversations, mockSupportMessages, projectConversationAvailable, projectConversationId, projectFeed, studentUnreadCount, supportConversationId, type DemoAttachment } from "./message-data";
import { MessageContent } from "./message-content";

export function StudentMessages() {
  const { profile } = useSME();
  const supervisorProfile = organisationSupervisor(profile);
  const { progress, dispatch } = useDemoProgress();
  const available = projectConversationAvailable(progress);
  const [chosen, setChosen] = useState<string>(projectConversationId);
  const selected = !available && chosen !== supportConversationId ? supportConversationId : chosen;
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<Record<string, DemoAttachment | undefined>>({});
  const [attachmentDialog, setAttachmentDialog] = useState(false);
  const [choice, setChoice] = useState<DemoAttachment>(attachmentOptions[0]);
  const [notice, setNotice] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const supervisor = selected === projectConversationId;
  const feed = selected === "project-updates";
  const cancelled = projectCancelled(progress);
  const prestart = available && !progress.preStart.workspaceUnlocked && !cancelled;
  const paused = progress.monitoring.paused && !progress.projectCompletion.smeApproved;
  const readOnly = feed || (supervisor && (cancelled || (!progress.activeProject && progress.applicationStatus !== "sme_accepted") || progress.projectCompletion.finalSubmitted || progress.projectCompletion.smeApproved));
  const unread = studentUnreadCount(progress);
  const messages = supervisor ? progress.workspace.messages : progress.workspace.supportMessages ?? mockSupportMessages;
  const draft = drafts[selected] ?? "";
  const attachment = attachments[selected];
  const blocker = !progress.workspace.blockerResolved && !!progress.workspace.studentUpdates.find(update => update.week === 2)?.blockers;
  const milestone = progress.workspaceTasks.find(task => task.id === "cleaning")?.status === "Completed" ? "Analysis & Insights" : "Data Preparation";
  useEffect(() => { if (supervisor && available) dispatch({ type: "readProjectMessages", reader: "student" }); }, [supervisor, available, unread, dispatch]);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [selected, messages.length]);
  function openConversation(id: string) { setChosen(id); setNotice(""); setAttachmentDialog(false); }
  function send() {
    if (readOnly || (!draft.trim() && !attachment)) return;
    dispatch(supervisor ? { type: "sendWorkspaceMessage", author: "Alex Morgan", text: draft, attachment } : { type: "sendSupportMessage", text: draft, attachment });
    setDrafts(current => ({ ...current, [selected]: "" })); setAttachments(current => ({ ...current, [selected]: undefined })); setNotice("Demo message sent.");
  }
  return <>
    {available ? <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-xl border border-border bg-white p-4 text-sm"><p><span className="text-muted">{prestart ? "Pre-start Project: " : "Active Project: "}</span>Sales Performance Analysis</p><p><span className="text-muted">Company: </span>Northstar Retail Ltd</p>{cancelled && <span className="font-semibold text-muted">Cancelled · Read Only</span>}{paused && <span className="font-semibold text-amber-800">Project Paused</span>}</div> : <section className="rounded-xl border border-border bg-white p-6"><h2 className="text-lg font-semibold">No Active Project Conversations</h2><p className="mt-3 text-sm leading-7 text-muted">Project conversations will appear after a project is confirmed and your workspace is activated.</p></section>}
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[290px_minmax(0,1fr)]">
      <aside className="min-w-0 rounded-xl border border-border bg-white p-3"><h2 className="px-3 py-3 text-sm font-semibold">Conversation List</h2><nav aria-label="Conversations" className="space-y-2">{mockConversations.filter(conversation => available || conversation.id === supportConversationId).map(conversation => {
        const projectChat = conversation.id === projectConversationId;
        const thread = projectChat ? progress.workspace.messages : progress.workspace.supportMessages ?? mockSupportMessages;
        const last = thread.at(-1);
        const preview = conversation.id === "project-updates" ? projectFeed(progress).at(-1) : last?.attachment && !last.text ? last.attachment : last?.text ?? conversation.preview;
        return <button type="button" key={conversation.id} onClick={() => openConversation(conversation.id)} aria-current={selected === conversation.id ? "true" : undefined} className={`w-full rounded-lg border p-3 text-left ${selected === conversation.id ? "border-primary/20 bg-blue-light" : "border-transparent hover:bg-section"}`}><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{conversation.name}</span>{projectChat && unread > 0 && <span aria-label={`${unread} unread messages`} className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">{unread}</span>}</div><p className="mt-1 text-xs text-muted">{conversation.role}</p>{conversation.company && <p className="mt-1 text-xs text-muted">{conversation.company} · {conversation.project}</p>}<p className="mt-3 line-clamp-2 [overflow-wrap:anywhere] text-xs leading-5 text-muted">{preview}</p><p className="mt-2 text-[11px] text-muted">{conversation.id === "project-updates" ? "Week 2" : last?.timestamp ?? conversation.time}{projectChat && cancelled ? " · Read Only" : ""}</p></button>;
      })}</nav></aside>
      <div className="min-w-0 space-y-5"><section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <header className="border-b border-border p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{supervisor ? supervisorProfile.name : feed ? "Project Updates" : "EzraTech Support"}</h2><p className="mt-1 text-sm text-muted">{supervisor ? `${supervisorProfile.jobTitle} · ${profile.companyName}` : feed ? "System / Project Feed" : "Programme Support"}</p>{supervisor && <p className="mt-2 text-xs text-muted">Project: Sales Performance Analysis</p>}</div><span className="rounded-full bg-section px-3 py-1.5 text-xs text-muted">{supervisor ? cancelled ? "Read Only" : paused ? "Project Paused" : "Project Supervisor" : feed ? "Read Only" : "Support"}</span></div></header>
        <div role="log" aria-label={feed ? "Project events" : "Message thread"} aria-live="polite" aria-relevant="additions" className="max-h-[480px] space-y-4 overflow-y-auto p-5">{feed ? <ol className="space-y-4">{projectFeed(progress).map((event, index) => <li key={event} className="rounded-lg border border-border bg-section p-4"><p className="text-xs font-semibold text-primary">Project Update {index + 1}</p><p className="mt-2 text-sm leading-6">{event}</p>{event.includes("Milestone") && <DashboardLink href="/student/workspace/northstar-sales-analysis">View Milestone in Workspace</DashboardLink>}</li>)}</ol> : messages.map(message => <div key={message.id} className={`flex ${message.author === "Alex Morgan" ? "justify-end" : "justify-start"}`}><article className={`max-w-[95%] rounded-xl p-4 sm:max-w-[85%] ${message.author === "Alex Morgan" ? "bg-blue-light" : "bg-section"}`}><p className="mb-2 text-xs font-semibold">{message.author}</p><MessageContent message={message} /></article></div>)}<div ref={end} /></div>
        {supervisor && blocker && <div className="mx-5 mb-5 rounded-lg border border-primary/15 bg-blue-light p-4"><p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Related Project Issue</p><h3 className="mt-2 text-sm font-semibold">Product Category Clarification</h3><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted">Status: {blocker ? "Awaiting SME Response" : "Resolved / No Open Blocker"}</p><DashboardLink href="/student/workspace/northstar-sales-analysis#workspace-issue">View Issue</DashboardLink></div></div>}
        {supervisor && paused && !readOnly && <p className="mx-5 mb-4 rounded-lg bg-amber-50 p-3 text-xs leading-6 text-muted">Project work is paused, but communication remains available for clarification and support.</p>}
        {feed ? <p className="border-t border-border p-5 text-xs text-muted">This project feed is read only. Replies are disabled.</p> : <form onSubmit={event => { event.preventDefault(); send(); }} className="space-y-3 border-t border-border p-5">{readOnly && <p className="text-xs text-muted">Read Only. Existing messages remain available.</p>}<label className="block"><span className="sr-only">Write a message</span><textarea rows={3} disabled={readOnly} placeholder="Write a message..." value={draft} onChange={event => setDrafts(current => ({ ...current, [selected]: event.target.value }))} className={inputClass} /></label>{attachment && <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-section p-3"><div><p className="break-all text-xs font-semibold">{attachment}</p><p className="mt-1 text-[11px] text-muted">Demo attachment · No file uploaded</p></div><button type="button" disabled={readOnly} aria-label="Remove attachment" onClick={() => setAttachments(current => ({ ...current, [selected]: undefined }))} className="text-xs font-semibold text-primary">Remove</button></div>}<div className="flex flex-wrap items-center justify-between gap-3"><button type="button" disabled={readOnly} onClick={() => setAttachmentDialog(true)} className={`${secondaryButton} disabled:opacity-50`}>Attach File</button><button type="submit" disabled={readOnly || (!draft.trim() && !attachment)} className={primaryButton}>Send Message</button></div><p role="status" className="text-xs text-primary">{notice}</p></form>}
      </section>
      {available && <section className="rounded-xl border border-border bg-white p-5"><h2 className="mb-4 text-sm font-semibold">Project Context</h2><dl className="grid gap-4 text-sm sm:grid-cols-2">{[{ label: "Project", value: "Sales Performance Analysis" }, { label: "Current Week", value: prestart ? "Pre-start" : `${progress.projectCompletion.tasksComplete ? 6 : 2} of 6` }, { label: "Current Milestone", value: milestone }, { label: "Open Blocker", value: blocker ? "Product Category Clarification" : "None" }, { label: "Supervisor", value: supervisorProfile.name }].map(item => <div key={item.label}><dt className="text-xs text-muted">{item.label}</dt><dd className="mt-1 font-medium">{item.value}</dd></div>)}</dl><div className="mt-5"><DashboardLink href="/student/workspace/northstar-sales-analysis">Open Workspace</DashboardLink></div></section>}
      </div>
    </div>
    <p className="text-xs leading-6 text-muted"><span className="font-semibold">Prototype Demo</span> · Messages and attachments shown here use simulated data.</p>
    {attachmentDialog && <WorkspaceDialog title="Demo Attachment" onClose={() => setAttachmentDialog(false)}><fieldset><legend className="mb-4 text-sm text-muted">Choose a simulated attachment.</legend><div className="space-y-3">{attachmentOptions.map(filename => <label key={filename} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"><input type="radio" name="demo-attachment" checked={choice === filename} onChange={() => setChoice(filename)} />{filename}</label>)}</div></fieldset><button type="button" disabled={readOnly} className={`${primaryButton} mt-5`} onClick={() => { setAttachments(current => ({ ...current, [selected]: choice })); setAttachmentDialog(false); }}>Attach</button></WorkspaceDialog>}
  </>;
}
