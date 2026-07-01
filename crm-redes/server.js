// ============================================================================
//  server.js — Backend compartido (Módulo Cliente + Módulo Agencia)
//  ----------------------------------------------------------------------------
//  Levanta una API REST y sirve los dos portales desde /public.
//  La "hiperconexión" vive aquí: ambos módulos pegan a las MISMAS rutas y la
//  MISMA base de datos, así que lo que uno escribe el otro lo ve al instante.
//
//  Arranque:   npm install   →   npm start   →   http://localhost:4000
// ============================================================================
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  db, save, PLATFORMS, DEAL_STAGES, uid, colorFor,
  CONTENT_FORMATS, findUserByEmail, findUserById, findClient, planFor, metricsFor,
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 4000;
const SECRET = process.env.JWT_SECRET || 'dev-secret-cambia-esto';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
//  AUTENTICACIÓN
// ---------------------------------------------------------------------------
function sign(user) {
  return jwt.sign({ uid: user.id, role: user.role, clientId: user.clientId }, SECRET, { expiresIn: '7d' });
}

// Middleware: exige token válido y deja req.user listo.
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Falta el token de sesión' });
  try {
    const payload = jwt.verify(token, SECRET);
    const user = findUserById(payload.uid);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
}

// Solo agencia.
function agencyOnly(req, res, next) {
  if (req.user.role !== 'agency') return res.status(403).json({ error: 'Acceso solo para la agencia' });
  next();
}

const ROLE_CAPABILITIES = {
  owner: {
    'clients.manage': true,
    'content.write': true,
    'content.approve': true,
    'reports.manage': true,
    'templates.manage': true,
    'campaigns.manage': true,
    'calendar.manage': true,
    'automation.manage': true,
    'ops.view': true,
  },
  strategist: {
    'clients.manage': false,
    'content.write': true,
    'content.approve': true,
    'reports.manage': true,
    'templates.manage': true,
    'campaigns.manage': false,
    'calendar.manage': false,
    'automation.manage': true,
    'ops.view': true,
  },
  trafficker: {
    'clients.manage': false,
    'content.write': true,
    'content.approve': false,
    'reports.manage': false,
    'templates.manage': false,
    'campaigns.manage': true,
    'calendar.manage': true,
    'automation.manage': true,
    'ops.view': true,
  },
  closer: {
    'clients.manage': false,
    'content.write': false,
    'content.approve': false,
    'reports.manage': false,
    'templates.manage': false,
    'campaigns.manage': false,
    'calendar.manage': true,
    'automation.manage': false,
    'ops.view': true,
  },
};

function resolveAgencyRole(req) {
  const incoming = String(req.headers['x-agency-role'] || 'owner').trim().toLowerCase();
  return ROLE_CAPABILITIES[incoming] ? incoming : 'owner';
}

function hasCapability(req, capability) {
  if (req.user.role !== 'agency') return false;
  const role = resolveAgencyRole(req);
  return !!ROLE_CAPABILITIES[role]?.[capability];
}

function requireCapability(capability) {
  return (req, res, next) => {
    if (!hasCapability(req, capability)) {
      return res.status(403).json({ error: `Tu rol no tiene permiso: ${capability}` });
    }
    return next();
  };
}

