"use client";
import { useState } from "react";
import { capabilityLevels } from "@/components/admin/capability/capability-data";
import { DashboardCard, DashboardLink } from "@/components/student/dashboard/dashboard-card";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { primaryButton, StatusBadge } from "@/components/student/workspace/workspace-ui";
import { mockPortfolio as student, verifiedExperiences, verifiedCapabilities } from "./evidence-record-data";
import { PortfolioEmpty } from "./portfolio-empty";
import { EvidenceBadge, PortfolioNote, RecordDetails } from "./portfolio-record-ui";
import { fullVisibilityOptions } from "./portfolio-data";
import { PublicPortfolioPreview } from "./public-portfolio-preview";

export function StudentPortfolio() {
  const { progress, dispatch } = useDemoProgress();
  const [previewOpen, setPreviewOpen] = useState(false);
  const experiences = verifiedExperiences(progress);
  const skills = verifiedCapabilities(progress);
  return <div className="space-y-6">
    <DashboardCard title={student.name} action={<StatusBadge status={progress.profileComplete ? "Complete" : "In Progress"} />}><p className="mb-5 text-sm leading-7 text-muted">{experiences.length ? "Aspiring Data Analyst with practical experience in SQL, Power BI and business-focused data analysis." : "Aspiring Data Analyst building skills in SQL, Power BI and business-focused data analysis."}</p><RecordDetails items={[{ label: "Career Goal", value: student.careerGoal }, { label: "Location", value: student.shortLocation }, { label: "Working Preference", value: student.preferredWork }, { label: "Availability", value: "6–8 hours/week" }, { label: "Profile Status", value: progress.profileComplete ? "Complete" : "In Progress" }]} /></DashboardCard>
    <DashboardCard title="Career Goal"><p className="text-sm font-semibold">Primary Goal: Data Analyst</p><p className="mt-3 text-sm text-muted">Related Areas: Business Intelligence · Reporting · Data Analysis</p><p className="mt-4 text-sm leading-7 text-muted">Build practical experience in preparing data, explaining business findings and producing clear reports.</p></DashboardCard>
    {experiences.length === 0 ? <PortfolioEmpty /> : <>
      <div className="grid gap-4 sm:grid-cols-2">{[{ label: "Verified Experiences", value: experiences.length }, { label: "Completed SME Projects", value: experiences.length }].map(item => <section key={item.label} className="rounded-xl border border-border bg-white p-5"><h2 className="text-xs text-muted">{item.label}</h2><p className="mt-3 text-3xl font-semibold text-primary">{item.value}</p></section>)}</div>
      <DashboardCard title="Verified Skills"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{skills.map(skill => <article key={skill.key} className="rounded-lg border border-border p-4"><h3 className="mb-3 text-sm font-semibold">{skill.name}</h3><EvidenceBadge>{skill.decision === "guidance" ? "Verified with guidance" : "Verified"}</EvidenceBadge><p className="mt-3 text-xs leading-6 text-muted">{skill.evidence}</p></article>)}</div></DashboardCard>
      <DashboardCard title="Capability Levels"><p className="mb-5 text-xs leading-6 text-muted">EzraTech framework: {Object.values(capabilityLevels).join(" · ")}</p><dl className="grid gap-4 sm:grid-cols-2">{skills.map(skill => <div key={skill.key} className="rounded-lg border border-border p-4"><dt className="text-sm font-semibold">{skill.name}</dt><dd className="mt-2 text-sm leading-6 text-primary">{skill.level}</dd></div>)}</dl></DashboardCard>
      <DashboardCard title="Completed SME Projects"><div className="space-y-4">{experiences.map(record => <article key={record.id} className="rounded-xl border border-border p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-semibold">{record.project}</h3><p className="mt-2 text-sm text-muted">{record.company}</p></div><div className="flex gap-2"><StatusBadge status="Completed" /><EvidenceBadge>Verified</EvidenceBadge></div></div><p className="my-4 text-sm text-muted">{record.category} · Duration: {record.duration}</p><DashboardLink href={`/student/portfolio/${record.id}`}>View Verified Experience</DashboardLink></article>)}</div></DashboardCard>
      <DashboardCard title="Verified Experience"><div className="space-y-4">{experiences.map(record => <article key={record.id} className="rounded-xl border border-primary/20 bg-blue-light p-5"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-semibold">{record.project}</h3><EvidenceBadge>Verified</EvidenceBadge></div><RecordDetails items={[{ label: "Company", value: record.company }, { label: "Dates", value: `${record.dates.start} – ${record.dates.end}` }, { label: "Agreed Workload", value: record.workload }, { label: "Reviewer", value: record.reviewer }, { label: "SME", value: record.company }]} /><div className="mt-5"><DashboardLink href={`/student/portfolio/${record.id}`}>View Evidence</DashboardLink></div></article>)}</div></DashboardCard>
      <DashboardCard title="Portfolio Visibility"><div className="grid gap-3 sm:grid-cols-2">{fullVisibilityOptions.map(option => <label key={option.key} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"><input type="checkbox" checked={progress.fullPortfolioVisibility[option.key]} onChange={event => dispatch({ type: "setFullPortfolioVisibility", key: option.key, value: event.target.checked })} />{option.label}</label>)}</div><p className="my-4 text-xs leading-6 text-muted">Preview visibility also respects the SME’s approved portfolio permissions.</p><button type="button" onClick={() => setPreviewOpen(true)} className={primaryButton}>Preview Public Portfolio</button></DashboardCard>
    </>}
    <PortfolioNote />{previewOpen && <PublicPortfolioPreview onClose={() => setPreviewOpen(false)} />}
  </div>;
}
