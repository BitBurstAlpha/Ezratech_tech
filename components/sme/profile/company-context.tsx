"use client";
import { useSMEWorkspaces } from "../workspace/workspace-manager-state";
import { useSME } from "../sme-state";
import { SMECard, SMEDetail } from "../dashboard-ui";
import { companyProfileComplete, organisationContact, organisationLocation, organisationSupervisor } from "./profile-data";
export function CompanyContext({ title = "Company & Supervision Context" }: { title?: string }) {
  const { profile } = useSME();
  const supervisor = organisationSupervisor(profile);
  const { counts, workspaces } = useSMEWorkspaces();
  const active = counts.active + workspaces.filter(project => project.status === "paused").length;
  const capacity = { active, maximum: 2, available: Math.max(0, 2 - active) };
  return <SMECard title={title}><dl className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"><SMEDetail label="Company Name">{profile.companyName}</SMEDetail><SMEDetail label="Industry">{profile.industry}</SMEDetail><SMEDetail label="Company Size">{profile.companySize}</SMEDetail><SMEDetail label="Location">{organisationLocation(profile)}</SMEDetail><SMEDetail label="Authorised Contact">{organisationContact(profile)}</SMEDetail><SMEDetail label="Responsible Supervisor">{supervisor.name || "Not provided"}</SMEDetail><SMEDetail label="Supervision Commitment">{profile.supportTime || "Not provided"}</SMEDetail><SMEDetail label="Working Arrangement">{profile.workingStyle || "Not provided"}</SMEDetail><SMEDetail label="Project Capacity">{capacity.available} available of {capacity.maximum}</SMEDetail><SMEDetail label="Data / Confidentiality Summary">{profile.companyData === "Yes" ? "Anonymised business data · Agreement may be required" : profile.companyData === "No" ? "No company data planned" : "Data arrangements pending"}</SMEDetail><SMEDetail label="Verification Status">{companyProfileComplete(profile) ? "Demo Verified" : "Profile Incomplete"}</SMEDetail></dl><p className="mt-4 text-xs leading-6 text-muted">Prototype Verification · This is simulated verification for the clickable prototype. Project-specific arrangements are reviewed separately.</p></SMECard>;
}