function normalizeSocialHandle(value, platform) {
  let v = String(value || '').trim();
  if (!v) return '';

  v = v.replace(/^https?:\/\/(www\.)?/i, '');
  v = v.replace(/\?.*$/, '').replace(/#.*$/, '').replace(/\/+$/, '');
  if (platform === 'instagram') v = v.replace(/^instagram\.com\//i, '');
  if (platform === 'facebook') v = v.replace(/^facebook\.com\//i, '');
  if (platform === 'tiktok') v = v.replace(/^tiktok\.com\/@?/i, '');
  if (platform === 'youtube') v = v.replace(/^youtube\.com\/(?:@|channel\/|c\/|user\/)?/i, '');
  if (platform === 'linkedin') v = v.replace(/^linkedin\.com\/(?:company\/|in\/)?/i, '');
  if (platform === 'x') v = v.replace(/^(?:x|twitter)\.com\//i, '');

  v = v.replace(/^@/, '').trim();
  return v;
}

function normalizeSocialLinks(input = {}) {
  const defaults = { facebook: '', instagram: '', tiktok: '', youtube: '', linkedin: '', x: '' };
  const merged = { ...defaults, ...(input || {}) };
  return Object.fromEntries(Object.keys(defaults).map((platform) => [platform, normalizeSocialHandle(merged[platform], platform)]));
}

function syncClientSocialProfiles(clientId, links) {
  if (!db().socials[clientId]) db().socials[clientId] = {};
  PLATFORMS.forEach((platform) => {
    const current = db().socials[clientId][platform] || { connected: false, handle: '', followers: '—', reach: '—' };
    const handle = links?.[platform] || '';
    db().socials[clientId][platform] = {
      ...current,
      handle,
      connected: !!handle,
    };
  });
}

function logActivity({ clientId, action, detail, actor = 'agency' }, persist = true) {
  const entry = {
    id: uid(),
    clientId,
    action,
    detail,
    actor,
    at: new Date().toISOString(),
  };
  db().activityLogs ||= [];
  db().activityLogs.unshift(entry);
  db().activityLogs = db().activityLogs.slice(0, 250);
  if (persist) save();
  return entry;
}

const CALENDAR_TYPES = ['individual', 'round_robin', 'evento', 'colectivo'];
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function ensureCalendarCollections() {
  db().calendarConfigs ||= [];
  db().appointments ||= [];
}

function parseDateTime(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function hhmmToMinutes(hhmm) {
  const [h, m] = String(hhmm || '00:00').split(':').map(Number);
  return (h * 60) + m;
}

function dateMinutes(date) {
  return (date.getHours() * 60) + date.getMinutes();
}

function appointmentBounds(appointment) {
  const start = parseDateTime(appointment.startAt);
  const duration = Number(appointment.durationMin) || 60;
  const end = new Date(start.getTime() + (duration * 60000));
  return { start, end };
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function normalizeCalendar(payload, existing = {}) {
  const defaultHours = { mon: [['09:00', '18:00']], tue: [['09:00', '18:00']], wed: [['09:00', '18:00']], thu: [['09:00', '18:00']], fri: [['09:00', '18:00']], sat: [], sun: [] };
  const normalized = {
    id: existing.id || uid(),
    clientId: existing.clientId || payload.clientId,
    name: payload.name ?? existing.name ?? 'Calendario principal',
    type: CALENDAR_TYPES.includes(payload.type) ? payload.type : (existing.type || 'individual'),
    durationMin: Number(payload.durationMin ?? existing.durationMin ?? 60) || 60,
    bufferBeforeMin: Number(payload.bufferBeforeMin ?? existing.bufferBeforeMin ?? 0) || 0,
    bufferAfterMin: Number(payload.bufferAfterMin ?? existing.bufferAfterMin ?? 0) || 0,
    minNoticeHours: Number(payload.minNoticeHours ?? existing.minNoticeHours ?? 0) || 0,
    capacity: Math.max(1, Number(payload.capacity ?? existing.capacity ?? 1) || 1),
    automationOnBooking: payload.automationOnBooking !== undefined ? !!payload.automationOnBooking : (existing.automationOnBooking ?? true),
    agents: Array.isArray(payload.agents) ? payload.agents : (existing.agents || [{ id: 'ag_1', name: 'Agente principal' }]),
    intakeFields: Array.isArray(payload.intakeFields) ? payload.intakeFields : (existing.intakeFields || []),
    reminderRules: Array.isArray(payload.reminderRules) ? payload.reminderRules : (existing.reminderRules || [{ id: 'r1', offsetMin: 0, channel: 'email' }, { id: 'r2', offsetMin: 1440, channel: 'email' }, { id: 'r3', offsetMin: 120, channel: 'whatsapp' }]),
    weeklyHours: payload.weeklyHours || existing.weeklyHours || defaultHours,
    nextAgentIndex: Number(existing.nextAgentIndex || 0) || 0,
  };
  return normalized;
}

function isWithinWeeklyHours(calendar, startAt, endAt) {
  const dayKey = DAY_KEYS[startAt.getDay()];
  const ranges = (calendar.weeklyHours && calendar.weeklyHours[dayKey]) || [];
  if (!ranges.length) return false;
  const startMin = dateMinutes(startAt);
  const endMin = dateMinutes(endAt);
  return ranges.some(([from, to]) => startMin >= hhmmToMinutes(from) && endMin <= hhmmToMinutes(to));
}

function pickAssignedAgents(calendar) {
  const agents = Array.isArray(calendar.agents) ? calendar.agents : [];
  if (!agents.length) return [];
  if (calendar.type === 'colectivo') return agents;
  if (calendar.type === 'round_robin') {
    const idx = Number(calendar.nextAgentIndex || 0) % agents.length;
    const selected = agents[idx];
    calendar.nextAgentIndex = (idx + 1) % agents.length;
    return [selected];
  }
  return [agents[0]];
}

function hasAgentConflict({ clientId, calendar, startAt, endAt, assignedAgents, excludeAppointmentId }) {
  if (!assignedAgents.length) return false;
  const appointments = (db().appointments || []).filter(a => a.clientId === clientId && a.status !== 'cancelada' && a.id !== excludeAppointmentId);
  const incomingStart = new Date(startAt.getTime() - ((Number(calendar.bufferBeforeMin) || 0) * 60000));
  const incomingEnd = new Date(endAt.getTime() + ((Number(calendar.bufferAfterMin) || 0) * 60000));
  const ids = new Set(assignedAgents.map(a => a.id));
  return appointments.some(a => {
    const bookedAgents = Array.isArray(a.assignedAgents) ? a.assignedAgents : [];
    if (!bookedAgents.some(ag => ids.has(ag.id))) return false;
    const { start, end } = appointmentBounds(a);
    const bookedStart = new Date(start.getTime() - ((Number(a.bufferBeforeMin) || 0) * 60000));
    const bookedEnd = new Date(end.getTime() + ((Number(a.bufferAfterMin) || 0) * 60000));
    return rangesOverlap(incomingStart, incomingEnd, bookedStart, bookedEnd);
  });
}

function ensureAdvancedCollections() {
  db().reportFormulas ||= [];
  db().clientTemplates ||= [];
  db().clientTemplateAssignments ||= [];
}

const CONTENT_STATUS_TRANSITIONS = {
  draft: ['pending'],
  pending: ['approved', 'rejected'],
  approved: ['published', 'rejected'],
  rejected: ['draft', 'pending'],
  published: [],
};

function setContentStatus(item, nextStatus, { actor = 'agency', reason = '' } = {}) {
  if (!Object.prototype.hasOwnProperty.call(CONTENT_STATUS_TRANSITIONS, nextStatus)) {
    const error = new Error('Estado de contenido inválido');
    error.status = 400;
    throw error;
  }
  const allowed = CONTENT_STATUS_TRANSITIONS[item.status] || [];
  if (!allowed.includes(nextStatus)) {
    const error = new Error(`Transición no permitida: ${item.status} → ${nextStatus}`);
    error.status = 409;
    throw error;
  }
  item.status = nextStatus;
  item.updatedAt = new Date().toISOString();
  if (reason) item.lastStatusNote = String(reason).slice(0, 300);
  logActivity({
    clientId: item.clientId,
    action: 'content-status-changed',
    actor,
    detail: `Pieza "${item.title}" pasó a ${nextStatus}${reason ? ` (${reason})` : ''}`,
  }, false);
  return item;
}

function metricFieldValue(metrics, key) {
  const value = metrics[key];
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function computeFormulaValue(formula, metrics) {
  const left = metricFieldValue(metrics, formula.left);
  const right = metricFieldValue(metrics, formula.right);
  const multiplier = Number(formula.multiplier || 1);
  const decimals = Math.max(0, Math.min(Number(formula.decimals ?? 2), 6));
  let value = 0;
  if (formula.op === 'sum') value = left + right;
  else if (formula.op === 'diff') value = left - right;
  else if (formula.op === 'product') value = left * right;
  else value = right === 0 ? 0 : (left / right);
  const scaled = value * multiplier;
  return Number(scaled.toFixed(decimals));
}

function normalizeTemplateName(name, sourceClient) {
  const base = String(name || '').trim();
  if (base) return base;
  return `Snapshot ${sourceClient?.fullName || 'cliente'} ${new Date().toISOString().slice(0, 10)}`;
}

function applyTemplateToClient({ template, targetClient, actor }) {
  const targetClientId = targetClient.id;
  ensureAdvancedCollections();
  ensureCalendarCollections();

  targetClient.plan = JSON.parse(JSON.stringify(template.payload.plan || targetClient.plan || {}));
  targetClient.socialLinks = JSON.parse(JSON.stringify(template.payload.socialLinks || targetClient.socialLinks || {}));

  db().socials[targetClientId] ||= {};
  for (const platform of PLATFORMS) {
    const current = db().socials[targetClientId][platform] || { connected: false, handle: '', followers: '—', reach: '—' };
    const handle = targetClient.socialLinks?.[platform] || current.handle || '';
    db().socials[targetClientId][platform] = { ...current, handle, connected: !!handle };
  }

  db().calendarConfigs = (db().calendarConfigs || []).filter(c => c.clientId !== targetClientId);
  (template.payload.calendars || []).forEach((calendar) => {
    db().calendarConfigs.push(normalizeCalendar({ ...calendar, id: uid(), clientId: targetClientId, nextAgentIndex: 0 }));
  });

  db().automations = (db().automations || []).filter(a => a.clientId !== targetClientId);
  (template.payload.automations || []).forEach((automation) => {
    db().automations.push({
      ...automation,
      id: uid(),
      clientId: targetClientId,
      enrolled: 0,
      completed: 0,
      status: 'activa',
    });
  });

  template.applyHistory ||= [];
  template.applyHistory.unshift({
    id: uid(),
    targetClientId,
    targetClientName: targetClient.fullName,
    at: new Date().toISOString(),
    actor,
  });
  template.applyHistory = template.applyHistory.slice(0, 100);

  db().clientTemplateAssignments.unshift({
    id: uid(),
    clientId: targetClientId,
    templateId: template.id,
    templateName: template.name,
    version: Number(template.version || 1),
    appliedAt: new Date().toISOString(),
    actor,
  });
  db().clientTemplateAssignments = db().clientTemplateAssignments.slice(0, 1000);

  logActivity({
    clientId: targetClientId,
    action: 'template-applied',
    detail: `Se aplicó template "${template.name}"`,
  }, false);
}

function normalizeImportedContentRows(rows, maxRows = 300) {
  const created = [];
  const errors = [];
  rows.slice(0, maxRows).forEach((raw, index) => {
    const title = String(raw.title || '').trim();
    const caption = String(raw.caption || '').trim();
    const date = String(raw.date || '').trim();
    const rawPlatforms = Array.isArray(raw.platforms)
      ? raw.platforms
      : String(raw.platforms || '').split(/[;,|]/g).map(p => p.trim().toLowerCase()).filter(Boolean);
    const platforms = rawPlatforms.filter(p => PLATFORMS.includes(p));
    const format = CONTENT_FORMATS.includes(String(raw.format || raw.formato || '').trim().toLowerCase())
      ? String(raw.format || raw.formato).trim().toLowerCase()
      : 'flyer';
    const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (!title || !dateOk || !platforms.length) {
      errors.push({ row: index + 1, error: 'Fila inválida: requiere title, date (YYYY-MM-DD) y platforms válidas' });
      return;
    }
    created.push({ title, caption, platforms, date, format });
  });
  return { created, errors };
}

// Resuelve sobre QUÉ cliente se trabaja:
//  - si eres cliente → tu propio clientId
//  - si eres agencia → el clientId que venga en query/body (debes elegir uno)
function resolveClientId(req, res) {
  if (req.user.role === 'client') return req.user.clientId;
  const id = req.query.clientId || req.body.clientId;
  if (!id) { res.status(400).json({ error: 'La agencia debe indicar clientId' }); return null; }
  if (!findClient(id)) { res.status(404).json({ error: 'Cliente no existe' }); return null; }
  return id;
}

// ---------------------------------------------------------------------------
//  RUTAS DE SESIÓN
// ---------------------------------------------------------------------------
app.post('/api/clientes/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email || '');
  if (!user || !bcrypt.compareSync(password || '', user.passwordHash))
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  res.json({ token: sign(user), user: { email: user.email, role: user.role, clientId: user.clientId } });
});

// Registro de un cliente nuevo (la pantalla de "Registro" del portal).
app.post('/api/clientes/auth/register', (req, res) => {
  const { fullName, businessSector, phone, email, password, socialLinks, avatarUrl } = req.body;
  if (!email || !password || !fullName)
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
  if (findUserByEmail(email)) return res.status(409).json({ error: 'Ese correo ya está registrado' });

  const normalizedLinks = normalizeSocialLinks(socialLinks);
  const clientId = uid();
  const data = db();
  data.clients.push({
    id: clientId, fullName, businessSector: businessSector || '', phone: phone || '', email,
      avatarUrl: avatarUrl || '',
    socialLinks: normalizedLinks,
    plan: { name:'Plan Inicial', period:'Mes en curso', total:12,
        capPlatform:{ instagram:4, facebook:3, tiktok:3, youtube:1, linkedin:1, x:3 },
        capFormat:{ reel:4, carrusel:4, flyer:4 } },
  });
  syncClientSocialProfiles(clientId, normalizedLinks);
  const user = { id: uid(), email, passwordHash: bcrypt.hashSync(password, 8), role:'client', clientId };
  data.users.push(user);
  save();
  res.status(201).json({ token: sign(user), user: { email, role:'client', clientId } });
});

app.get('/api/clientes/auth/me', auth, (req, res) => {
  res.json({ email: req.user.email, role: req.user.role, clientId: req.user.clientId });
});

// ---------------------------------------------------------------------------
//  PERFIL  (datos del negocio + enlaces de redes)
// ---------------------------------------------------------------------------
app.get('/api/clientes/profile', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const { plan, ...profile } = findClient(id);
  res.json(profile);
});

app.put('/api/clientes/profile', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const c = findClient(id);
  const { fullName, businessSector, phone, email, socialLinks, avatarUrl } = req.body;
  if (fullName !== undefined) c.fullName = fullName;
  if (businessSector !== undefined) c.businessSector = businessSector;
  if (phone !== undefined) c.phone = phone;
  if (email !== undefined) c.email = email;
  if (avatarUrl !== undefined) c.avatarUrl = avatarUrl;
  if (socialLinks) {
    c.socialLinks = normalizeSocialLinks({ ...c.socialLinks, ...socialLinks });
    syncClientSocialProfiles(id, c.socialLinks);
  }
  save();
  logActivity({ clientId: id, action: 'client-updated', detail: 'Se actualizó la ficha del cliente' });
  const { plan, ...profile } = c;
  res.json(profile);
});

// ---------------------------------------------------------------------------
//  REDES SOCIALES
// ---------------------------------------------------------------------------
app.get('/api/clientes/socials', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(db().socials[id] || {});
});

app.post('/api/clientes/socials/:platform/toggle', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const { platform } = req.params;
  if (!PLATFORMS.includes(platform)) return res.status(400).json({ error: 'Plataforma inválida' });
  const s = db().socials[id][platform];
  s.connected = !s.connected;
  if (req.body.handle !== undefined) s.handle = req.body.handle;
  save();
  res.json(db().socials[id]);
});

// ---------------------------------------------------------------------------
//  CONTENIDO (parrilla)  +  APROBACIONES
// ---------------------------------------------------------------------------
app.get('/api/clientes/content', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(db().content.filter(c => c.clientId === id).sort((a, b) => a.date.localeCompare(b.date)));
});

// La agencia crea una pieza → aparece en la parrilla del cliente.
app.post('/api/clientes/content', auth, agencyOnly, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const { title, caption, platforms, date, format, mediaDataUrl, mediaName } = req.body;
  if (!title || !Array.isArray(platforms) || !platforms.length || !date)
    return res.status(400).json({ error: 'Título, al menos una plataforma y fecha son obligatorios' });
  const normalizedFormat = CONTENT_FORMATS.includes(String(format || '').toLowerCase()) ? String(format).toLowerCase() : 'flyer';
  const item = {
    id: uid(), clientId: id, title, caption: caption || '',
    platforms: platforms.filter(p => PLATFORMS.includes(p)),
    date,
    format: normalizedFormat,
    mediaDataUrl: mediaDataUrl || '',
    mediaName: mediaName || '',
    status: 'pending',
    color: colorFor(platforms[0]),
    createdBy: 'agency',
  };
  db().content.push(item);
  save();
  res.status(201).json(item);
});

