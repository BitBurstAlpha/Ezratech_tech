-- Apply once as migration owner in an isolated demo database.
begin;
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
create table course_progress (
 user_id text not null, activity_id text not null, status text not null check(status in ('started','completed')),
 primary key(user_id,activity_id)
);
grant usage on schema ezra_demo to ezra_checkout;
grant select on all tables in schema ezra_demo to ezra_checkout;
grant update(description,inclusions,price,active) on packages to ezra_checkout;
grant insert on orders,purchases,entitlements,course_progress to ezra_checkout;
grant update(status,provider_order_id) on orders to ezra_checkout;
grant update(status) on course_progress to ezra_checkout;
commit;
