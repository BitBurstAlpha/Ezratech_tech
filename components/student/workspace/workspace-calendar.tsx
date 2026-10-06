"use client";
import { useState } from "react";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { DashboardCard } from "@/components/student/dashboard/dashboard-card";
import { secondaryButton, StatusBadge } from "./workspace-ui";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const projectDate = (week: number, day: number) => new Date(2026, 9, 5 + (week - 1) * 7 + day);

export function WorkspaceCalendar() {
  const { progress } = useDemoProgress();
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const [selected, setSelected] = useState("2026-10-13");
  const [filter, setFilter] = useState("All events");
  const events = [
    ...progress.workspaceTasks.map(task => ({ id: `task-${task.id}`, kind: "Task", title: task.title, date: dateKey(projectDate(Number(task.due.match(/\d+/)?.[0] ?? 1), 4)), time: "Due by end of day", status: task.status, description: task.description })),
    ...progress.workspace.meetings.map((meeting, index) => {
      const day = weekdays.findIndex(day => meeting.day.includes(day));
      const week = Number(meeting.day.match(/Week (\d+)/)?.[1] ?? (index === 0 ? 2 : 1));
      return { id: `meeting-${index}`, kind: "Meeting", title: meeting.title, date: dateKey(projectDate(week, Math.max(day, 0))), time: meeting.time, status: meeting.status, description: `${meeting.participants.join(" and ")} · ${meeting.location}` };
    }),
  ].filter(event => filter === "All events" || event.kind === filter);
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Math.ceil((offset + count) / 7) * 7;
  const selectedEvents = events.filter(event => event.date === selected);
  function moveMonth(amount: number) {
    const next = new Date(month.getFullYear(), month.getMonth() + amount, 1);
    setMonth(next); setSelected(dateKey(next));
  }
  return <DashboardCard title="Project Calendar">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div><h3 aria-live="polite" className="text-xl font-semibold">{month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</h3><p className="mt-1 text-xs text-muted">Meetings and task deadlines in one place</p></div>
      <div className="flex flex-wrap items-center gap-2"><label className="sr-only" htmlFor="calendar-filter">Filter calendar events</label><select id="calendar-filter" value={filter} onChange={event => setFilter(event.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm">{["All events", "Meeting", "Task"].map(value => <option key={value}>{value}</option>)}</select><button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)} className={secondaryButton}>←</button><button type="button" onClick={() => { setMonth(new Date(2026, 9, 1)); setSelected("2026-10-13"); }} className={secondaryButton}>Project month</button><button type="button" aria-label="Next month" onClick={() => moveMonth(1)} className={secondaryButton}>→</button></div>
    </div>
    <div className="mb-4 flex gap-5 text-xs"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" />Meetings</span><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" />Task deadlines</span></div>
    <div className="overflow-x-auto rounded-xl border border-border"><div className="min-w-[630px]">
      <div className="grid grid-cols-7 border-b border-border bg-section">{weekdays.map(day => <div key={day} className="p-3 text-center text-xs font-semibold text-muted">{day.slice(0, 3)}</div>)}</div>
      <div className="grid grid-cols-7">{Array.from({ length: cells }, (_, index) => {
        const date = new Date(month.getFullYear(), month.getMonth(), index - offset + 1);
        const key = dateKey(date); const daily = events.filter(event => event.date === key); const inMonth = date.getMonth() === month.getMonth();
        return <button type="button" key={key} aria-pressed={selected === key} aria-label={`${date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}, ${daily.length} events`} onClick={() => setSelected(key)} className={`min-h-28 border-b border-r border-border p-2 text-left align-top transition-colors hover:bg-blue-light focus-visible:outline-2 focus-visible:outline-primary ${selected === key ? "bg-blue-light ring-2 ring-inset ring-primary" : inMonth ? "bg-white" : "bg-section text-muted"}`}><span className="mb-2 block text-xs font-semibold">{date.getDate()}</span>{daily.map(event => <span key={event.id} className={`mb-1 block rounded px-2 py-1 text-[11px] leading-4 ${event.kind === "Meeting" ? "bg-primary/10 text-primary" : "bg-amber-50 text-amber-800"}`}><span className="block font-semibold">{event.title}</span>{event.kind === "Meeting" ? event.time : event.status}</span>)}</button>;
      })}</div>
    </div></div>
    <section aria-live="polite" className="mt-6"><h3 className="mb-3 text-base font-semibold">{new Date(`${selected}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h3>{selectedEvents.length ? <div className="space-y-3">{selectedEvents.map(event => <article key={event.id} className="rounded-lg border border-border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold text-primary">{event.kind} · {event.time}</p><h4 className="mt-2 font-semibold">{event.title}</h4></div><StatusBadge status={event.status} /></div><p className="mt-3 text-sm leading-6 text-muted">{event.description}</p></article>)}</div> : <p className="rounded-lg bg-section p-4 text-sm text-muted">No {filter === "All events" ? "events" : filter.toLowerCase() + "s"} scheduled for this day.</p>}</section>
    <p className="mt-5 text-xs leading-6 text-muted">Prototype schedule starts Monday, 5 October 2026. Task deadlines fall on Friday of their assigned week; the next check-in is in Week 2. Meeting changes and task status updates appear here automatically. Meeting times use the project’s local time.</p>
  </DashboardCard>;
}