app.put('/api/clientes/content/:id', auth, agencyOnly, requireCapability('content.write'), (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const item = db().content.find(c => c.id === req.params.id && c.clientId === id);
  if (!item) return res.status(404).json({ error: 'Pieza no encontrada' });
  const {
    title, caption, platforms, date, format, mediaDataUrl, mediaName,
  } = req.body;
  if (title !== undefined) item.title = String(title).trim();
  if (caption !== undefined) item.caption = String(caption);
  if (Array.isArray(platforms)) {
    const normalized = platforms.map(p => String(p).toLowerCase()).filter(p => PLATFORMS.includes(p));
    if (!normalized.length) return res.status(400).json({ error: 'La pieza debe tener al menos una plataforma válida' });
    item.platforms = normalized;
    item.color = colorFor(normalized[0]);
  }
  if (date !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return res.status(400).json({ error: 'Fecha inválida (YYYY-MM-DD)' });
    item.date = String(date);
  }
  if (format !== undefined) {
    const normalizedFormat = String(format).trim().toLowerCase();
    if (!CONTENT_FORMATS.includes(normalizedFormat)) return res.status(400).json({ error: 'Formato inválido' });
    item.format = normalizedFormat;
  }
  if (mediaDataUrl !== undefined) item.mediaDataUrl = mediaDataUrl;
  if (mediaName !== undefined) item.mediaName = mediaName;
  item.updatedAt = new Date().toISOString();
  save();
  logActivity({ clientId: id, action: 'content-updated', detail: `Pieza actualizada: ${item.title}` });
  res.json(item);
});

