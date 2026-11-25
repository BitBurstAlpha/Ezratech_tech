-- Bootstrap for an empty project. Adopt existing databases through reviewed history repair.
CREATE ROLE ezra_checkout LOGIN;

CREATE SCHEMA ezra_demo;

CREATE TABLE ezra_demo.course_assignments (
    user_id text NOT NULL,
    course_id text NOT NULL
);

CREATE TABLE ezra_demo.course_progress (
    user_id text NOT NULL,
    activity_id text NOT NULL,
    status text NOT NULL,
    CONSTRAINT course_progress_status_check CHECK ((status = ANY (ARRAY['started'::text, 'completed'::text])))
);

CREATE TABLE ezra_demo.courses (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    scenario text NOT NULL,
    question text NOT NULL,
    minutes integer NOT NULL,
    package_id text,
    CONSTRAINT courses_id_check CHECK ((id ~ '^[a-z][a-z0-9-]{0,79}$'::text)),
    CONSTRAINT courses_minutes_check CHECK (((minutes >= 1) AND (minutes <= 1440))),
    CONSTRAINT courses_title_check CHECK ((btrim(title) <> ''::text))
);

CREATE TABLE ezra_demo.entitlements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    package_id text NOT NULL,
    purchase_id uuid NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    activated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT entitlements_status_check CHECK ((status = 'active'::text))
);

CREATE TABLE ezra_demo.learning_plans (
    user_id text NOT NULL,
    assessment_complete boolean DEFAULT false NOT NULL,
    assessment jsonb NOT NULL,
    assessment_dispute jsonb NOT NULL,
    readiness_complete boolean DEFAULT false NOT NULL,
    interest_submitted boolean DEFAULT false NOT NULL,
    CONSTRAINT learning_plans_assessment_check CHECK ((jsonb_typeof(assessment) = 'object'::text)),
    CONSTRAINT learning_plans_assessment_dispute_check CHECK ((jsonb_typeof(assessment_dispute) = 'object'::text)),
    CONSTRAINT learning_plans_check CHECK (((NOT readiness_complete) OR assessment_complete))
);

CREATE TABLE ezra_demo.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    package_id text NOT NULL,
    provider text NOT NULL,
    provider_order_id text,
    amount numeric(9,2) NOT NULL,
    currency text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT orders_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT orders_currency_check CHECK ((currency = 'GBP'::text)),
    CONSTRAINT orders_provider_check CHECK ((provider = ANY (ARRAY['paypal-sandbox'::text, 'presenter-fixture'::text]))),
    CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'completed'::text, 'failed'::text, 'cancelled'::text])))
);

CREATE TABLE ezra_demo.packages (
    id text NOT NULL,
    audience text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    inclusions text[] NOT NULL,
    price numeric(9,2),
    currency text DEFAULT 'GBP'::text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    CONSTRAINT packages_audience_check CHECK ((audience = ANY (ARRAY['student'::text, 'sme'::text]))),
    CONSTRAINT packages_check CHECK (
CASE
    WHEN (id = ANY (ARRAY['free'::text, 'starter'::text])) THEN ((price IS NOT NULL) AND (price = (0)::numeric))
    ELSE ((price IS NULL) OR (price > (0)::numeric))
END),
    CONSTRAINT packages_currency_check CHECK ((currency = 'GBP'::text))
);

CREATE TABLE ezra_demo.purchases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    user_id text NOT NULL,
    package_id text NOT NULL,
    provider_capture_id text NOT NULL,
    payment_status text DEFAULT 'completed'::text NOT NULL,
    purchased_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT purchases_payment_status_check CHECK ((payment_status = 'completed'::text))
);

ALTER TABLE ONLY ezra_demo.course_assignments
    ADD CONSTRAINT course_assignments_pkey PRIMARY KEY (user_id, course_id);

ALTER TABLE ONLY ezra_demo.course_progress
    ADD CONSTRAINT course_progress_pkey PRIMARY KEY (user_id, activity_id);

ALTER TABLE ONLY ezra_demo.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY ezra_demo.entitlements
    ADD CONSTRAINT entitlements_pkey PRIMARY KEY (id);

ALTER TABLE ONLY ezra_demo.entitlements
    ADD CONSTRAINT entitlements_purchase_id_key UNIQUE (purchase_id);

ALTER TABLE ONLY ezra_demo.entitlements
    ADD CONSTRAINT entitlements_user_id_package_id_key UNIQUE (user_id, package_id);

ALTER TABLE ONLY ezra_demo.learning_plans
    ADD CONSTRAINT learning_plans_pkey PRIMARY KEY (user_id);

