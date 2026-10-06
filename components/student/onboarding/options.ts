export const steps = ["About You", "Education", "Career Goals", "Experience", "Skills"];
export const statuses = ["University Student", "Recent Graduate", "Postgraduate Student", "Career Changer", "Other"];
export const studyLevels = ["Undergraduate", "Master's", "PhD / Doctoral", "Other"];
export const roles = ["Data Analyst", "Business Analyst", "Software Developer", "Project Coordinator", "Digital Marketing", "Operations", "Product / Technology", "Other"];
export const goals = ["Get my first graduate job", "Find work experience", "Build a stronger portfolio", "Improve practical skills", "Change career direction", "Explore career options"];
export const experienceTypes = ["Employment", "Internship", "Placement", "Freelance", "Volunteering", "University Project", "Personal Project", "Other"];
export const skillGroups = [
  { title: "Data & Analytics", skills: ["Excel", "SQL", "Power BI", "Tableau", "Python", "Data Analysis"] },
  { title: "Business", skills: ["Business Analysis", "Requirements Gathering", "Process Mapping", "Research", "Documentation"] },
  { title: "Project & Collaboration", skills: ["Project Management", "Jira", "Agile", "Teamwork", "Stakeholder Communication", "Presentation"] },
  { title: "Technology", skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Node.js"] },
];
export const headings = ["Tell us about yourself", "Your education", "What are you working towards?", "Your experience", "Your current skills"];
export const descriptions = [
  "This information helps us understand your background and prepare your skills profile.",
  "Add your studies and qualifications to your skills profile.",
  "Your goals will help EzraTech recommend relevant skills development and project opportunities.",
  "Tell us about any practical experience you already have.",
  "Choose the skills you have used before. You will have an opportunity to demonstrate them during the assessment.",
];
export type Experience = { id: number; type: string; title: string; organisation: string; description: string; skills: string };
export function blankExperience(id: number): Experience { return { id, type: "", title: "", organisation: "", description: "", skills: "" }; }