app.post('/api/clientes/content/import', auth, agencyOnly, requireCapability('content.write'), (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const rows = Array.isArray(req.body.items) ? req.body.items : [];
  if (!rows.length) return res.status(400).json({ error: 'No hay filas para importar' });
  const normalized = normalizeImportedContentRows(rows, 300);
  const errors = normalized.errors;
  const created = [];
  normalized.created.forEach((entry) => {
    const item = {
      id: uid(),
      clientId: id,
      title: entry.title,
      caption: entry.caption,
      platforms: entry.platforms,
      date: entry.date,
      format: entry.format,
      status: 'pending',
      color: colorFor(entry.platforms[0]),
      createdBy: 'agency',
      source: 'import',
      createdAt: new Date().toISOString(),
    };
    db().content.push(item);
    created.push(item);
  });
  if (created.length) {
    logActivity({ clientId: id, action: 'content-imported', detail: `Se importaron ${created.length} piezas` }, false);
    save();
  }
  res.status(errors.length ? 207 : 201).json({ created: created.length, errors, items: created });
});

app.post('/api/clientes/content/import/preview', auth, agencyOnly, requireCapability('content.write'), (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const rows = Array.isArray(req.body.items) ? req.body.items : [];
  if (!rows.length) return res.status(400).json({ error: 'No hay filas para previsualizar' });
  const normalized = normalizeImportedContentRows(rows, 500);
  const sample = normalized.created.slice(0, 12).map((entry, i) => ({
    row: i + 1,
    title: entry.title,
    date: entry.date,
    platforms: entry.platforms,
  }));
  res.json({
    totalRows: rows.length,
    validRows: normalized.created.length,
    invalidRows: normalized.errors.length,
    sample,
    errors: normalized.errors.slice(0, 50),
  });
});

app.get('/api/clientes/approvals', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(db().content.filter(c => c.clientId === id && c.status === 'pending'));
});

// El cliente aprueba o rechaza → la agencia lo ve y el plan se recalcula solo.
app.post('/api/clientes/content/:id/decide', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const { decision } = req.body; // 'approved' | 'rejected'
  if (!['approved', 'rejected'].includes(decision))
    return res.status(400).json({ error: 'Decisión inválida' });
  const item = db().content.find(c => c.id === req.params.id && c.clientId === id);
  if (!item) return res.status(404).json({ error: 'Pieza no encontrada' });
  if (req.user.role === 'agency' && !hasCapability(req, 'content.approve')) {
    return res.status(403).json({ error: 'Tu rol no puede aprobar/rechazar contenido' });
  }
  try {
    const updated = setContentStatus(item, decision, { actor: req.user.role, reason: req.body.reason || '' });
    save();
    res.json(updated);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'No se pudo actualizar la pieza' });
  }
});

app.put('/api/clientes/content/:id/status', auth, agencyOnly, requireCapability('content.approve'), (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const nextStatus = String(req.body.status || '').trim();
  const item = db().content.find(c => c.id === req.params.id && c.clientId === id);
  if (!item) return res.status(404).json({ error: 'Pieza no encontrada' });
  try {
    const updated = setContentStatus(item, nextStatus, { actor: req.user.role, reason: req.body.reason || '' });
    save();
    res.json(updated);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'No se pudo actualizar la pieza' });
  }
});

// ---------------------------------------------------------------------------
//  MENSAJES  (chat bidireccional cliente ⇄ agencia)
// ---------------------------------------------------------------------------
app.get('/api/clientes/messages', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(db().messages.filter(m => m.clientId === id).sort((a, b) => a.createdAt - b.createdAt));
});

app.post('/api/clientes/messages', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const text = String(req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'El mensaje está vacío' });
  const msg = {
    id: uid(), clientId: id, from: req.user.role, // 'client' | 'agency'
    text, at: new Date().toTimeString().slice(0, 5), createdAt: Date.now(),
  };
  db().messages.push(msg);
  save();
  res.status(201).json(msg);
});

// ---------------------------------------------------------------------------
//  PLAN  (cantidad de publicaciones incluidas, en vivo)
// ---------------------------------------------------------------------------
app.get('/api/clientes/plan', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(planFor(id));
});

app.put('/api/clientes/plan', auth, agencyOnly, requireCapability('clients.manage'), (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const c = findClient(id);
  if (!c) return res.status(404).json({ error: 'Cliente no encontrado' });

  const { name, period, total, capPlatform, capFormat } = req.body;
  if (!c.plan) c.plan = {
    name: 'Plan Inicial', period: 'Mes en curso', total: 12, capPlatform: {}, capFormat: {},
  };
  if (name !== undefined) c.plan.name = name;
  if (period !== undefined) c.plan.period = period;
  if (total !== undefined) c.plan.total = Number(total) || 0;
  if (capPlatform) c.plan.capPlatform = capPlatform;
  if (capFormat) c.plan.capFormat = capFormat;
  save();
  logActivity({ clientId: id, action: 'plan-updated', detail: `Plan actualizado a ${c.plan.name}` });
  res.json(planFor(id));
});

// ---------------------------------------------------------------------------
//  AGENCIA: lista de clientes con resumen
// ---------------------------------------------------------------------------
function createAgencyClient(payload, { persist = true } = {}) {
  const {
    fullName,
    businessSector,
    phone,
    email,
    password,
    avatarUrl,
    socialLinks,
    planName,
    planPeriod,
    planTotal,
    capPlatform,
    capFormat,
  } = payload;

  if (!fullName || !email || !password) {
    const error = new Error('Nombre, correo y contraseña son obligatorios');
    error.status = 400;
    throw error;
  }

  if (findUserByEmail(email)) {
    const error = new Error('Ese correo ya está registrado');
    error.status = 409;
    throw error;
  }

  const clientId = uid();
  const normalizedLinks = normalizeSocialLinks(socialLinks);

  db().clients.push({
    id: clientId,
    fullName,
    businessSector: businessSector || '',
    phone: phone || '',
    email,
    avatarUrl: avatarUrl || '',
    socialLinks: normalizedLinks,
    plan: {
      name: planName || 'Plan Inicial',
      period: planPeriod || 'Mes en curso',
      total: Number(planTotal) || 12,
      capPlatform: capPlatform || { instagram: 4, facebook: 3, tiktok: 3, youtube: 1, linkedin: 1, x: 3 },
      capFormat: capFormat || { reel: 4, carrusel: 4, flyer: 4 },
    },
  });

  syncClientSocialProfiles(clientId, normalizedLinks);

  db().users.push({
    id: uid(),
    email,
    passwordHash: bcrypt.hashSync(password, 8),
    role: 'client',
    clientId,
  });

  ensureCalendarCollections();
  db().calendarConfigs.push(normalizeCalendar({
    clientId,
    name: `Agenda ${fullName}`,
    type: 'individual',
    durationMin: 60,
    bufferBeforeMin: 10,
    bufferAfterMin: 10,
    minNoticeHours: 2,
    capacity: 1,
    agents: [{ id: 'ag_1', name: fullName || 'Agente principal' }],
  }));

  if (persist) save();
  return {
    id: clientId,
    fullName,
    businessSector: businessSector || '',
    phone: phone || '',
    email,
    avatarUrl: avatarUrl || '',
  };
}

app.get('/api/clientes/clients', auth, agencyOnly, (req, res) => {
  const list = db().clients.map(c => {
    const pending = db().content.filter(x => x.clientId === c.id && x.status === 'pending').length;
    const plan = planFor(c.id);
    const connected = Object.values(db().socials[c.id] || {}).filter(s => s.connected).length;
    return { id: c.id, fullName: c.fullName, businessSector: c.businessSector,
             avatarUrl: c.avatarUrl || '', pending, connected, planUsed: plan.used, planTotal: plan.total };
  });
  res.json(list);
});