ALTER TABLE ONLY ezra_demo.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY ezra_demo.orders
    ADD CONSTRAINT orders_provider_order_id_key UNIQUE (provider_order_id);

ALTER TABLE ONLY ezra_demo.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY ezra_demo.purchases
    ADD CONSTRAINT purchases_order_id_key UNIQUE (order_id);

ALTER TABLE ONLY ezra_demo.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);

ALTER TABLE ONLY ezra_demo.purchases
    ADD CONSTRAINT purchases_provider_capture_id_key UNIQUE (provider_capture_id);

CREATE INDEX assignments_by_course ON ezra_demo.course_assignments USING btree (course_id);

CREATE UNIQUE INDEX one_open_order ON ezra_demo.orders USING btree (user_id, package_id) WHERE (status = ANY (ARRAY['pending'::text, 'approved'::text]));

CREATE INDEX recent_orders ON ezra_demo.orders USING btree (created_at DESC);

ALTER TABLE ONLY ezra_demo.course_assignments
    ADD CONSTRAINT course_assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES ezra_demo.courses(id);

ALTER TABLE ONLY ezra_demo.course_assignments
    ADD CONSTRAINT course_assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES ezra_demo.learning_plans(user_id);

ALTER TABLE ONLY ezra_demo.course_progress
    ADD CONSTRAINT course_progress_user_id_activity_id_fkey FOREIGN KEY (user_id, activity_id) REFERENCES ezra_demo.course_assignments(user_id, course_id);

ALTER TABLE ONLY ezra_demo.courses
    ADD CONSTRAINT courses_package_id_fkey FOREIGN KEY (package_id) REFERENCES ezra_demo.packages(id);

ALTER TABLE ONLY ezra_demo.entitlements
    ADD CONSTRAINT entitlements_package_id_fkey FOREIGN KEY (package_id) REFERENCES ezra_demo.packages(id);

ALTER TABLE ONLY ezra_demo.entitlements
    ADD CONSTRAINT entitlements_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES ezra_demo.purchases(id);

ALTER TABLE ONLY ezra_demo.orders
    ADD CONSTRAINT orders_package_id_fkey FOREIGN KEY (package_id) REFERENCES ezra_demo.packages(id);

ALTER TABLE ONLY ezra_demo.purchases
    ADD CONSTRAINT purchases_order_id_fkey FOREIGN KEY (order_id) REFERENCES ezra_demo.orders(id);

ALTER TABLE ONLY ezra_demo.purchases
    ADD CONSTRAINT purchases_package_id_fkey FOREIGN KEY (package_id) REFERENCES ezra_demo.packages(id);

GRANT USAGE ON SCHEMA ezra_demo TO ezra_checkout;

GRANT SELECT ON TABLE ezra_demo.course_assignments TO ezra_checkout;

GRANT INSERT(user_id) ON TABLE ezra_demo.course_assignments TO ezra_checkout;

GRANT INSERT(course_id) ON TABLE ezra_demo.course_assignments TO ezra_checkout;

GRANT SELECT,DELETE ON TABLE ezra_demo.course_progress TO ezra_checkout;

GRANT INSERT(user_id) ON TABLE ezra_demo.course_progress TO ezra_checkout;

GRANT INSERT(activity_id) ON TABLE ezra_demo.course_progress TO ezra_checkout;

GRANT INSERT(status),UPDATE(status) ON TABLE ezra_demo.course_progress TO ezra_checkout;

GRANT SELECT ON TABLE ezra_demo.courses TO ezra_checkout;

GRANT INSERT(id) ON TABLE ezra_demo.courses TO ezra_checkout;

GRANT INSERT(title),UPDATE(title) ON TABLE ezra_demo.courses TO ezra_checkout;

GRANT INSERT(description),UPDATE(description) ON TABLE ezra_demo.courses TO ezra_checkout;

GRANT INSERT(scenario),UPDATE(scenario) ON TABLE ezra_demo.courses TO ezra_checkout;

GRANT INSERT(question),UPDATE(question) ON TABLE ezra_demo.courses TO ezra_checkout;

GRANT INSERT(minutes),UPDATE(minutes) ON TABLE ezra_demo.courses TO ezra_checkout;

GRANT INSERT(package_id),UPDATE(package_id) ON TABLE ezra_demo.courses TO ezra_checkout;

GRANT SELECT ON TABLE ezra_demo.entitlements TO ezra_checkout;

GRANT INSERT(user_id) ON TABLE ezra_demo.entitlements TO ezra_checkout;

GRANT INSERT(package_id) ON TABLE ezra_demo.entitlements TO ezra_checkout;

