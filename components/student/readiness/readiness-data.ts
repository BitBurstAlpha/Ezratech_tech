export const mockReadinessStatus = {
  student: "Alex Morgan", careerGoal: "Data Analyst", initialStatus: "Almost Ready",
  checks: [
    { label: "Profile", status: "Completed" },
    { label: "Skills Assessment", status: "Completed" },
    { label: "Learning Plan", status: "Completed" },
    { label: "Practical Evidence", status: "Reviewed for demo" },
    { label: "Availability", status: "Needs confirmation" },
    { label: "Project Expectations", status: "Needs confirmation" },
  ],
  ready: {
    status: "PROJECT READY", title: "You're ready to explore suitable SME projects",
    description: "Your profile, skills evidence, learning preparation and availability are ready for project matching.",
    checks: [{ label: "Profile", status: "Ready" }, { label: "Skills Assessment", status: "Ready" }, { label: "Learning Plan", status: "Complete" }, { label: "Availability", status: "Confirmed" }, { label: "Project Preferences", status: "Confirmed" }, { label: "Readiness Status", status: "Project Ready" }],
  },
  notReady: { status: "Further Preparation Needed", reasons: ["Learning plan incomplete", "Availability not confirmed", "Required evidence missing"] },
  nextSteps: ["EzraTech identifies suitable approved SME projects", "You review why each project matches your profile", "You express interest in a project", "The SME reviews your relevant evidence", "Both sides confirm before the project starts"],
};
export const mockAvailability = { hours: ["3–5 hours", "6–8 hours", "9–12 hours", "12+ hours"], schedules: ["Weekdays", "Evenings", "Weekends", "Flexible"], durations: ["2–4 weeks", "4–6 weeks", "6–8 weeks", "Flexible"] };
export const mockProjectPreferences = {
  types: ["Data Analysis", "Business Analysis", "Dashboard / Reporting", "Research", "Process Improvement", "Digital Operations", "Software / Technology", "Open to suitable opportunities"],
  goals: ["Real business experience", "Portfolio evidence", "Employer feedback", "Improve communication skills", "Build confidence", "Explore a career area", "Potential employment opportunity"],
  workingStyles: ["Remote", "Hybrid", "On-site", "Flexible"], city: "London", country: "United Kingdom",
  commitments: ["I understand that real projects may include agreed deadlines and meetings.", "I understand that project access may depend on required checks and agreements.", "I will only accept projects that match my availability."],
};
