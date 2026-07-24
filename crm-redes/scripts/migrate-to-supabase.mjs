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
