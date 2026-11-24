-- Run ONCE as the migration owner in a fresh, isolated Supabase project.
-- This transaction deliberately fails on existing objects. All seeds are fictional
-- EzraTech demo catalogue entries. No credentials or payment requests are needed.
begin;
-- LOGIN is the only non-default role attribute. The owner sets its password later.
create role ezra_checkout login;
create schema ezra_demo;
set local search_path = ezra_demo;
revoke all on schema ezra_demo from public;
create table packages (
 id text primary key, audience text not null check (audience in ('student','sme')),
 name text not null, description text not null, inclusions text[] not null,
 price numeric(9,2), currency text not null default 'GBP' check(currency='GBP'),
 active boolean not null default true,
 check (case when id in ('free','starter') then price is not null and price=0 else price is null or price>0 end)
);
insert into packages(id,audience,name,description,inclusions,price) values
 ('free','student','Free Access','Get started with your learning plan.',array['Student registration','Profile creation','Initial skills assessment','Available free learning resources'],0),
 ('learning','student','Learning Package','Continue your personalised development plan.',array['Access to required paid learning activities','Learning progress tracking','Relevant reassessment activities','Project readiness evaluation'],null),
 ('starter','sme','SME Starter','Prepare a project for review.',array['Company profile','Project draft creation','Project submission for review'],0),
 ('project','sme','SME Project Package','Manage an approved project through closure.',array['Agreed project service package','Candidate review after project approval','Project initiation workflow','SME workspace and supervision tools','Final project review and closure'],null);
create table orders (
 id uuid primary key default gen_random_uuid(), user_id text not null, package_id text not null references packages,
 provider text not null check(provider in ('paypal-sandbox','presenter-fixture')), provider_order_id text unique,
 amount numeric(9,2) not null check(amount>=0), currency text not null check(currency='GBP'),
 status text not null default 'pending' check(status in ('pending','approved','completed','failed','cancelled')),
 created_at timestamptz not null default now()
);
create unique index one_open_order on orders(user_id,package_id) where status in ('pending','approved');
create table purchases (
 id uuid primary key default gen_random_uuid(), order_id uuid unique not null references orders,
 user_id text not null, package_id text not null references packages, provider_capture_id text not null unique,
 payment_status text not null default 'completed' check(payment_status='completed'), purchased_at timestamptz not null default now()
);
create table entitlements (
 id uuid primary key default gen_random_uuid(), user_id text not null, package_id text not null references packages,
 purchase_id uuid unique not null references purchases, status text not null default 'active' check(status='active'),
 activated_at timestamptz not null default now(), unique(user_id,package_id)
);
-- Courses are managed by EzraTech. A nullable package grants access to the lesson.
create table courses (
 id text primary key check (id ~ '^[a-z][a-z0-9-]{0,79}$'),
 title text not null check (btrim(title) <> ''),
 description text not null, scenario text not null, question text not null,
 minutes integer not null check (minutes between 1 and 1440),
 package_id text references packages(id)
);
insert into courses (id,title,description,scenario,question,minutes,package_id) values
 ('planning','Planning Tasks and Milestones','Organise work and communicate changes to milestones.',
  'Cleaning duplicate records could delay a fictional sales dashboard.','How would you update the plan and communicate the blocker?',45,'learning'),
 ('communication','Communicating Project Risks','Explain risks and next steps to a stakeholder.',
  'A milestone is due in two days and information is missing.','Write an early update outlining the impact and recovery plan.',30,null),
 ('updates','Writing Professional Project Updates','Write clear updates on progress and risks.',
  'Duplicate records may change the figures in a fictional sales report.','Write a concise progress update with next steps.',30,null);

-- One learning plan per signed demo student. Assessment contains the existing
-- reassessment answers, reviewer decisions and evidence. Eligibility is derived.
create table learning_plans (
 user_id text primary key,
 assessment_complete boolean not null default false,
 assessment jsonb not null check (jsonb_typeof(assessment) = 'object'),
 assessment_dispute jsonb not null check (jsonb_typeof(assessment_dispute) = 'object'),
 readiness_complete boolean not null default false,
 interest_submitted boolean not null default false,
 check (not readiness_complete or assessment_complete)
);
create table course_assignments (
 user_id text not null references learning_plans,
 course_id text not null references courses,
 primary key (user_id,course_id)
);
create table course_progress (
 user_id text not null, activity_id text not null,
 status text not null check(status in ('started','completed')),
 primary key(user_id,activity_id),
 foreign key(user_id,activity_id) references course_assignments(user_id,course_id)
);
create index assignments_by_course on course_assignments(course_id);
create index recent_orders on orders(created_at desc);

-- Only the server connects using this role. The schema stays outside the Data API.
revoke all on all tables in schema ezra_demo from public;
grant usage on schema ezra_demo to ezra_checkout;
grant select on packages,orders,purchases,entitlements,courses,learning_plans,course_assignments,course_progress to ezra_checkout;
grant insert(id,audience,name,description,inclusions,price,active), update(description,inclusions,price,active) on packages to ezra_checkout;
grant insert(user_id,package_id,provider,amount,currency,status), update(status,provider_order_id) on orders to ezra_checkout;
grant insert(order_id,user_id,package_id,provider_capture_id) on purchases to ezra_checkout;
grant insert(user_id,package_id,purchase_id) on entitlements to ezra_checkout;
grant insert(id,title,description,scenario,question,minutes,package_id), update(title,description,scenario,question,minutes,package_id) on courses to ezra_checkout;
grant insert(user_id,assessment,assessment_dispute), update(assessment_complete,assessment,assessment_dispute,readiness_complete,interest_submitted) on learning_plans to ezra_checkout;
grant insert(user_id,course_id) on course_assignments to ezra_checkout;
grant insert(user_id,activity_id,status), update(status), delete on course_progress to ezra_checkout;
commit;
