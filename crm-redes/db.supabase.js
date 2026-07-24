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