app.post('/api/clientes/clients', auth, agencyOnly, requireCapability('clients.manage'), (req, res) => {
  try {
    const created = createAgencyClient(req.body);
    logActivity({ clientId: created.id, action: 'client-created', detail: `Cliente creado: ${created.fullName}` });
    res.status(201).json(created);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'No se pudo crear el cliente' });
  }
});

app.post('/api/clientes/clients/import', auth, agencyOnly, requireCapability('clients.manage'), (req, res) => {
  const rows = Array.isArray(req.body.clients) ? req.body.clients : [];
  if (!rows.length) return res.status(400).json({ error: 'No hay clientes para importar' });

  const created = [];
  const errors = [];
  for (let i = 0; i < rows.length; i += 1) {
    try {
      const item = createAgencyClient(rows[i], { persist: false });
      created.push(item);
      logActivity({ clientId: item.id, action: 'client-imported', detail: `Cliente importado: ${item.fullName}` }, false);
    } catch (error) {
      errors.push({ row: i + 1, error: error.message || 'Error al importar' });
    }
  }

  if (created.length) save();
  res.status(errors.length ? 207 : 201).json({ created: created.length, errors, clients: created });
});

app.delete('/api/clientes/clients/:id', auth, agencyOnly, requireCapability('clients.manage'), (req, res) => {
  const clientId = req.params.id;
  const index = db().clients.findIndex(c => c.id === clientId);
  if (index < 0) return res.status(404).json({ error: 'Cliente no encontrado' });
  const clientName = db().clients[index]?.fullName || 'Cliente';

  db().clients.splice(index, 1);
  db().users = db().users.filter(u => u.clientId !== clientId);
  delete db().socials[clientId];
  db().content = db().content.filter(item => item.clientId !== clientId);
  db().messages = db().messages.filter(item => item.clientId !== clientId);
  db().contacts = db().contacts.filter(item => item.clientId !== clientId);
  db().deals = db().deals.filter(item => item.clientId !== clientId);
  db().tasks = db().tasks.filter(item => item.clientId !== clientId);
  db().campaigns = db().campaigns.filter(item => item.clientId !== clientId);
  db().calendarConfigs = (db().calendarConfigs || []).filter(item => item.clientId !== clientId);
  db().appointments = (db().appointments || []).filter(item => item.clientId !== clientId);
  db().automations = db().automations.filter(item => item.clientId !== clientId);
  db().reportFormulas = (db().reportFormulas || []).filter(item => item.clientId !== clientId);
  db().conversations = db().conversations.filter(item => item.clientId !== clientId);
  logActivity({ clientId, action: 'client-deleted', detail: `Cliente eliminado: ${clientName}` });
  save();
  res.json({ ok: true });
});

app.get('/api/clientes/activity', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 30, 100));
  const logs = (db().activityLogs || []).filter(item => item.clientId === id).slice(0, limit);
  res.json(logs);
});

app.get('/api/clientes/agency-metrics', auth, agencyOnly, (req, res) => {
  if (!hasCapability(req, 'ops.view')) return res.status(403).json({ error: 'Tu rol no puede ver operaciones' });
  const clients = db().clients || [];
  const content = db().content || [];
  const contacts = db().contacts || [];
  const deals = db().deals || [];
  const tasks = db().tasks || [];
  const automations = db().automations || [];
  const conversations = db().conversations || [];
  const recent = (db().activityLogs || []).slice(0, 12).map(item => ({
    ...item,
    clientName: findClient(item.clientId)?.fullName || 'Cliente eliminado',
  }));

  const pendingContent = content.filter(item => item.status === 'pending').length;
  const activeAutomationCount = automations.filter(item => item.status === 'activa').length;
  const openDeals = deals.filter(item => item.stage !== 'ganado' && item.stage !== 'perdido').length;
  const overdueTasks = tasks.filter(item => !item.done && item.due <= new Date().toISOString().slice(0, 10)).length;
  const unreadConversations = conversations.filter(item => item.unread > 0).length;
  const connectedSocials = clients.reduce((sum, client) => sum + Object.values(db().socials[client.id] || {}).filter(s => s.connected).length, 0);

  res.json({
    clients: clients.length,
    contacts: contacts.length,
    pendingContent,
    activeAutomations: activeAutomationCount,
    openDeals,
    overdueTasks,
    unreadConversations,
    connectedSocials,
    recent,
  });
});

app.get('/api/clientes/agency/capabilities', auth, agencyOnly, (req, res) => {
  const role = resolveAgencyRole(req);
  res.json({ role, capabilities: ROLE_CAPABILITIES[role] });
});

app.get('/api/clientes/agency-ops', auth, agencyOnly, (req, res) => {
  if (!hasCapability(req, 'ops.view')) return res.status(403).json({ error: 'Tu rol no puede ver operaciones' });
  const today = new Date().toISOString().slice(0, 10);
  const clients = db().clients || [];
  const tasks = db().tasks || [];
  const deals = db().deals || [];
  const conversations = db().conversations || [];
  const content = db().content || [];
  const overdueTasks = tasks.filter(t => !t.done && t.due < today).length;
  const dueToday = tasks.filter(t => !t.done && t.due === today).length;
  const openDeals = deals.filter(item => item.stage !== 'ganado' && item.stage !== 'perdido').length;
  const unreadInbox = conversations.filter(item => item.unread > 0).length;
  const pendingApprovals = content.filter(item => item.status === 'pending').length;
  const throughputWeek = (db().activityLogs || []).filter(item => {
    const at = new Date(item.at).getTime();
    return at >= (Date.now() - (7 * 24 * 60 * 60 * 1000));
  }).length;
  res.json({
    summary: {
      clients: clients.length,
      overdueTasks,
      dueToday,
      openDeals,
      unreadInbox,
      pendingApprovals,
      throughputWeek,
    },
    lanes: [
      { role: 'strategist', label: 'Estrategia', queue: pendingApprovals, slaHours: 24 },
      { role: 'trafficker', label: 'Tráfico', queue: dueToday, slaHours: 8 },
      { role: 'closer', label: 'Cierre', queue: openDeals, slaHours: 12 },
    ],
    alerts: [
      overdueTasks > 0 ? { level: 'high', text: `${overdueTasks} tareas vencidas` } : null,
      unreadInbox > 0 ? { level: 'medium', text: `${unreadInbox} conversaciones sin leer` } : null,
      pendingApprovals > 0 ? { level: 'medium', text: `${pendingApprovals} piezas pendientes de aprobación` } : null,
    ].filter(Boolean),
  });
});

// ---------------------------------------------------------------------------
//  MÉTRICAS / ANALÍTICA  (estilo Mailchimp Reports)
// ---------------------------------------------------------------------------
app.get('/api/clientes/metrics', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(metricsFor(id));
});

app.get('/api/clientes/report-formulas', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  ensureAdvancedCollections();
  const formulas = (db().reportFormulas || []).filter(f => f.clientId === id);
  const metrics = metricsFor(id);
  res.json(formulas.map(f => ({ ...f, value: computeFormulaValue(f, metrics) })));
});

app.post('/api/clientes/report-formulas', auth, agencyOnly, requireCapability('reports.manage'), (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  ensureAdvancedCollections();
  const { name, op, left, right, multiplier, decimals } = req.body;
  if (!name || !left || !right) return res.status(400).json({ error: 'name, left y right son obligatorios' });
  if (!['sum', 'diff', 'ratio', 'product'].includes(op)) return res.status(400).json({ error: 'Operación inválida' });
  const formula = {
    id: uid(),
    clientId: id,
    name: String(name).trim(),
    op,
    left,
    right,
    multiplier: Number(multiplier ?? 1),
    decimals: Number(decimals ?? 2),
    createdAt: new Date().toISOString(),
  };
  db().reportFormulas.push(formula);
  save();
  logActivity({ clientId: id, action: 'formula-created', detail: `Nueva fórmula: ${formula.name}` });
  res.status(201).json({ ...formula, value: computeFormulaValue(formula, metricsFor(id)) });
});