GRANT INSERT(purchase_id) ON TABLE ezra_demo.entitlements TO ezra_checkout;

GRANT SELECT ON TABLE ezra_demo.learning_plans TO ezra_checkout;

GRANT INSERT(user_id) ON TABLE ezra_demo.learning_plans TO ezra_checkout;

GRANT UPDATE(assessment_complete) ON TABLE ezra_demo.learning_plans TO ezra_checkout;

GRANT INSERT(assessment),UPDATE(assessment) ON TABLE ezra_demo.learning_plans TO ezra_checkout;

GRANT INSERT(assessment_dispute),UPDATE(assessment_dispute) ON TABLE ezra_demo.learning_plans TO ezra_checkout;

GRANT UPDATE(readiness_complete) ON TABLE ezra_demo.learning_plans TO ezra_checkout;

GRANT UPDATE(interest_submitted) ON TABLE ezra_demo.learning_plans TO ezra_checkout;

GRANT SELECT ON TABLE ezra_demo.orders TO ezra_checkout;

GRANT INSERT(user_id) ON TABLE ezra_demo.orders TO ezra_checkout;

GRANT INSERT(package_id) ON TABLE ezra_demo.orders TO ezra_checkout;

GRANT INSERT(provider) ON TABLE ezra_demo.orders TO ezra_checkout;

GRANT UPDATE(provider_order_id) ON TABLE ezra_demo.orders TO ezra_checkout;

GRANT INSERT(amount) ON TABLE ezra_demo.orders TO ezra_checkout;

GRANT INSERT(currency) ON TABLE ezra_demo.orders TO ezra_checkout;

GRANT INSERT(status),UPDATE(status) ON TABLE ezra_demo.orders TO ezra_checkout;

GRANT SELECT ON TABLE ezra_demo.packages TO ezra_checkout;

GRANT INSERT(id) ON TABLE ezra_demo.packages TO ezra_checkout;

GRANT INSERT(audience) ON TABLE ezra_demo.packages TO ezra_checkout;

GRANT INSERT(name) ON TABLE ezra_demo.packages TO ezra_checkout;

GRANT INSERT(description),UPDATE(description) ON TABLE ezra_demo.packages TO ezra_checkout;

GRANT INSERT(inclusions),UPDATE(inclusions) ON TABLE ezra_demo.packages TO ezra_checkout;

GRANT INSERT(price),UPDATE(price) ON TABLE ezra_demo.packages TO ezra_checkout;

GRANT INSERT(active),UPDATE(active) ON TABLE ezra_demo.packages TO ezra_checkout;

GRANT SELECT ON TABLE ezra_demo.purchases TO ezra_checkout;

GRANT INSERT(order_id) ON TABLE ezra_demo.purchases TO ezra_checkout;

GRANT INSERT(user_id) ON TABLE ezra_demo.purchases TO ezra_checkout;

GRANT INSERT(package_id) ON TABLE ezra_demo.purchases TO ezra_checkout;

GRANT INSERT(provider_capture_id) ON TABLE ezra_demo.purchases TO ezra_checkout;

-- Original catalogue defaults for new environments.
INSERT INTO ezra_demo.packages(id,audience,name,description,inclusions,price) values
 ('free','student','Free Access','Get started with your learning plan.',array['Student registration','Profile creation','Initial skills assessment','Available free learning resources'],0),
 ('learning','student','Learning Package','Continue your personalised development plan.',array['Access to required paid learning activities','Learning progress tracking','Relevant reassessment activities','Project readiness evaluation'],null),
 ('starter','sme','SME Starter','Prepare a project for review.',array['Company profile','Project draft creation','Project submission for review'],0),
 ('project','sme','SME Project Package','Manage an approved project through closure.',array['Agreed project service package','Candidate review after project approval','Project initiation workflow','SME workspace and supervision tools','Final project review and closure'],null);

INSERT INTO ezra_demo.courses (id,title,description,scenario,question,minutes,package_id) values
 ('planning','Planning Tasks and Milestones','Organise work and communicate changes to milestones.',
  'Cleaning duplicate records could delay a fictional sales dashboard.','How would you update the plan and communicate the blocker?',45,'learning'),
 ('communication','Communicating Project Risks','Explain risks and next steps to a stakeholder.',
  'A milestone is due in two days and information is missing.','Write an early update outlining the impact and recovery plan.',30,null),
 ('updates','Writing Professional Project Updates','Write clear updates on progress and risks.',
  'Duplicate records may change the figures in a fictional sales report.','Write a concise progress update with next steps.',30,null);
