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
  findUserByEmail, findUserById, findClient, planFor, metricsFor,
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
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
  const { fullName, businessSector, phone, email, password, socialLinks } = req.body;
  if (!email || !password || !fullName)
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
  if (findUserByEmail(email)) return res.status(409).json({ error: 'Ese correo ya está registrado' });

  const clientId = uid();
  const data = db();
  data.clients.push({
    id: clientId, fullName, businessSector: businessSector || '', phone: phone || '', email,
    socialLinks: { facebook:'', instagram:'', tiktok:'', youtube:'', linkedin:'', x:'', ...(socialLinks||{}) },
    plan: { name:'Plan Inicial', period:'Mes en curso', total:12,
            capPlatform:{ instagram:4, facebook:3, tiktok:3, youtube:1, linkedin:1, x:3 } },
  });
  data.socials[clientId] = Object.fromEntries(PLATFORMS.map(p => [p, { connected:false, handle:(socialLinks||{})[p]||'', followers:'—', reach:'—' }]));
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
  const { fullName, businessSector, phone, email, socialLinks } = req.body;
  if (fullName !== undefined) c.fullName = fullName;
  if (businessSector !== undefined) c.businessSector = businessSector;
  if (phone !== undefined) c.phone = phone;
  if (email !== undefined) c.email = email;
  if (socialLinks) c.socialLinks = { ...c.socialLinks, ...socialLinks };
  save();
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
  const { title, caption, platforms, date } = req.body;
  if (!title || !Array.isArray(platforms) || !platforms.length || !date)
    return res.status(400).json({ error: 'Título, al menos una plataforma y fecha son obligatorios' });
  const item = {
    id: uid(), clientId: id, title, caption: caption || '',
    platforms: platforms.filter(p => PLATFORMS.includes(p)),
    date, status: 'pending', color: colorFor(platforms[0]), createdBy: 'agency',
  };
  db().content.push(item);
  save();
  res.status(201).json(item);
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
  item.status = decision;
  save();
  res.json(item);
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

// ---------------------------------------------------------------------------
//  AGENCIA: lista de clientes con resumen
// ---------------------------------------------------------------------------
app.get('/api/clientes/clients', auth, agencyOnly, (req, res) => {
  const list = db().clients.map(c => {
    const pending = db().content.filter(x => x.clientId === c.id && x.status === 'pending').length;
    const plan = planFor(c.id);
    const connected = Object.values(db().socials[c.id] || {}).filter(s => s.connected).length;
    return { id: c.id, fullName: c.fullName, businessSector: c.businessSector,
             pending, connected, planUsed: plan.used, planTotal: plan.total };
  });
  res.json(list);
});

// ---------------------------------------------------------------------------
//  MÉTRICAS / ANALÍTICA  (estilo Mailchimp Reports)
// ---------------------------------------------------------------------------
app.get('/api/clientes/metrics', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  res.json(metricsFor(id));
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
  const { name, channel, audience, date } = req.body;
  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });
  const c = { id: uid(), clientId: id, name, channel: channel || 'email', status: 'borrador',
    audience: Number(audience) || 0, sent: 0, opens: 0, clicks: 0,
    date: date || new Date().toISOString().slice(0, 10) };
  db().campaigns.push(c); save(); res.status(201).json(c);
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
  const { name, trigger, action, channel } = req.body;
  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });
  const a = { id: uid(), clientId: id, name, trigger: trigger || 'Se crea un contacto nuevo',
    action: action || 'Enviar email', channel: channel || 'email', status: 'activa', enrolled: 0, completed: 0 };
  (db().automations ||= []).push(a); save(); res.status(201).json(a);
});
app.put('/api/clientes/automations/:id', auth, (req, res) => {
  const id = resolveClientId(req, res); if (!id) return;
  const a = (db().automations || []).find(x => x.id === req.params.id && x.clientId === id);
  if (!a) return res.status(404).json({ error: 'Automatización no encontrada' });
  if (req.body.status && ['activa', 'pausada'].includes(req.body.status)) a.status = req.body.status;
  for (const k of ['name', 'trigger', 'action', 'channel']) if (req.body[k] !== undefined) a[k] = req.body[k];
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
