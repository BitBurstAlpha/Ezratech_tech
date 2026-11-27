export const fields = {
  Overview: [
    "Full name",
    "Preferred name",
    "Email",
    "Phone",
    "City",
    "Country",
    "Professional headline",
    "About me",
  ],
  Education: [
    "Qualification",
    "Institution",
    "Education level",
    "Start date",
    "End date",
    "Modules",
    "Awards",
  ],
  Skills: ["Skill name", "Category", "Proficiency"],
  Experience: [
    "Role",
    "Organisation",
    "Employment type",
    "Start date",
    "End date",
    "Description",
    "Achievements",
    "Skills used",
  ],
  "Career Goals": [
    "Target role",
    "Secondary interests",
    "Preferred industries",
    "Working arrangements",
    "Short-term goals",
    "Long-term goals",
    "Development interests",
  ],
  "Project Preferences": [
    "Project categories",
    "Sectors",
    "Availability",
    "Hours per week",
    "Duration",
    "Working arrangement",
    "Practical interests",
  ],
  Achievements: [
    "Certificate or award",
    "Issuer",
    "Issue date",
    "Expiry date",
    "Credential ID",
    "Verification link",
  ],
  "Documents & Links": ["LinkedIn", "GitHub", "Portfolio link"],
} as const;
export type Tab = keyof typeof fields;
export const tabs = Object.keys(fields) as Tab[];
export const multiple = new Set<Tab>([
  "Education",
  "Skills",
  "Experience",
  "Achievements",
]);
export type Row = Record<string, string>;
export type Profile = {
  sections: Record<Tab, Row[]>;
  shareContact: boolean;
  languages: string;
  sharing: boolean;
  visibility: string;
  cvVisibility: string;
};
export function initial(
  name: string,
  goal = "",
  skills: string[] = [],
): Profile {
  const sections = Object.fromEntries(
    tabs.map((tab) => [tab, multiple.has(tab) ? [] : [{}]]),
  ) as Profile["sections"];
  sections.Overview = [{ "Full name": name }];
  sections["Career Goals"] = [{ "Target role": goal }];
  sections.Skills = skills.map((skill) => ({ "Skill name": skill }));
  return {
    sections,
    shareContact: false,
    languages: "",
    sharing: false,
    visibility: "Approved SMEs & Mentors",
    cvVisibility: "Hidden",
  };
}
export function issue(p: Profile): string {
  if (
    !p ||
    typeof p.shareContact !== "boolean" ||
    typeof p.sharing !== "boolean" ||
    typeof p.languages !== "string" ||
    p.languages.length > 3000 ||
    ![
      "Approved SMEs & Mentors",
      "EzraTech Advisors Only",
      "Private (Draft)",
    ].includes(p.visibility) ||
    !["Hidden", "Approved SMEs on Shortlist", "All Approved SMEs"].includes(
      p.cvVisibility,
    ) ||
    !p.sections ||
    Object.keys(p.sections).length !== tabs.length
  )
    return "Invalid profile.";
  for (const tab of tabs) {
    const rows = p.sections[tab];
    if (
      !Array.isArray(rows) ||
      rows.length > 50 ||
      (!multiple.has(tab) && rows.length !== 1)
    )
      return tab + " contains an invalid number of records.";
    for (const row of rows) {
      if (!row || typeof row !== "object" || Array.isArray(row))
        return "Invalid record in " + tab;
      for (const [key, v] of Object.entries(row)) {
        if (
          !(fields[tab] as readonly string[]).includes(key) ||
          typeof v !== "string" ||
          v.length > 3000
        )
          return "Invalid field in " + tab;
        if (!v) continue;
        if (key === "Email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
          return "Enter a valid email address in Overview.";
        if (
          [
            "Verification link",
            "LinkedIn",
            "GitHub",
            "Portfolio link",
          ].includes(key)
        ) {
          try {
            if (!["https:", "http:"].includes(new URL(v).protocol))
              throw Error();
          } catch {
            return "Enter a complete web address for " + key;
          }
        }
        if (
          key.endsWith("date") &&
          (!/^\d{4}-\d{2}-\d{2}$/.test(v) ||
            !Number.isFinite(Date.parse(v)) ||
            new Date(v).toISOString().slice(0, 10) !== v)
        )
          return "Check the dates in " + tab;
        if (key === "Hours per week" && (!/^\d+$/.test(v) || Number(v) > 168))
          return "Hours per week must be between 0 and 168.";
      }
      if (
        (multiple.has(tab) || tab === "Overview") &&
        !row[fields[tab][0]]?.trim()
      )
        return "Enter " + fields[tab][0].toLowerCase() + " in " + tab + ".";
      if (
        (row["End date"] && row["End date"] < row["Start date"]) ||
        (row["Expiry date"] && row["Expiry date"] < row["Issue date"])
      )
        return "Check the date order in " + tab;
    }
  }
  return "";
}
export function preview(p: Profile) {
  if (!p.sharing || p.visibility !== "Approved SMEs & Mentors") return null;
  const sections = structuredClone(p.sections);
  if (!p.shareContact) {
    delete sections.Overview[0].Email;
    delete sections.Overview[0].Phone;
  }
  return sections;
}