app.put('/api/clientes/report-formulas/:id', auth, agencyOnly, requireCapability('reports.manage'), (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  ensureAdvancedCollections();
  const formula = (db().reportFormulas || []).find(f => f.id === req.params.id && f.clientId === id);
  if (!formula) return res.status(404).json({ error: 'Formula no encontrada' });
  const { name, op, left, right, multiplier, decimals } = req.body;
  if (name !== undefined) formula.name = String(name).trim() || formula.name;
  if (op !== undefined) {
    if (!['sum', 'diff', 'ratio', 'product'].includes(op)) return res.status(400).json({ error: 'Operación inválida' });
    formula.op = op;
  }
  if (left !== undefined) formula.left = left;
  if (right !== undefined) formula.right = right;
  if (multiplier !== undefined) formula.multiplier = Number(multiplier || 1);
  if (decimals !== undefined) formula.decimals = Number(decimals || 2);
  formula.updatedAt = new Date().toISOString();
  save();
  logActivity({ clientId: id, action: 'formula-updated', detail: `Formula editada: ${formula.name}` });
  res.json({ ...formula, value: computeFormulaValue(formula, metricsFor(id)) });
});

app.delete('/api/clientes/report-formulas/:id', auth, agencyOnly, requireCapability('reports.manage'), (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  ensureAdvancedCollections();
  const index = (db().reportFormulas || []).findIndex(f => f.id === req.params.id && f.clientId === id);
  if (index < 0) return res.status(404).json({ error: 'Formula no encontrada' });
  const deleted = db().reportFormulas[index];
  db().reportFormulas.splice(index, 1);
  save();
  logActivity({ clientId: id, action: 'formula-deleted', detail: `Formula eliminada: ${deleted.name}` });
  res.json({ ok: true });
});

app.get('/api/clientes/templates', auth, agencyOnly, (req, res) => {
  if (!hasCapability(req, 'templates.manage')) return res.status(403).json({ error: 'Tu rol no puede gestionar templates' });
  ensureAdvancedCollections();
  const list = (db().clientTemplates || []).map(t => ({
    id: t.id,
    name: t.name,
    sourceClientId: t.sourceClientId,
    sourceClientName: findClient(t.sourceClientId)?.fullName || 'Cliente no disponible',
    createdAt: t.createdAt,
    createdBy: t.createdBy,
    stats: t.stats,
    appliedCount: (t.applyHistory || []).length,
    lastAppliedAt: t.applyHistory?.[0]?.at || null,
    lastAppliedClientName: findClient(t.applyHistory?.[0]?.targetClientId)?.fullName || null,
    historyPreview: (t.applyHistory || []).slice(0, 5),
  })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(list);
});

app.post('/api/clientes/templates/snapshot', auth, agencyOnly, requireCapability('templates.manage'), (req, res) => {
  const sourceClientId = req.body.sourceClientId;
  const sourceClient = findClient(sourceClientId);
  if (!sourceClient) return res.status(404).json({ error: 'Cliente origen no encontrado' });
  ensureAdvancedCollections();
  const baseName = normalizeTemplateName(req.body.name, sourceClient);
  const templateKey = `${sourceClientId}:${baseName.toLowerCase()}`;
  const siblings = (db().clientTemplates || []).filter(t => t.templateKey === templateKey);
  const version = (siblings.reduce((max, item) => Math.max(max, Number(item.version || 1)), 0) || 0) + 1;
  const calendars = (db().calendarConfigs || []).filter(c => c.clientId === sourceClientId).map(c => ({ ...c }));
  const automations = (db().automations || []).filter(a => a.clientId === sourceClientId).map(a => ({ ...a }));
  const template = {
    id: uid(),
    name: `${baseName} v${version}`,
    baseName,
    templateKey,
    version,
    sourceClientId,
    createdAt: new Date().toISOString(),
    createdBy: req.user.email,
    stats: { calendars: calendars.length, automations: automations.length },
    payload: {
      plan: JSON.parse(JSON.stringify(sourceClient.plan || {})),
      socialLinks: JSON.parse(JSON.stringify(sourceClient.socialLinks || {})),
      calendars,
      automations,
    },
    applyHistory: [],
  };
  db().clientTemplates.push(template);
  save();
  res.status(201).json(template);
});

app.post('/api/clientes/templates/:id/apply', auth, agencyOnly, (req, res) => {
  const targetClientId = req.body.targetClientId;
  const targetClient = findClient(targetClientId);
  if (!targetClient) return res.status(404).json({ error: 'Cliente destino no encontrado' });
  if (!hasCapability(req, 'templates.manage')) return res.status(403).json({ error: 'Tu rol no puede aplicar templates' });
  ensureAdvancedCollections();
  const template = (db().clientTemplates || []).find(t => t.id === req.params.id);
  if (!template) return res.status(404).json({ error: 'Template no encontrado' });

  applyTemplateToClient({ template, targetClient, actor: req.user.email });
  save();
  res.json({ ok: true, templateId: template.id, targetClientId });
});

app.get('/api/clientes/templates/assignments', auth, agencyOnly, (req, res) => {
  if (!hasCapability(req, 'templates.manage')) return res.status(403).json({ error: 'Tu rol no puede ver historial de templates' });
  ensureAdvancedCollections();
  const clientId = req.query.clientId;
  if (!clientId) return res.status(400).json({ error: 'clientId es obligatorio' });
  const list = (db().clientTemplateAssignments || []).filter(item => item.clientId === clientId).slice(0, 50);
  res.json(list);
});

app.post('/api/clientes/templates/rollback', auth, agencyOnly, requireCapability('templates.manage'), (req, res) => {
  const targetClientId = req.body.targetClientId;
  const targetClient = findClient(targetClientId);
  if (!targetClient) return res.status(404).json({ error: 'Cliente destino no encontrado' });
  ensureAdvancedCollections();

  const history = (db().clientTemplateAssignments || []).filter(item => item.clientId === targetClientId);
  if (!history.length) return res.status(409).json({ error: 'No hay historial para hacer rollback' });
  const selectedTemplateId = req.body.templateId || history[1]?.templateId;
  if (!selectedTemplateId) return res.status(409).json({ error: 'No existe versión previa para rollback' });
  const template = (db().clientTemplates || []).find(item => item.id === selectedTemplateId);
  if (!template) return res.status(404).json({ error: 'Template de rollback no encontrado' });

  applyTemplateToClient({ template, targetClient, actor: req.user.email });

  save();
  logActivity({ clientId: targetClientId, action: 'template-rollback', detail: `Rollback aplicado con ${template.name}` });
  res.json({ ok: true, templateId: template.id, targetClientId, rollback: true });
});

// ---------------------------------------------------------------------------
//  CONTACTOS / AUDIENCIA  (CRM, estilo Mailchimp + Clientify)
// ---------------------------------------------------------------------------
app.get('/api/clientes/contacts', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(db().contacts.filter(c => c.clientId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});
app.post('/api/clientes/contacts', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const { name, email, phone, tag, status, source, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });
  const c = { id: uid(), clientId: id, name, email: email || '', phone: phone || '',
    tag: tag || 'Nuevo', status: status || 'lead', source: source || 'web',
    notes: notes || '', createdAt: new Date().toISOString().slice(0, 10) };
  db().contacts.push(c); save(); res.status(201).json(c);
});
app.put('/api/clientes/contacts/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const c = db().contacts.find(x => x.id === req.params.id && x.clientId === id);
  if (!c) return res.status(404).json({ error: 'Contacto no encontrado' });
  for (const k of ['name', 'email', 'phone', 'tag', 'status', 'source', 'notes'])
    if (req.body[k] !== undefined) c[k] = req.body[k];
  save(); res.json(c);
});
app.delete('/api/clientes/contacts/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const i = db().contacts.findIndex(x => x.id === req.params.id && x.clientId === id);
  if (i < 0) return res.status(404).json({ error: 'Contacto no encontrado' });
  db().contacts.splice(i, 1); save(); res.json({ ok: true });
});

