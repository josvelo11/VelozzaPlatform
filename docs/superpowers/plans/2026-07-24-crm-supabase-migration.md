# CRM Pauta Studio — Migración a Supabase (Fase 0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `crm-redes`'s JSON-file persistence (`data/db.json`) with real Postgres via the Supabase project already used by VelozzaPlatform's main site, and move `content.mediaDataUrl` base64 blobs to Supabase Storage — with zero change to the API routes/contracts that `public/agency.html` and `public/index.html` depend on, and zero data loss for the 10 existing clients (8 real, 1 demo, 1 test junk).

**Architecture:** Build the new persistence layer as a parallel module (`db.supabase.js`) implementing the exact same exported interface as today's `db.js`, alongside a Postgres schema (`supabase/schema.sql`) mapping all 18 JSON collections 1:1 with `clientId` indexes (the dominant multi-tenant scoping pattern already used by every route). A migration script (`scripts/migrate-to-supabase.mjs`) backfills the real `data/db.json` into the new schema, uploading `content.mediaDataUrl` blobs to Supabase Storage in the process. `server.js`'s 64 route handlers get converted from synchronous to `async/await` against the new layer only in the final task, after the migration has run and been verified — this repo's `db.js`/`data/db.json` are never deleted until David explicitly confirms the cutover works.

**Tech Stack:** `@supabase/supabase-js` (already a VelozzaPlatform dependency, add to `crm-redes/package.json`), Postgres (via existing Supabase project `qrwaogyflepbiapusjvx`), Node.js ESM (matches existing `crm-redes` codebase).

## Global Constraints

- Never modify or delete `data/db.json` until Task 5's verification step passes and David explicitly confirms.
- No API route path, request body shape, or response body shape may change — `agency.html`/`index.html` must work with zero code changes.
- `db.supabase.js` must export the identical function names/signatures as `db.js` today: `db()`, `save()`, `PLATFORMS`, `DEAL_STAGES`, `CONTENT_FORMATS`, `findUserByEmail(email)`, `findUserById(id)`, `findClient(id)`, `planFor(clientId)`, `metricsFor(clientId)`, `colorFor(platform)`, `uid()` — except every function that touches the DB becomes `async` (returns a Promise). This is the one interface change, and it's why `server.js` handlers must become `async` too (Task 5).
- All existing IDs (client IDs like `cli_dicolseg`, `cli_avila_internacional`, etc., and every `uid()`-generated id already in `data/db.json`) must be preserved exactly — JWTs already issued to real users embed `clientId`, and changing IDs would invalidate every active session and break `resolveClientId` scoping.
- Tasks 1-4 touch **only new files** — nothing in `server.js`, `db.js`, or `public/*.html` changes until Task 5, so the currently-running system keeps working untouched through Tasks 1-4.
- Task 5 requires a real `SUPABASE_SERVICE_ROLE_KEY` in `crm-redes/.env` (currently a placeholder in the VelozzaPlatform root `.env.local`, and crm-redes has no `.env.local` entry for it at all) — **do not attempt Task 5 without confirming this value is real**, a placeholder key will fail every Supabase write silently-then-loudly (401s) or, worse, if it happens to be a stray valid key for a *different* project, could write real client data into the wrong place. Verify with a trivial read query before running the migration.

---

### Task 1: Postgres schema for the 18 CRM entities

**Files:**
- Create: `crm-redes/supabase/schema.sql`

**Interfaces:**
- Produces: 18 tables, each with a `client_id text` column (nullable only for `users` where `role='agency'`) indexed for the multi-tenant scoping pattern `resolveClientId` already enforces in `server.js`. Table names are the snake_case of the JSON collection names (e.g. `calendarConfigs` → `calendar_configs`).

- [ ] **Step 1: Write the schema file**

```sql
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
```

- [ ] **Step 2: Commit**

```bash
cd ~/Documents/VelozzaPlatform
git add crm-redes/supabase/schema.sql
git commit -m "feat(crm): add Postgres schema for Supabase migration (Fase 0, not yet wired up)"
```

---

### Task 2: `db.supabase.js` — parallel async persistence layer

