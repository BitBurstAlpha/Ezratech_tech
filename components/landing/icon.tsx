export type IconName = "student" | "assessment" | "learning" | "project" | "verified" | "arrow" | "dashboard" | "user" | "workspace" | "messages" | "settings" | "logout" | "bell" | "lock" | "check" | "clock";
const paths = {
 dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
 user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
 workspace: <><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4M7 7h10M7 11h6"/></>,
 messages: <path d="M21 4H3v14h5l4 4 4-4h5V4ZM7 8h10M7 12h6"/>,
 settings: <><path d="m9 3-1 3-3 1-2 5 2 5 3 1 1 3h6l1-3 3-1 2-5-2-5-3-1-1-3H9Z"/><circle cx="12" cy="12" r="3"/></>,
 logout: <><path d="M9 4H3v16h6M9 12h12m-4-4 4 4-4 4"/></>,
 bell: <><path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3ZM10 21h4M12 2v2"/></>,
 lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
 check: <path d="m5 12 4 4L19 6"/>,
 clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
 student: <><path d="m3 8 9-4 9 4-9 4-9-4Z"/><path d="M6 10v6c3 3 9 3 12 0v-6M21 8v7"/></>,
 assessment: <><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10l1 1 2-2M14 10h2M9 16l1 1 2-2M14 16h2"/></>,
 learning: <><path d="M12 5v15M12 5C9 3 5 3 3 4v14c3-1 6-1 9 2 3-3 6-3 9-2V4c-2-1-6-1-9 1Z"/><path d="M6 8h3M15 8h3M6 12h3M15 12h3"/></>,
 project: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12c6 3 12 3 18 0M10 13h4v3h-4z"/></>,
 verified: <><path d="m12 2 8 3v6c0 5-4 8-8 11-4-3-8-6-8-11V5l8-3Z"/><path d="m8 11 3 3 5-6"/></>,
 arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
};
export function Icon({name, className = "h-6 w-6"}: {name: IconName; className?: string}) { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name]}</svg>; }
