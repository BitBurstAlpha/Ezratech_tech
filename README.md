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

## Package and Sandbox checkout demo

Open `/student/packages`, `/sme/packages` or `/admin/packages`. Both paid packages start at **To Be Confirmed**. Public visitors can browse configured active packages and use free resources. A presenter opens a fictional payment identity from **Sandbox Payment Demo** on `/demo`. The existing public admin demo login has no package administration privilege.

### Database and runtime configuration

1. Use the database migration setup below to adopt an existing Supabase project or bootstrap an empty one. The baseline includes the private `ezra_demo` schema, four package entries, three fictional courses and the restricted `ezra_checkout` login. Keep the schema outside Supabase's exposed Data API schemas.
2. Set a generated password on the restricted role using an administrative PostgreSQL connection and the interactive psql command `\password ezra_checkout`. Use the project's transaction pooler connection details with username `ezra_checkout.PROJECT_REF` and the URL-encoded role password. Prepared statements are disabled in the driver for transaction pooling. Keep certificate verification enabled. If the pooler requires a private CA, supply its trusted PEM as `DEMO_DATABASE_CA`. [Supabase connection guide](https://supabase.com/docs/guides/database/connecting-to-postgres)
3. In PayPal Developer, select **Sandbox**, create a REST app for a fictional business sandbox account, and obtain its **sandbox** client ID and secret. Use a separate personal sandbox account as the buyer. Set `PAYPAL_ENV=sandbox`. The application calls the fixed Sandbox API host with server-side credentials. [PayPal Orders API](https://developer.paypal.com/docs/api/orders/v2/)
4. Use `.env.example` as the server environment template. Set `DATABASE_URL`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV`, `DEMO_APP_ORIGIN`, `DEMO_SESSION_SECRET` and `DEMO_PRESENTER_KEY`. Generate the latter two independently, for example with `openssl rand -hex 32`. Give only the presenter the presenter key. Use the exact site origin without a trailing slash and use HTTPS on Netlify.
5. In Netlify project environment settings, add the same values with **Functions** scope for the intended deploy context. Set the origin to that context's actual URL and use an isolated database for any separate preview environment. Redeploy using the existing GitHub integration and Next.js runtime. Keep secret variables server-side. Check the deployed catalogue, presenter login and checkout return routes after deployment. [Netlify environment configuration](https://docs.netlify.com/build/environment-variables/overview/)

### Local student checkout

Use `DEMO_APP_ORIGIN=http://localhost:3000`, `DEMO_LOCAL_STUDENT=true`, and a private `DEMO_SESSION_SECRET` of at least 32 characters in `.env.local`. Start `npm run dev -- --hostname 127.0.0.1` and open `http://localhost:3000/student/packages`. Select **Continue as Alex Morgan (local test)**, or continue with your existing signed student session. Each newly issued local session has its own purchase history. The shortcut is disabled in production and Netlify environments.

Choose **Pay with Test Card** if offered, or **Pay with PayPal Sandbox**. Enter a PayPal-generated sandbox card on PayPal's page or sign in there with a Sandbox Personal buyer. On return choose **Verify and finish checkout**, then **Return to packages**. An active purchase opens the learning plan. To test cancellation, return via PayPal's cancel link and confirm cancellation in EzraTech.

### Presenter walkthrough

1. Select **Package administrator** in the Demo Control Centre, enter the presenter key and open the current demo. In Prototype Pricing, set a positive GBP demonstration amount on a paid package and save. Descriptions, inclusions and availability are editable. Blank paid prices disable new checkout. Existing orders retain their quoted amount and deactivation removes a package from sale. Existing buyers keep their entitlement.
2. Select Alex Morgan or Northstar Retail. **Open identity in current demo** preserves purchases for that identity within the signed session. **Fresh buyer without purchase** starts a new isolated namespace. To compare two buyers, switch using **Open identity in current demo**. The main Alex/Northstar/admin journey shares existing workflow state. Emma and Willow each have a separate workflow history.
3. Open the appropriate package and choose **Pay with PayPal Sandbox**. Sign in with the test buyer and approve. On return, select **Verify and finish checkout**. The server reads the order from PayPal, captures approved funds and checks the order reference, currency, amount and completed capture. Refresh the receipt, then open the catalogue again. To cancel, leave via PayPal's cancel link and choose **Confirm cancellation** on return.
4. In the Learning Plan, **Planning Tasks and Milestones** is the paid activity. The two communication exercises remain free. Checkout grants access only. Complete the activity, other required learning, reassessment and readiness using the existing journey. For the SME, candidate review, initiation, workspaces and closure require the project entitlement plus their existing workflow checks. Load the appropriate existing project scenario to demonstrate each stage.
5. Before connecting a database, choose **Learning Package access fixture · no checkout** as Alex. This presenter-only scenario grants the planning course in a fresh signed demo session. Complete the skills assessment, the three courses, reassessment and readiness to unlock the marketplace. To rehearse later stages, select a signed identity and use the presenter key in Demo Scenarios.
6. Select a purchased or cancelled fixture to rehearse without PayPal credentials. The database and receipt label it **presenter-fixture**. A fixture with an unconfigured price shows zero. For an actual Sandbox demonstration use the buyer checkout in step 3. Admin lists the latest 100 test orders with capture identifiers.
6. For deployment acceptance, use two browser sessions, repeat the receipt action, check another buyer's catalogue, try cancellation, and compare records in Admin. A direct success URL without an owned completed order cannot display a successful receipt.

### Records, reset and limitations

| Private table | Purpose |
| --- | --- |
| packages | Audience, catalogue copy, inclusion list, editable price and availability |
| orders | Identity, local and PayPal order references, quoted amount, provider and payment state |
| purchases | One purchase per order and globally unique capture ID |
| entitlements | One active grant per buyer and package, linked to its purchase |
| courses | EzraTech-managed course content, duration and optional package requirement |
| learning_plans | Per-student assessment evidence, reassessment, human review, readiness and Northstar interest |
| course_assignments | Required courses for each student plan |
| course_progress | Starts and completions keyed to a specific student assignment |

Package configuration applies across the demo. The seeded SME service package enables the existing project delivery gates. Admins can create learning packages, edit courses, and add required courses for Alex or Emma in the current demo namespace at `/admin/packages`. Both demo plans start with the three seeded assignments. The presenter controls the catalogue wording. Signed HTTP-only sessions expire after eight hours. Each consists of a random demonstration namespace and an allowlisted fictional identity. Clearing the cookie or starting a fresh namespace leaves previous transactions in the database. Demo Reset clears prototype browser workflow data and resets the current learning record. The application role can delete course progress for a learning reset. Payment history is retained. Retire the isolated database through its owner after the demonstration.

The presenter key can select every demo identity and edit package configuration. The mechanism is unsuitable for real customers. Authenticated students’ required courses, reassessment and readiness use a server-owned per-student demo record. Marketplace pages and the interest submission recheck the signed student session and this record. Configured sessions persist all learning records in PostgreSQL. Student writes use the signed identity and serialize on the plan row. Only the expressly selected offline learning fixture uses process memory and resets on restart. Other project lifecycle screens continue to use editable local demo data and fictional examples. Legacy browser progress can be previewed, but cannot grant authenticated access. PayPal credentials, purchase authority and paid activity mutation checks stay on the server. Payment recovery runs when the buyer revisits checkout in their original session. Background reconciliation, refunds, customer account recovery and production billing are outside this prototype.

### Verification

Run `npm run build`, `npm run lint` and the existing `test:learning`, `test:workspaces` and `test:demo` scripts. The package suite exercises the actual POST handlers and restricted PostgreSQL transactions with mocked PayPal responses. Create a disposable local database named `ezra_package_test` on a fresh PostgreSQL cluster, apply the migration, then run:

```sh
PACKAGE_TEST_DATABASE_URL=postgresql://ezra_checkout@127.0.0.1:5432/ezra_package_test npm run test:packages
```

Supply the local test role password if required. The suite changes test catalogue prices and creates new fictional orders. It covers ownership, admin edits, simultaneous requests, recovered capture responses, declined payments, amount mismatch, cancellation and fixture isolation. Use the walkthrough above for external Sandbox and Netlify acceptance.

## Database migrations

The source for future schema changes is `supabase/migrations/`. The first version, `20261125202908_baseline.sql`, captures the hosted logical schema, indexes, constraints and grants for all eight tables. For an empty database it creates the restricted login and inserts the original four package and three course defaults. Existing projects retain their own prices, purchases, progress and credentials through one-time history adoption. Keep `db/packages.sql` as the historical bootstrap and isolated legacy-test fixture.

### Install and test locally

Install Docker and PostgreSQL client tools (`psql`, and `pg_dump` version 17 or newer for a PG17 project). CI pins Supabase CLI **3.4.0**. With Node 22 and npm, run `npx --yes supabase@3.4.0 --version`. Substitute `npx --yes supabase@3.4.0` for `supabase` in the commands below if the binary is absent from PATH. The repository already includes CLI configuration. [Supabase CLI reference](https://supabase.com/docs/reference/cli/introduction)

1. Create a branch and run `supabase migration new create_projects`. Edit the newly timestamped SQL file. Qualify application objects with `ezra_demo.` and grant only the privileges required by the application.
2. Run `python3 scripts/migrations/validate.py`. To replay from scratch, start a **new, disposable** PostgreSQL 17 container. The commands below target only its loopback port. The password is a local test value.

   ```bash
   docker run --name ezra-migration-test --rm -d -p 127.0.0.1:55432:5432 \
     -e POSTGRES_PASSWORD=disposable postgres:17
   # Wait until this reports "accepting connections".
   docker exec ezra-migration-test pg_isready -U postgres
   TEST_DB='postgresql://postgres:disposable@127.0.0.1:55432/postgres'
   supabase db push --remote="$TEST_DB" --skip-vault --dry-run
   supabase db push --remote="$TEST_DB" --skip-vault --yes
   supabase migration list --remote="$TEST_DB"
   supabase db push --remote="$TEST_DB" --skip-vault --dry-run
   docker stop ezra-migration-test
   ```

3. Commit the new SQL and open a pull request. CI checks timestamps and rejects edits to existing migration files relative to the PR base. It replays the full chain on disposable PostgreSQL 17, verifies local and applied versions, and checks seed access under the application role. For changes to populated tables, also rehearse the upgrade on a restored development copy.
4. Review SQL, locking, backfill size, old/new application compatibility, and recovery. For deletes, drops, truncation, type changes, or permission changes, explicitly record affected objects, data impact, backup, and reviewer approval in the PR. Use a new forward migration for corrections after merge.

### Adopt the existing development project once

Inspection on 25 November 2026 found PostgreSQL 17.12 and empty Supabase CLI history. The baseline was compared to a schema-only dump. Hosted column storage metadata (`pg_attver`) is instance-specific and excluded. The role password and application rows are excluded. A CLI dry-run lists filenames and cannot verify schema equivalence.

1. Before adoption, identify the correct Supabase project and take the backup described below. Use its migration owner in a private terminal. Set `MIGRATION_DB_URL` from a secret manager, set `PGSSLROOTCERT` to the trusted CA file and `PGSSLMODE=verify-full`. Use a direct connection or the session pooler on port 5432. Keep credential-bearing commands out of traced shell sessions and logs.
2. Run `supabase migration list --remote="$MIGRATION_DB_URL"`. Recheck the schema with `supabase db dump --remote="$MIGRATION_DB_URL" --schema ezra_demo --file /private/path/ezra-schema.sql` (Docker required), or use `pg_dump --schema-only --schema=ezra_demo --no-owner`. Compare the tables, constraints, indexes, and table/column grants with the baseline replay. Check role privileges, ownership, and seed IDs separately. Preserve legitimate edited catalogue values. Resolve unexpected drift or new history before adoption.
3. **Proposed hosted write, requiring explicit approval.** For the verified, populated development project only, the owner would run the command below. It creates or updates Supabase's migration bookkeeping and records this single version as applied. It skips baseline SQL execution.

   ```bash
   supabase migration repair 20261125202908 --status applied --remote="$MIGRATION_DB_URL"
   ```

4. Verify that both columns of `supabase migration list --remote="$MIGRATION_DB_URL"` contain `20261125202908`. Run `supabase db push --remote="$MIGRATION_DB_URL" --skip-vault --dry-run`. Immediately after baseline-only adoption it should report up to date. The hosted workflow requires an adopted baseline and stops on divergent history.

### Configure GitHub and activate deployments

Create GitHub **Environments** named `development` and, when ready, `production`. Each targets a different Supabase project and has its own credentials. In **Settings → Environments**, restrict deployment branches to the repository's default branch. Protect that branch, require reviewed PRs, and require the migration validation check for migration changes. For production, configure required reviewers, prevent self-review and disable administrator bypass before adding secrets. Confirm your GitHub plan supports these protections for the repository's visibility. Leave production credentials unset until the protection is available and verified. [GitHub deployment environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)

| Environment secret | Value |
| --- | --- |
| `MIGRATION_DB_URL` | Project-specific PostgreSQL URI for the owner responsible for schema migrations. Use the direct endpoint or session pooler, a URL-encoded password, and `?sslmode=verify-full` as the sole query option. The owner needs DDL rights on the managed objects and rights to Supabase migration history. |
| `MIGRATION_DATABASE_CA` | The project connection's trusted CA certificate or bundle in multiline PEM format. |

The workflows connect to Postgres by URL. GitHub needs neither a Supabase Management API token nor Netlify, PayPal or application credentials. Keep the application's `DATABASE_URL`, `DEMO_DATABASE_CA`, and restricted runtime role in their existing settings.

**New production project.** Create it when ready. Verify that `ezra_demo`, the custom role and migration history are absent before bootstrap. Review the backup plan and use an approved migration owner with permission to create the restricted role. From a checkout containing **only the reviewed baseline** in the migrations directory, inspect `supabase db push --remote="$MIGRATION_DB_URL" --skip-vault --dry-run`. With explicit production approval, apply that baseline once using the same command without `--dry-run`. Supabase records its execution. Set the new application role's password privately using `psql` and `\password ezra_checkout`. Verify history, seeds and grants before enabling the production workflow. For a populated production project use the adoption procedure instead.

**Routine deployment.** After merging a reviewed migration, go to **Actions → Plan or apply database migrations → Run workflow**. Select the default branch, `development`, and `plan`. Review the listed versions against the SQL at the run's commit. Dispatch `apply` for that same commit after checking the review acknowledgement. If the branch advanced, run a fresh plan. The apply job repeats the history check and dry-run, then verifies that all local versions are recorded. Exercise the affected queries in development. Repeat for `production`, where GitHub holds the environment job for its required reviewer before releasing credentials. Both plan and apply are manual and serialized per environment. Pushes and Netlify builds do not deploy database changes.

### Backup, verification and recovery checklist

- Before applying, record the project, commit, applied versions, expected changes and recovery owner. Confirm a usable Supabase backup or point-in-time recovery window. For a logical backup, use a suitably privileged account and `pg_dump --format=custom --schema=ezra_demo --file=/private/path/ezra-before.dump "$MIGRATION_DB_URL"`. Keep it encrypted outside Git. Save migration history and role membership/grant information separately. Schema-only dumps omit data.
- Restore into an isolated project to verify recovery. Check package and course seeds, record counts, constraints, grants and representative restricted-role reads. A schema-scoped logical dump does not cover cluster roles or unrelated project services. [Supabase backups](https://supabase.com/docs/guides/platform/backups)
- After deployment, compare CLI history to Git, repeat the dry-run, and verify the affected tables and application reads. Keep the run and backup reference with the PR.
- On failure, pause deployments. Inspect the first failed migration, actual schema, data and CLI history. Earlier versions in the same run may already be committed. Rehearse a forward fix in development and obtain review before retrying. If history and schema disagree, document the exact discrepancy and seek explicit approval before any history repair. For data loss, rehearse restoration from the verified backup or PITR in isolation and agree on the recovery point before touching the hosted project.
