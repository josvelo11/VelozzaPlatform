-- crm-redes/supabase/schema.sql
-- Pauta Studio CRM — Postgres schema (Fase 0 migration from data/db.json)
-- Every table keeps the same field names as the JSON records it replaces
-- (camelCase JSON keys -> snake_case columns) so the migration script's
-- mapping is mechanical and reviewable.

create table if not exists users (
  id text primary key,
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('client','agency')),
  client_id text
);

create table if not exists clients (
  id text primary key,
  full_name text not null,
  business_sector text,
  phone text,
  email text,
  avatar_url text,
  social_links jsonb not null default '{}',
  plan jsonb not null default '{}'
);

create table if not exists socials (
  client_id text not null references clients(id) on delete cascade,
  platform text not null,
  connected boolean not null default false,
  handle text,
  followers text,
  reach text,
  primary key (client_id, platform)
);
create index if not exists idx_socials_client on socials(client_id);

create table if not exists content (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  title text,
  caption text,
  platforms jsonb not null default '[]',
  date date,
  format text,
  media_path text,        -- Supabase Storage object path (replaces media_data_url base64)
  media_name text,
  status text not null default 'draft',
  color text,
  created_by text,
  last_status_note text,
  updated_at timestamptz
);
create index if not exists idx_content_client on content(client_id);
create index if not exists idx_content_status on content(client_id, status);

create table if not exists messages (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  "from" text not null,
  text text,
  at text,
  created_at bigint
);
create index if not exists idx_messages_client on messages(client_id);

create table if not exists contacts (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  name text,
  email text,
  phone text,
  tag text,
  status text,
  source text,
  notes text,
  created_at text
);
create index if not exists idx_contacts_client on contacts(client_id);

create table if not exists deals (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  title text,
  contact text,
  value bigint,
  stage text,
  created_at text
);
create index if not exists idx_deals_client on deals(client_id);

create table if not exists tasks (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  title text,
  due text,
  priority text,
  done boolean not null default false,
  related_to text
);
create index if not exists idx_tasks_client on tasks(client_id);

create table if not exists campaigns (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  name text,
  channel text,
  status text,
  audience integer,
  sent integer,
  opens integer,
  clicks integer,
  date text
);
create index if not exists idx_campaigns_client on campaigns(client_id);

create table if not exists automations (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  name text,
  trigger text,
  action text,
  channel text,
  status text,
  enrolled integer default 0,
  completed integer default 0,
  template text,
  priority text,
  delay_days integer,
  notes text
);
create index if not exists idx_automations_client on automations(client_id);

create table if not exists conversations (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  contact_name text,
  channel text,
  status text,
  unread integer default 0,
  updated_at text,
  messages jsonb not null default '[]'
);
create index if not exists idx_conversations_client on conversations(client_id);

create table if not exists metrics_seed (
  id text primary key default 'global',
  follower_growth jsonb not null default '[]',
  reach_by_platform jsonb not null default '{}',
  engagement_rate numeric,
  open_rate numeric
);

create table if not exists activity_logs (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  action text,
  detail text,
  actor text,
  at text
);
create index if not exists idx_activity_client_at on activity_logs(client_id, at desc);

create table if not exists calendar_configs (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  name text,
  type text,
  duration_min integer,
  buffer_before_min integer,
  buffer_after_min integer,
  min_notice_hours integer,
  capacity integer,
  automation_on_booking boolean default false,
  agents jsonb not null default '[]',
  intake_fields jsonb not null default '[]',
  reminder_rules jsonb not null default '[]',
  weekly_hours jsonb not null default '{}',
  next_agent_index integer default 0
);
create index if not exists idx_calendar_configs_client on calendar_configs(client_id);

create table if not exists appointments (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  calendar_id text,
  calendar_name text,
  type text,
  status text,
  start_at timestamptz,
  duration_min integer,
  buffer_before_min integer,
  buffer_after_min integer,
  contact_name text,
  contact_email text,
  contact_phone text,
  notes text,
  intake_responses jsonb not null default '[]',
  assigned_agents jsonb not null default '[]',
  assigned_agent_names jsonb not null default '[]',
  reminders jsonb not null default '[]',
  created_at bigint
);
create index if not exists idx_appointments_client on appointments(client_id);

create table if not exists report_formulas (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  name text,
  op text,
  left_key text,
  right_key text,
  multiplier numeric default 1,
  decimals integer default 0,
  created_at text
);
create index if not exists idx_report_formulas_client on report_formulas(client_id);

create table if not exists client_templates (
  id text primary key,
  name text,
  base_name text,
  template_key text,
  version integer,
  source_client_id text,
  created_at text,
  created_by text,
  stats jsonb not null default '{}',
  payload jsonb not null default '{}',
  apply_history jsonb not null default '[]'
);

create table if not exists client_template_assignments (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  template_id text,
  template_name text,
  version integer,
  applied_at text,
  actor text
);
create index if not exists idx_template_assignments_client on client_template_assignments(client_id);

-- Storage bucket for content media (replaces content.mediaDataUrl base64)
insert into storage.buckets (id, name, public)
values ('crm-content-media', 'crm-content-media', false)
on conflict (id) do nothing;
