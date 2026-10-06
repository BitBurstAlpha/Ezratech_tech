This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Step 34: Pilot outcomes and follow-up

Admin reporting is available at `/admin/outcomes`, with detail records at
`/admin/outcomes/students/alex-morgan` and
`/admin/outcomes/smes/northstar-retail`. Reports in the Admin sidebar opens Outcomes.

The dashboard reads Alex and Northstar's existing shared demo workflow. For the
completed example and supplied pilot totals, use **Load completed pilot demo**
and then **Load Demo Snapshot**. This explicitly changes the shared
Student, SME and Admin journey; it cannot replace a cancelled project. Shared state is retained across refreshes in prototype-owned browser storage. Other pilot participants use labelled aggregate mock data.

Reporting periods filter cohorts by their simulated enrolment dates, using a fixed
reference date of 5 October 2026. Counts track those cohorts' subsequent outcomes.
Student and project denominators are separate; one project can have several
students. Repeated follow-ups count the participant once. Interviews, offers and
employment are participant-reported later outcomes, without causal attribution.

The follow-up form, SME repeat-interest form, draft preview and export dialog are
front-end demonstrations only. No services or downloads are performed.

Run `npm run test:outcomes` for reporting and shared-state transition checks, plus
`npm run lint` and `npx tsc --noEmit` for static checks.

## Step 35: Demo Centre

Open `/demo` before presenting. The standalone Demo Centre provides Student,
SME, Admin and full journey launchers; all 14 prepared scenarios; quick role
switching; direct route shortcuts; a manual presentation checklist; and a
collapsible current-state panel. Every prototype page has a Return to Demo Centre
link. Presentation Mode hides developer panels, reset controls, credentials and
checklist while preserving the polished journey/scenario navigation and
prototype disclosures.

- **Start Full Demo / Start Walkthrough / Start Student Demo / Start SME Demo**
  navigate to the selected journey while preserving current shared progress.
  Use the explicit Reset Prototype controls for a fresh start.
- **Start Admin Demo** preserves the current scenario and opens simulated login.
- **Load Scenario** replaces all related shared mock state, removing prior
  cancellation, issues, decisions, verification and outcome progress.
- **Reset All Demo Data** requires the on-screen confirmation and restores the
  specified unregistered Student baseline with an approved sample project and
  locked workspace. It also clears the manual checklist.

Admin demo credentials are `admin@ezratech.demo` / `Admin123!`. The login check
and Copy Credentials button run entirely in the browser; they create no session,
account or production authentication.

Scenario definitions and pure seed helpers live in `lib/demo-state.ts`.
`components/demo/demo-controls.tsx` coordinates the existing progress, SME,
project and candidate providers. Shared state is held in React and persisted in the single browser record
`ezratech-demo:shared-state:v1`; refresh restores progress before mounting the
journey screens. Reset removes only localStorage keys beginning with
`ezratech-demo:` if any exist, and never clears other browser storage. Passwords
entered on registration forms are not retained.

Run `npm run test:demo` to check all scenario gates, cancellation behaviour,
reset scope, baseline state, mock credentials and route availability. This also
runs the Step 34 reporting checks. Use `npx next build --webpack` if the execution
environment restricts the subprocess port binding used by Turbopack.

## Learning and project access state

The three required activities use the existing `planning`, `communication` and
`updates` IDs. `startedActivities` and `completedActivities` remain the source
of truth; shared selectors derive not-started, in-progress and completed statuses,
completion counts and 0/33/67/100% progress. No page maintains its own activity
completion values.

Assessment plus all three completed activities enables reassessment. A successful
reassessment enables readiness. A completed
readiness check sets project-ready and unlocks Projects immediately. Reassessment is required before readiness. Learning or readiness alone cannot open a
workspace: recorded interest, SME acceptance, student confirmation, every student
pre-start item and SME/supervisor readiness are also required. SME acceptance
never fabricates learning, reassessment or readiness results.

The existing state providers persist fields through `lib/demo-storage.ts` and
`components/demo/use-demo-stored-state.ts`, using the same shared record.
Navigation and refresh preserve progress; only explicit scenario loads and confirmed
reset actions replace data. Journey launchers and role shortcuts preserve it.
Browser storage being unavailable leaves the in-memory prototype usable.

Run `npm run test:learning` for the learning-to-workspace sequence, persistence
round-trips, duplicate completion handling and negative access checks.
# Ezratech_tech
