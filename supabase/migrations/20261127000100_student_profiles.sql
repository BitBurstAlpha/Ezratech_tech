create schema if not exists ezra_profiles;
revoke all on schema ezra_profiles from public;
create table ezra_profiles.student_profiles (
  user_id text primary key,
  profile jsonb not null check (jsonb_typeof(profile) = 'object'),
  version integer not null default 1 check (version > 0)
);
revoke all on ezra_profiles.student_profiles from public, anon, authenticated;
grant usage on schema ezra_profiles to ezra_checkout;
grant select, insert, update(profile,version) on ezra_profiles.student_profiles to ezra_checkout;