**Files:**
- Create: `crm-redes/db.supabase.js`
- Modify: `crm-redes/package.json` (add `@supabase/supabase-js` dependency)

**Interfaces:**
- Consumes: `supabase/schema.sql` table names from Task 1.
- Produces: async versions of every export `db.js` currently has, so Task 5 can swap the import with zero other code changes in `server.js` beyond adding `await`. Specifically: `getClient()` (new — returns/memoizes the Supabase client), `db()` (async, returns the same shaped object `{users, clients, socials, content, ...}` as today's synchronous `db()`, by querying all 18 tables), `save()` (becomes a no-op — see note below), `PLATFORMS`, `DEAL_STAGES`, `CONTENT_FORMATS` (unchanged constants), `findUserByEmail(email)` (async), `findUserById(id)` (async), `findClient(id)` (async), `planFor(clientId)` (async), `metricsFor(clientId)` (async), `colorFor(platform)` (unchanged, pure function), `uid()` (unchanged).

**Design note on `save()`:** today's `db.js` pattern is "mutate the in-memory object returned by `db()`, then call `save()` to flush the whole file." That pattern doesn't map to a real DB — each route should instead call a specific insert/update/delete against Supabase directly. Since Task 5 (not this task) touches `server.js`, this task provides `save()` as a documented no-op that logs a deprecation warning, so that if any `server.js` route accidentally still calls it after the Task 5 cutover, it fails loudly in logs instead of silently losing writes. Task 5 must replace every `db().X.push(...); save()` pattern with a real `insert`/`update`/`delete` call — this file only provides the primitives (see Step 2 for the full CRUD helper set Task 5 will use).

- [ ] **Step 1: Add the dependency**

```bash
cd ~/Documents/VelozzaPlatform/crm-redes
npm install @supabase/supabase-js
```

- [ ] **Step 2: Write `db.supabase.js`**

```js
// crm-redes/db.supabase.js
// Async persistence layer backed by Supabase Postgres — parallel to db.js,
// not yet wired into server.js (see Fase 0 migration plan, Task 5).
import { createClient } from '@supabase/supabase-js';

export const PLATFORMS = ['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'x'];
export const DEAL_STAGES = ['nuevo', 'contactado', 'propuesta', 'negociacion', 'ganado'];
export const CONTENT_FORMATS = ['reel', 'carrusel', 'flyer'];
const HEX = { facebook:'#1877F2', instagram:'#E1306C', tiktok:'#111111', youtube:'#FF0000', linkedin:'#0A66C2', x:'#111111' };

let client = null;
export function getClient() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || key === 'your_service_role_key_here') {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no configurados con valores reales en crm-redes/.env — ' +
      'ver Task 5 del plan de migración antes de usar db.supabase.js.'
    );
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

const TABLES = [
  'users','clients','socials','content','messages','contacts','deals','tasks',
  'campaigns','automations','conversations','activity_logs','calendar_configs',
  'appointments','report_formulas','client_templates','client_template_assignments',
];

// Maps snake_case DB rows back to the camelCase shape server.js already expects.
function toCamel(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  return out;
}

export async function db() {
  const sb = getClient();
  const result = {};
  for (const table of TABLES) {
    const { data, error } = await sb.from(table).select('*');
    if (error) throw new Error(`db.supabase.js: fallo leyendo tabla ${table}: ${error.message}`);
    result[camelTableName(table)] = data.map(toCamel);
  }
  const { data: metricsRows, error: metricsErr } = await sb.from('metrics_seed').select('*').eq('id', 'global').maybeSingle();
  if (metricsErr) throw new Error(`db.supabase.js: fallo leyendo metrics_seed: ${metricsErr.message}`);
  result.metricsSeed = metricsRows ? toCamel(metricsRows) : {};
  return result;
}

function camelTableName(table) {
  return table.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function save() {
  console.warn(
    '[db.supabase.js] save() fue llamado pero es un no-op — cada ruta debe usar ' +
    'insert/update/delete directo de Supabase. Si ves este mensaje después del cutover ' +
    '(Task 5), hay una ruta en server.js que no fue migrada correctamente.'
  );
}

export async function findUserByEmail(email) {
  const sb = getClient();
  const { data, error } = await sb.from('users').select('*').ilike('email', email).maybeSingle();
  if (error) throw new Error(`findUserByEmail: ${error.message}`);
  return data ? toCamel(data) : undefined;
}

export async function findUserById(id) {
  const sb = getClient();
  const { data, error } = await sb.from('users').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`findUserById: ${error.message}`);
  return data ? toCamel(data) : undefined;
}

export async function findClient(id) {
  const sb = getClient();
  const { data, error } = await sb.from('clients').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`findClient: ${error.message}`);
  return data ? toCamel(data) : undefined;
}

export async function planFor(clientId) {
  const c = await findClient(clientId);
  if (!c) return null;
  const sb = getClient();
  const { data: items, error } = await sb.from('content').select('platforms,format,status').eq('client_id', clientId).in('status', ['approved', 'published']);
  if (error) throw new Error(`planFor: ${error.message}`);
  const used = items.length;
  const perPlatform = {};
  const perFormat = {};
  for (const p of PLATFORMS) perPlatform[p] = items.filter(i => (i.platforms || []).includes(p)).length;
  for (const f of CONTENT_FORMATS) perFormat[f] = items.filter(i => (i.format || 'flyer') === f).length;
  const capFormat = { reel: 4, carrusel: 4, flyer: 4, ...(c.plan?.capFormat || {}) };
  return { ...c.plan, capFormat, used, perPlatform, perFormat };
}

export async function metricsFor(clientId) {
  const sb = getClient();
  const [{ data: metricsRow }, { data: contacts }, { data: deals }, { data: content }, { data: automations }, { data: conversations }] = await Promise.all([
    sb.from('metrics_seed').select('*').eq('id', 'global').maybeSingle(),
    sb.from('contacts').select('*').eq('client_id', clientId),
    sb.from('deals').select('*').eq('client_id', clientId),
    sb.from('content').select('*').eq('client_id', clientId),
    sb.from('automations').select('*').eq('client_id', clientId),
    sb.from('conversations').select('*').eq('client_id', clientId),
  ]);
  const m = metricsRow ? toCamel(metricsRow) : {};
  const thisMonth = new Date(); thisMonth.setDate(1);
  const newContacts = (contacts || []).filter(c => new Date(c.created_at) >= thisMonth).length;
  const wonValue = (deals || []).filter(x => x.stage === 'ganado').reduce((s, x) => s + (x.value || 0), 0);
  const pipelineValue = (deals || []).filter(x => x.stage !== 'ganado' && x.stage !== 'perdido').reduce((s, x) => s + (x.value || 0), 0);
  const contentByStatus = {};
  for (const s of ['approved','pending','draft','rejected','published']) {
    contentByStatus[s] = (content || []).filter(c => c.status === s).length;
  }
  return {
    followerGrowth: m.followerGrowth || [],
    reachByPlatform: m.reachByPlatform || {},
    engagementRate: m.engagementRate || 0,
    openRate: m.openRate || 0,
    audienceTotal: (contacts || []).length,
    newContactsThisMonth: newContacts,
    leads: (contacts || []).filter(c => c.status === 'lead' || c.status === 'oportunidad').length,
    customers: (contacts || []).filter(c => c.status === 'cliente').length,
    wonValue, pipelineValue,
    openDeals: (deals || []).filter(x => x.stage !== 'ganado' && x.stage !== 'perdido').length,
    activeAutomations: (automations || []).filter(a => a.status === 'activa').length,
    unreadConversations: (conversations || []).filter(c => c.unread > 0).length,
    contentByStatus,
  };
}

export const colorFor = (platform) => HEX[platform] || '#888';
export const uid = () => crypto.randomUUID();
```

- [ ] **Step 3: Sanity-check the file loads (no live DB call yet)**

Run: `node --input-type=module -e "import('./db.supabase.js').then(() => console.log('OK: módulo carga sin errores de sintaxis'))"` from `crm-redes/`
Expected: `OK: módulo carga sin errores de sintaxis` (this only checks the module parses/imports cleanly — `getClient()` isn't called yet, so the missing real key doesn't block this step)

- [ ] **Step 4: Commit**

```bash
cd ~/Documents/VelozzaPlatform
git add crm-redes/db.supabase.js crm-redes/package.json crm-redes/package-lock.json
git commit -m "feat(crm): add parallel Supabase-backed db layer (not wired into server.js yet)"
```

---

### Task 3: Migration script (`data/db.json` → Supabase)

**Files:**
- Create: `crm-redes/scripts/migrate-to-supabase.mjs`

**Interfaces:**
- Consumes: `getClient()` from `db.supabase.js` (Task 2), the real `crm-redes/data/db.json` file, `supabase/schema.sql` table names (Task 1).
- Produces: a populated Supabase database, plus uploaded objects in the `crm-content-media` Storage bucket. Prints a summary report; does not delete `data/db.json`.

- [ ] **Step 1: Write the migration script**

```js
// crm-redes/scripts/migrate-to-supabase.mjs
// One-time backfill: data/db.json -> Supabase. Safe to re-run (upserts by id).
// Does NOT delete or modify data/db.json. Run with: node scripts/migrate-to-supabase.mjs
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getClient } from '../db.supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

function snake(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k.replace(/[A-Z]/g, m => '_' + m.toLowerCase())] = v;
  }
  return out;
}

async function upsertAll(sb, table, rows, { idField = 'id' } = {}) {
  if (!rows || rows.length === 0) return { table, count: 0 };
  const payload = rows.map(snake);
  const { error } = await sb.from(table).upsert(payload, { onConflict: idField });
  if (error) throw new Error(`Migración falló en tabla ${table}: ${error.message}`);
  return { table, count: rows.length };
}

async function migrateContentMedia(sb, contentRows) {
  let uploaded = 0;
  for (const item of contentRows) {
    if (!item.mediaDataUrl) continue;
    const match = /^data:(.+);base64,(.+)$/.exec(item.mediaDataUrl);
    if (!match) continue;
    const [, mime, b64] = match;
    const ext = mime.split('/')[1] || 'bin';
    const objectPath = `${item.clientId}/${item.id}.${ext}`;
    const buffer = Buffer.from(b64, 'base64');
    const { error } = await sb.storage.from('crm-content-media').upload(objectPath, buffer, { contentType: mime, upsert: true });
    if (error) throw new Error(`Migración de media falló para content ${item.id}: ${error.message}`);
    item._mediaPath = objectPath; // used below when upserting the content table
    uploaded++;
  }
  return uploaded;
}

async function main() {
  if (!fs.existsSync(DB_FILE)) throw new Error(`No se encontró ${DB_FILE}`);
  const raw = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const sb = getClient();

  console.log('Verificando conexión a Supabase...');
  const { error: pingErr } = await sb.from('clients').select('id').limit(1);
  if (pingErr) throw new Error(`No se pudo conectar a Supabase (revisa SUPABASE_SERVICE_ROLE_KEY): ${pingErr.message}`);
  console.log('OK — conexión válida.\n');

  const results = [];
  results.push(await upsertAll(sb, 'users', raw.users));
  results.push(await upsertAll(sb, 'clients', raw.clients));

  // socials is keyed by clientId -> {platform: {...}}, not an array — flatten it.
  const socialRows = [];
  for (const [clientId, platforms] of Object.entries(raw.socials || {})) {
    for (const [platform, info] of Object.entries(platforms)) {
      socialRows.push({ clientId, platform, ...info });
    }
  }
  if (socialRows.length) {
    const { error } = await sb.from('socials').upsert(socialRows.map(snake), { onConflict: 'client_id,platform' });
    if (error) throw new Error(`Migración falló en tabla socials: ${error.message}`);
    results.push({ table: 'socials', count: socialRows.length });
  }

  console.log(`Subiendo media de ${(raw.content || []).length} piezas de contenido a Storage...`);
  const uploaded = await migrateContentMedia(sb, raw.content || []);
  console.log(`OK — ${uploaded} archivo(s) subidos.\n`);

  const contentRows = (raw.content || []).map(({ mediaDataUrl, _mediaPath, ...rest }) => ({
    ...rest,
    mediaPath: _mediaPath || null,
  }));
  results.push(await upsertAll(sb, 'content', contentRows));

  results.push(await upsertAll(sb, 'messages', raw.messages));
  results.push(await upsertAll(sb, 'contacts', raw.contacts));
  results.push(await upsertAll(sb, 'deals', raw.deals));
  results.push(await upsertAll(sb, 'tasks', raw.tasks));
  results.push(await upsertAll(sb, 'campaigns', raw.campaigns));
  results.push(await upsertAll(sb, 'automations', raw.automations));
  results.push(await upsertAll(sb, 'conversations', raw.conversations));
  results.push(await upsertAll(sb, 'activity_logs', raw.activityLogs));
  results.push(await upsertAll(sb, 'calendar_configs', raw.calendarConfigs));
  results.push(await upsertAll(sb, 'appointments', raw.appointments));
  results.push(await upsertAll(sb, 'report_formulas', raw.reportFormulas));
  results.push(await upsertAll(sb, 'client_templates', raw.clientTemplates));
  results.push(await upsertAll(sb, 'client_template_assignments', raw.clientTemplateAssignments));

  if (raw.metricsSeed) {
    const { error } = await sb.from('metrics_seed').upsert({ id: 'global', ...snake(raw.metricsSeed) }, { onConflict: 'id' });
    if (error) throw new Error(`Migración falló en metrics_seed: ${error.message}`);
    results.push({ table: 'metrics_seed', count: 1 });
  }

  console.log('=== Resumen de migración ===');
  for (const r of results) console.log(`  ${r.table}: ${r.count} registro(s)`);
  console.log('\ndata/db.json NO fue modificado ni borrado. Verifica los datos en Supabase antes del cutover (Task 5).');
}

main().catch(err => {
  console.error('MIGRACIÓN FALLÓ:', err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Commit (script written, NOT executed)**

```bash
cd ~/Documents/VelozzaPlatform
git add crm-redes/scripts/migrate-to-supabase.mjs
git commit -m "feat(crm): add data migration script to Supabase (not run yet, needs real service role key)"
```

**Do not run this script as part of this task.** Running it is Task 5, Step 1, and requires David to have provided a real `SUPABASE_SERVICE_ROLE_KEY` first (see Global Constraints).

---

### Task 4: Verification harness for the cutover

**Files:**
- Create: `crm-redes/scripts/verify-parity.mjs`

**Interfaces:**
- Consumes: both `db.js` (existing, JSON-backed) and `db.supabase.js` (Task 2) in the same process, compares their output for every read function.
- Produces: a pass/fail report proving `db.supabase.js` returns data equivalent to `db.js` for the real dataset, before anyone touches `server.js`.

- [ ] **Step 1: Write the parity check script**

```js
// crm-redes/scripts/verify-parity.mjs
// Compares db.js (JSON) vs db.supabase.js (Postgres) output for the same
// real clientIds — run AFTER migrate-to-supabase.mjs, BEFORE Task 5's cutover.
import 'dotenv/config';
import * as jsonDb from '../db.js';
import * as supaDb from '../db.supabase.js';

const REAL_CLIENT_IDS = [
  'cli_demo', 'cli_dicolseg', 'cli_avila_internacional', 'cli_adriana_ortega',
  'cli_lucy_moreno', 'cli_star_light_garden', 'cli_juan_marulanda',
  'cli_fiesta_auto_insurance', 'cli_seguros_diterich',
];

function diffKeys(a, b, label) {
  const ak = Object.keys(a || {}).sort();
  const bk = Object.keys(b || {}).sort();
  if (JSON.stringify(ak) !== JSON.stringify(bk)) {
    console.error(`  ✗ ${label}: claves distintas.\n    JSON:     ${ak.join(',')}\n    Supabase: ${bk.join(',')}`);
    return false;
  }
  return true;
}

async function main() {
  let failures = 0;
  for (const clientId of REAL_CLIENT_IDS) {
    console.log(`\nCliente ${clientId}:`);
    const jsonClient = jsonDb.findClient(clientId);
    const supaClient = await supaDb.findClient(clientId);
    if (!jsonClient && !supaClient) { console.log('  (no existe en ninguno de los dos — ok, se salta)'); continue; }
    if (!jsonClient || !supaClient) { console.error(`  ✗ existe en uno pero no en el otro`); failures++; continue; }
    if (!diffKeys(jsonClient, supaClient, 'findClient')) failures++;
    if (jsonClient.fullName !== supaClient.fullName) { console.error(`  ✗ fullName distinto: "${jsonClient.fullName}" vs "${supaClient.fullName}"`); failures++; }
    else console.log(`  ✓ findClient coincide (${jsonClient.fullName})`);

    const jsonPlan = jsonDb.planFor(clientId);
    const supaPlan = await supaDb.planFor(clientId);
    if (JSON.stringify(jsonPlan) !== JSON.stringify(supaPlan)) {
      console.error(`  ✗ planFor difiere:\n    JSON:     ${JSON.stringify(jsonPlan)}\n    Supabase: ${JSON.stringify(supaPlan)}`);
      failures++;
    } else console.log('  ✓ planFor coincide');

    const jsonMetrics = jsonDb.metricsFor(clientId);
    const supaMetrics = await supaDb.metricsFor(clientId);
    if (jsonMetrics.audienceTotal !== supaMetrics.audienceTotal || jsonMetrics.openDeals !== supaMetrics.openDeals) {
      console.error(`  ✗ metricsFor difiere en audienceTotal/openDeals:\n    JSON:     ${JSON.stringify(jsonMetrics)}\n    Supabase: ${JSON.stringify(supaMetrics)}`);
      failures++;
    } else console.log('  ✓ metricsFor coincide (audienceTotal, openDeals)');
  }

  console.log(failures === 0 ? '\n=== TODO COINCIDE — listo para Task 5 ===' : `\n=== ${failures} DIFERENCIA(S) — NO proceder con Task 5 hasta resolver ===`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
```

- [ ] **Step 2: Commit (script written, not runnable yet — needs Task 3's migration to have run first)**

```bash
cd ~/Documents/VelozzaPlatform
git add crm-redes/scripts/verify-parity.mjs
git commit -m "feat(crm): add parity verification script for Supabase cutover"
```

---

### Task 5: [BLOCKED — needs real `SUPABASE_SERVICE_ROLE_KEY` from David] Cutover

**Do not start this task until David has provided a real Service Role Key** (Supabase Dashboard → project `qrwaogyflepbiapusjvx` → Settings → API → "service_role secret") and it's set in `crm-redes/.env` as `SUPABASE_SERVICE_ROLE_KEY` plus `SUPABASE_URL=https://qrwaogyflepbiapusjvx.supabase.co`.

**Files:**
- Modify: `crm-redes/server.js` (all 64 route handlers — add `async`, replace every `db().X` synchronous access with `await` calls against `db.supabase.js`'s exports, replace `save()` calls with real per-route insert/update/delete)
- Modify: `crm-redes/data/db.json` — NOT deleted, renamed to `data/db.json.pre-supabase-backup` as the final step only

Once unblocked, this task is large enough (64 routes) to warrant its own follow-up plan written fresh at that time, informed by whatever `verify-parity.mjs` (Task 4) reports after a real migration run — do not pre-plan the exact server.js diff now against a schema that hasn't been validated against real data yet.

- [ ] **Step 1: Run the migration**

```bash
cd ~/Documents/VelozzaPlatform/crm-redes
node scripts/migrate-to-supabase.mjs
```
Expected: `=== Resumen de migración ===` with non-zero counts for `users`, `clients`, `contacts`, `deals`, `tasks`, etc., and no `MIGRACIÓN FALLÓ` line.

- [ ] **Step 2: Run the parity check**

```bash
node scripts/verify-parity.mjs
```
Expected: `=== TODO COINCIDE — listo para Task 5 ===`. If it reports differences, stop and fix the schema/migration script — do not proceed to Step 3.

- [ ] **Step 3: Write a fresh, detailed plan for the server.js async conversion** (64 routes, real diffs) using this plan's Global Constraints and Task 4's parity results as input, then execute it with `verify-parity.mjs` plus a manual Playwright pass over `agency.html`/`index.html` as the acceptance gate before renaming `data/db.json`.