// ---------------------------------------------------------------------------
//  EMBUDO DE VENTAS  (Pipeline kanban, estilo Clientify)
// ---------------------------------------------------------------------------
app.get('/api/clientes/deals', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(db().deals.filter(d => d.clientId === id));
});
app.post('/api/clientes/deals', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const { title, contact, value, stage } = req.body;
  if (!title) return res.status(400).json({ error: 'El título es obligatorio' });
  const d = { id: uid(), clientId: id, title, contact: contact || '',
    value: Number(value) || 0, stage: DEAL_STAGES.includes(stage) ? stage : 'nuevo',
    createdAt: new Date().toISOString().slice(0, 10) };
  db().deals.push(d); save(); res.status(201).json(d);
});
app.put('/api/clientes/deals/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const d = db().deals.find(x => x.id === req.params.id && x.clientId === id);
  if (!d) return res.status(404).json({ error: 'Oportunidad no encontrada' });
  if (req.body.stage !== undefined && [...DEAL_STAGES, 'perdido'].includes(req.body.stage)) d.stage = req.body.stage;
  for (const k of ['title', 'contact']) if (req.body[k] !== undefined) d[k] = req.body[k];
  if (req.body.value !== undefined) d.value = Number(req.body.value) || 0;
  save(); res.json(d);
});
app.delete('/api/clientes/deals/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const i = db().deals.findIndex(x => x.id === req.params.id && x.clientId === id);
  if (i < 0) return res.status(404).json({ error: 'Oportunidad no encontrada' });
  db().deals.splice(i, 1); save(); res.json({ ok: true });
});

// ---------------------------------------------------------------------------
//  TAREAS / AGENDA  (estilo Clientify)
// ---------------------------------------------------------------------------
app.get('/api/clientes/tasks', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(db().tasks.filter(t => t.clientId === id).sort((a, b) => (a.done - b.done) || a.due.localeCompare(b.due)));
});
app.post('/api/clientes/tasks', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const { title, due, priority, relatedTo } = req.body;
  if (!title) return res.status(400).json({ error: 'El título es obligatorio' });
  const t = { id: uid(), clientId: id, title, due: due || new Date().toISOString().slice(0, 10),
    priority: priority || 'media', done: false, relatedTo: relatedTo || '' };
  db().tasks.push(t); save(); res.status(201).json(t);
});
app.put('/api/clientes/tasks/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const t = db().tasks.find(x => x.id === req.params.id && x.clientId === id);
  if (!t) return res.status(404).json({ error: 'Tarea no encontrada' });
  for (const k of ['title', 'due', 'priority', 'relatedTo']) if (req.body[k] !== undefined) t[k] = req.body[k];
  if (req.body.done !== undefined) t.done = !!req.body.done;
  save(); res.json(t);
});
app.delete('/api/clientes/tasks/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const i = db().tasks.findIndex(x => x.id === req.params.id && x.clientId === id);
  if (i < 0) return res.status(404).json({ error: 'Tarea no encontrada' });
  db().tasks.splice(i, 1); save(); res.json({ ok: true });
});

// ---------------------------------------------------------------------------
//  CAMPAÑAS  (marketing, estilo Mailchimp)
// ---------------------------------------------------------------------------
app.get('/api/clientes/campaigns', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(db().campaigns.filter(c => c.clientId === id).sort((a, b) => b.date.localeCompare(a.date)));
});
app.post('/api/clientes/campaigns', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  if (req.user.role === 'agency' && !hasCapability(req, 'campaigns.manage')) return res.status(403).json({ error: 'Tu rol no puede crear campañas' });
  const { name, channel, audience, date } = req.body;
  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });
  const c = { id: uid(), clientId: id, name, channel: channel || 'email', status: 'borrador',
    audience: Number(audience) || 0, sent: 0, opens: 0, clicks: 0,
    date: date || new Date().toISOString().slice(0, 10) };
  db().campaigns.push(c); save(); res.status(201).json(c);
});

// ---------------------------------------------------------------------------
//  CALENDARIO Y CITAS  (tipo GHL)
// ---------------------------------------------------------------------------
app.get('/api/clientes/calendars', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  ensureCalendarCollections();
  let calendars = (db().calendarConfigs || []).filter(c => c.clientId === id);
  if (!calendars.length) {
    const clientName = findClient(id)?.fullName || 'Agente principal';
    const seeded = normalizeCalendar({
      clientId: id,
      name: `Agenda ${clientName}`,
      type: 'individual',
      durationMin: 60,
      bufferBeforeMin: 10,
      bufferAfterMin: 10,
      minNoticeHours: 2,
      capacity: 1,
      agents: [{ id: 'ag_1', name: clientName }],
    });
    db().calendarConfigs.push(seeded);
    save();
    calendars = [seeded];
  }
  res.json(calendars);
});

app.post('/api/clientes/calendars', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  if (req.user.role === 'agency' && !hasCapability(req, 'calendar.manage')) return res.status(403).json({ error: 'Tu rol no puede crear calendarios' });
  ensureCalendarCollections();
  if (!req.body.name) return res.status(400).json({ error: 'El nombre del calendario es obligatorio' });
  const calendar = normalizeCalendar({ ...req.body, clientId: id });
  db().calendarConfigs.push(calendar);
  save();
  logActivity({ clientId: id, action: 'calendar-created', detail: `Calendario creado: ${calendar.name}` });
  res.status(201).json(calendar);
});

app.put('/api/clientes/calendars/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  if (req.user.role === 'agency' && !hasCapability(req, 'calendar.manage')) return res.status(403).json({ error: 'Tu rol no puede editar calendarios' });
  ensureCalendarCollections();
  const index = (db().calendarConfigs || []).findIndex(c => c.id === req.params.id && c.clientId === id);
  if (index < 0) return res.status(404).json({ error: 'Calendario no encontrado' });
  const current = db().calendarConfigs[index];
  const updated = normalizeCalendar({ ...req.body, clientId: id }, current);
  db().calendarConfigs[index] = updated;
  save();
  logActivity({ clientId: id, action: 'calendar-updated', detail: `Calendario actualizado: ${updated.name}` });
  res.json(updated);
});

app.get('/api/clientes/appointments', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  ensureCalendarCollections();
  const list = (db().appointments || []).filter(a => a.clientId === id).sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  res.json(list);
});

