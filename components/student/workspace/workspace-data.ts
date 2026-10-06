export type TaskStatus = "Not Started" | "In Progress" | "Completed";
export type WorkspaceTask = { id: string; title: string; status: TaskStatus; description: string; due: string };
export const mockWorkspace = { company: "Northstar Retail Ltd", project: "Sales Performance Analysis", student: "Alex Morgan", supervisor: "Sarah Collins", duration: "6 weeks", week: 2, totalWeeks: 6, status: "Active Project", location: "Remote", commitment: "6 hours per week" };
export const mockTasks: WorkspaceTask[] = [
  { id: "orientation", title: "Project Orientation", status: "Completed", description: "Review the project brief, expected outputs and available files.", due: "Week 1" },
  { id: "review", title: "Initial Data Review", status: "Completed", description: "Understand the structure of the sales dataset.", due: "Week 1" },
  { id: "cleaning", title: "Data Cleaning", status: "In Progress", description: "Identify duplicates, missing values and inconsistent fields.", due: "Week 2" },
  { id: "analysis", title: "Exploratory Analysis", status: "Not Started", description: "Explore sales trends and identify useful business insights.", due: "Week 3" },
  { id: "dashboard", title: "Dashboard Development", status: "Not Started", description: "Build a clear dashboard of the key sales measures.", due: "Week 4" },
  { id: "presentation", title: "Final Presentation", status: "Not Started", description: "Present your findings and recommendations to the SME.", due: "Week 6" },
];
export const demoProgressValues = [0, 15, 30, 50, 65, 85, 100];
export const mockMilestones = [
  { title: "Project Setup & Data Review", status: "Completed", week: "Week 1" },
  { title: "Data Preparation", status: "In Progress", week: "Week 2" },
  { title: "Analysis & Insights", status: "Upcoming", week: "Week 3" },
  { title: "Dashboard Prototype", status: "Upcoming", week: "Weeks 4–5" },
  { title: "Final Delivery", status: "Upcoming", week: "Week 6" },
];
export const mockMessages = [
  { id: 1, author: "Sarah Collins", text: "Hi Alex, welcome to the project. Please start by reviewing the sales dataset and let me know if anything is unclear." },
  { id: 2, author: "Alex Morgan", text: "Thanks Sarah. I have reviewed the files and started checking the dataset structure." },
  { id: 3, author: "Sarah Collins", text: "Great. Please flag any issues with duplicate records before moving into the analysis." },
];
export const mockFiles = [
  { name: "Northstar_Project_Brief.pdf", type: "PDF", uploadedBy: "Sarah Collins", date: "Week 1 · Monday" },
  { name: "Sales_Data_Sample.xlsx", type: "Excel", uploadedBy: "Sarah Collins", date: "Week 1 · Monday" },
  { name: "Data_Dictionary.pdf", type: "PDF", uploadedBy: "Sarah Collins", date: "Week 1 · Tuesday" },
  { name: "Dashboard_Template.pbix", type: "Power BI", uploadedBy: "Sarah Collins", date: "Week 1 · Tuesday" },
];
export const mockMeetings = [
  { title: "Weekly Project Check-In", status: "Upcoming Meeting", day: "Tuesday", time: "10:00 AM", participants: ["Alex Morgan", "Sarah Collins"], location: "Online" },
  { title: "Project Kick-Off", status: "Previous Meeting", day: "Week 1 · Monday", time: "Completed", participants: ["Alex Morgan", "Sarah Collins"], location: "Online" },
];
export const mockWeeklyUpdates = [{ week: 1, status: "Completed", completed: "Reviewed the project brief and dataset structure. Identified the main tables and fields required for the project.", feedback: "Good start. Continue with the data quality review." }];
export const mockFeedback = { supervisor: "Sarah Collins", text: "Alex has made a good start and communicated clearly about the data quality issues.", categories: [{ name: "Communication", value: "Positive" }, { name: "Progress", value: "On Track" }, { name: "Task Quality", value: "Good" }], history: [{ week: 1, status: "Available" }, { week: 2, status: "Pending" }] };
export const mockEzraResponses = {
  task: { title: "Current task: Data Cleaning", goal: "Review the sales dataset and identify issues that could affect the analysis.", steps: ["Check for duplicate records", "Review missing values", "Look for inconsistent categories", "Confirm data types", "Record any changes you make", "Flag anything that requires SME clarification"] },
  draft: { completed: "This week I reviewed the sales dataset and started the data cleaning process.\n\nI identified several duplicate customer records and some inconsistent product categories.", next: "Next, I will confirm the correct categories and complete the cleaned dataset before starting the exploratory analysis.", blockers: "I need clarification on two product category labels." },
  questions: ["Which sales measures are most important to the business?", "Should duplicate customer records be removed or consolidated?", "Are there specific product categories the dashboard should focus on?", "Who will review the first dashboard version?", "Are there any reporting formats the company already uses?"],
  feedback: "Sarah says you have made a good start and communicated clearly about data quality issues. Communication is positive, progress is on track and task quality is good. Continue with your data quality review and flag duplicate records before analysis.",
  nextSteps: ["Complete the data quality checks for Week 2", "Document duplicates and inconsistent category labels", "Prepare clarification questions for Sarah", "Share your weekly update", "Begin exploratory analysis once the cleaned dataset is ready"],
};
export type WeeklyDraft = typeof mockEzraResponses.draft;
export const workspaceTabs = ["Overview", "Tasks", "Milestones", "Messages", "Files", "Meetings", "Calendar", "Attendance", "Progress", "Feedback"] as const;
export type WorkspaceTab = typeof workspaceTabs[number];