app.post('/api/clientes/appointments', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  if (req.user.role === 'agency' && !hasCapability(req, 'calendar.manage')) return res.status(403).json({ error: 'Tu rol no puede reservar citas' });
  ensureCalendarCollections();
  const { calendarId, startAt, contactName, contactEmail, contactPhone, notes, intakeResponses } = req.body;
  if (!calendarId || !startAt || !contactName) return res.status(400).json({ error: 'calendarId, startAt y contactName son obligatorios' });

  const calendar = (db().calendarConfigs || []).find(c => c.id === calendarId && c.clientId === id);
  if (!calendar) return res.status(404).json({ error: 'Calendario no encontrado' });

  const startDate = parseDateTime(startAt);
  if (!startDate) return res.status(400).json({ error: 'Fecha/hora invalida' });
  const durationMin = Number(calendar.durationMin) || 60;
  const endDate = new Date(startDate.getTime() + (durationMin * 60000));
  const minNotice = Number(calendar.minNoticeHours || 0) * 3600000;
  if ((Date.now() + minNotice) > startDate.getTime()) {
    return res.status(409).json({ error: `Debe reservarse con al menos ${calendar.minNoticeHours || 0}h de anticipacion` });
  }
  if (!isWithinWeeklyHours(calendar, startDate, endDate)) {
    return res.status(409).json({ error: 'La cita cae fuera de la disponibilidad del calendario' });
  }

  if (calendar.type === 'evento') {
    const sameSlot = (db().appointments || []).filter(a => a.clientId === id && a.calendarId === calendar.id && a.startAt === startDate.toISOString() && a.status !== 'cancelada').length;
    if (sameSlot >= (Number(calendar.capacity) || 1)) return res.status(409).json({ error: 'No hay cupo disponible para ese slot' });
  }

  const assignedAgents = pickAssignedAgents(calendar);
  if (hasAgentConflict({ clientId: id, calendar, startAt: startDate, endAt: endDate, assignedAgents })) {
    return res.status(409).json({ error: 'Conflicto de disponibilidad con el agente asignado' });
  }

  const appointment = {
    id: uid(),
    clientId: id,
    calendarId: calendar.id,
    calendarName: calendar.name,
    type: calendar.type,
    status: 'pendiente',
    startAt: startDate.toISOString(),
    durationMin,
    bufferBeforeMin: Number(calendar.bufferBeforeMin || 0),
    bufferAfterMin: Number(calendar.bufferAfterMin || 0),
    contactName,
    contactEmail: contactEmail || '',
    contactPhone: contactPhone || '',
    notes: notes || '',
    intakeResponses: Array.isArray(intakeResponses) ? intakeResponses : [],
    assignedAgents,
    assignedAgentNames: assignedAgents.map(a => a.name),
    reminders: (calendar.reminderRules || []).map(r => ({ ...r, scheduledAt: new Date(startDate.getTime() - ((Number(r.offsetMin) || 0) * 60000)).toISOString(), status: 'programado' })),
    createdAt: new Date().toISOString(),
  };

  db().appointments.push(appointment);

  if (contactName && !db().contacts.some(c => c.clientId === id && ((contactEmail && c.email === contactEmail) || c.name === contactName))) {
    db().contacts.push({
      id: uid(),
      clientId: id,
      name: contactName,
      email: contactEmail || '',
      phone: contactPhone || '',
      tag: 'Nuevo',
      status: 'lead',
      source: 'web',
      notes: `Creado desde reserva en ${calendar.name}`,
      createdAt: new Date().toISOString().slice(0, 10),
    });
  }

  if (calendar.automationOnBooking) {
    db().tasks.push({
      id: uid(),
      clientId: id,
      title: `Preparar cita: ${contactName}`,
      due: startDate.toISOString().slice(0, 10),
      priority: 'media',
      done: false,
      relatedTo: contactName,
    });
  }

  save();
  logActivity({ clientId: id, action: 'appointment-booked', detail: `Cita reservada en ${calendar.name} para ${contactName}` });
  res.status(201).json(appointment);
});

app.put('/api/clientes/appointments/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  if (req.user.role === 'agency' && !hasCapability(req, 'calendar.manage')) return res.status(403).json({ error: 'Tu rol no puede actualizar citas' });
  ensureCalendarCollections();
  const appointment = (db().appointments || []).find(a => a.id === req.params.id && a.clientId === id);
  if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
  if (req.body.status && ['pendiente', 'confirmada', 'cancelada', 'completada'].includes(req.body.status)) appointment.status = req.body.status;
  if (req.body.notes !== undefined) appointment.notes = req.body.notes;
  save();
  logActivity({ clientId: id, action: 'appointment-updated', detail: `Cita ${appointment.status} para ${appointment.contactName}` });
  res.json(appointment);
});

// ---------------------------------------------------------------------------
//  AUTOMATIZACIONES / WORKFLOWS  (estilo Mailchimp Journeys + Clientify)
// ---------------------------------------------------------------------------
app.get('/api/clientes/automations', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json((db().automations || []).filter(a => a.clientId === id));
});
app.post('/api/clientes/automations', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  if (req.user.role === 'agency' && !hasCapability(req, 'automation.manage')) return res.status(403).json({ error: 'Tu rol no puede crear automatizaciones' });
  const { name, trigger, action, channel, template, priority, delayDays, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });
  const a = { id: uid(), clientId: id, name, trigger: trigger || 'Se crea un contacto nuevo',
    action: action || 'Enviar email', channel: channel || 'email', status: 'activa', enrolled: 0, completed: 0,
    template: template || 'custom', priority: priority || 'media', delayDays: Number(delayDays) || 0, notes: notes || '' };
  (db().automations ||= []).push(a); save(); res.status(201).json(a);
});
app.put('/api/clientes/automations/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  if (req.user.role === 'agency' && !hasCapability(req, 'automation.manage')) return res.status(403).json({ error: 'Tu rol no puede editar automatizaciones' });
  const a = (db().automations || []).find(x => x.id === req.params.id && x.clientId === id);
  if (!a) return res.status(404).json({ error: 'Automatización no encontrada' });
  if (req.body.status && ['activa', 'pausada'].includes(req.body.status)) a.status = req.body.status;
  for (const k of ['name', 'trigger', 'action', 'channel', 'template', 'priority', 'delayDays', 'notes']) if (req.body[k] !== undefined) a[k] = req.body[k];
  save(); res.json(a);
});

// ---------------------------------------------------------------------------
//  BANDEJA DE ENTRADA OMNICANAL  (estilo Clientify Inbox)
// ---------------------------------------------------------------------------
app.get('/api/clientes/conversations', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json((db().conversations || []).filter(c => c.clientId === id));
});
app.post('/api/clientes/conversations/:id/reply', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const c = (db().conversations || []).find(x => x.id === req.params.id && x.clientId === id);
  if (!c) return res.status(404).json({ error: 'Conversación no encontrada' });
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'Mensaje vacío' });
  const at = new Date().toTimeString().slice(0, 5);
  c.messages.push({ from: 'me', text, at }); c.unread = 0; c.updatedAt = at; c.status = 'abierta';
  save(); res.json(c);
});
app.put('/api/clientes/conversations/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const c = (db().conversations || []).find(x => x.id === req.params.id && x.clientId === id);
  if (!c) return res.status(404).json({ error: 'Conversación no encontrada' });
  if (req.body.status && ['abierta', 'cerrada'].includes(req.body.status)) c.status = req.body.status;
  if (req.body.read) c.unread = 0;
  save(); res.json(c);
});

// Rutas de los dos portales
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/agencia', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'agency.html')));

db(); // inicializa / siembra
app.listen(PORT, () => {
  console.log(`\n  ✅ Servidor listo`);
  console.log(`  • Portal del cliente:  http://localhost:${PORT}/`);
  console.log(`  • Panel de la agencia: http://localhost:${PORT}/agencia\n`);
  console.log(`  Accesos de prueba:`);
  console.log(`  • Cliente → camila@laparrillaverde.co / cliente123`);
  console.log(`  • Agencia → equipo@pautastudio.co / agencia123\n`);
});
