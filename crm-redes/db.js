// ============================================================================
//  db.js — "Base de datos" compartida por los dos módulos
//  Persistencia en archivo JSON (data/db.json). Reemplazable por SQL más adelante.
//  Incluye: perfil, redes, contenido, mensajes, plan  +  (NUEVO) contactos,
//  embudo de ventas, tareas, campañas y métricas — al estilo Mailchimp/Clientify.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export const PLATFORMS = ['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'x'];
export const DEAL_STAGES = ['nuevo', 'contactado', 'propuesta', 'negociacion', 'ganado'];
const HEX = { facebook:'#1877F2', instagram:'#E1306C', tiktok:'#111111', youtube:'#FF0000', linkedin:'#0A66C2', x:'#111111' };

const uid = () => crypto.randomUUID();
const dateOffset = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const hhmm = () => new Date().toTimeString().slice(0, 5);
const monthLabel = (back) => { const d = new Date(); d.setMonth(d.getMonth() - back); return d.toLocaleDateString('es', { month: 'short' }); };

// ---------------------------------------------------------------------------
function buildSeed() {
  const clientId = 'cli_demo';
  return {
    users: [
      { id: uid(), email: 'camila@laparrillaverde.co', passwordHash: bcrypt.hashSync('cliente123', 8), role: 'client', clientId },
      { id: uid(), email: 'equipo@pautastudio.co',     passwordHash: bcrypt.hashSync('agencia123', 8), role: 'agency', clientId: null },
    ],
    clients: [{
      id: clientId, fullName: 'Camila Restrepo', businessSector: 'Restaurante / Gastronomía',
      phone: '+57 300 124 5589', email: 'camila@laparrillaverde.co',
      socialLinks: { facebook:'laparrillaverde', instagram:'laparrillaverde', tiktok:'laparrillaverde', youtube:'laparrillaverde', linkedin:'', x:'parrillaverde' },
      plan: { name:'Plan Crecimiento', period:'Mes en curso', total:24, capPlatform:{ instagram:8, facebook:6, tiktok:6, youtube:2, linkedin:2, x:6 } },
    }],
    socials: { [clientId]: {
      facebook : { connected:true,  handle:'laparrillaverde', followers:'8.4k',  reach:'21k' },
      instagram: { connected:true,  handle:'laparrillaverde', followers:'14.2k', reach:'58k' },
      tiktok   : { connected:true,  handle:'laparrillaverde', followers:'31.7k', reach:'112k' },
      youtube  : { connected:false, handle:'laparrillaverde', followers:'—',     reach:'—' },
      linkedin : { connected:false, handle:'',                followers:'—',     reach:'—' },
      x        : { connected:true,  handle:'parrillaverde',   followers:'2.1k',  reach:'9k' },
    }},
    content: [
      { id:uid(), clientId, title:'Lanzamiento menú de temporada', caption:'Teaser del nuevo menú con ingredientes locales. Carrusel + reel.', platforms:['instagram','facebook'], date:dateOffset(1), status:'approved',  color:HEX.instagram, createdBy:'agency' },
      { id:uid(), clientId, title:'Receta exprés: arepa gourmet',  caption:'Video corto vertical mostrando el paso a paso en 30 segundos.',       platforms:['tiktok','instagram'], date:dateOffset(2), status:'pending', color:HEX.tiktok,   createdBy:'agency' },
      { id:uid(), clientId, title:'Testimonio de cliente',          caption:'Reseña en video de un cliente frecuente, formato entrevista.',         platforms:['youtube','facebook'], date:dateOffset(4), status:'draft',   color:HEX.youtube,  createdBy:'agency' },
      { id:uid(), clientId, title:'Promo 2x1 jueves',               caption:'Pieza estática anunciando la promoción semanal de jueves.',            platforms:['instagram','facebook','x'], date:dateOffset(6), status:'pending', color:HEX.facebook, createdBy:'agency' },
      { id:uid(), clientId, title:'Detrás de cámaras cocina',       caption:'Reel mostrando al equipo en plena hora pico. Tono cercano.',           platforms:['tiktok'], date:dateOffset(8), status:'approved', color:HEX.tiktok,  createdBy:'agency' },
      { id:uid(), clientId, title:'Alianza con productores',        caption:'Post corporativo sobre la nueva alianza con granjas locales.',         platforms:['linkedin','facebook'], date:dateOffset(11), status:'draft',  color:HEX.linkedin, createdBy:'agency' },
    ],
    messages: [
      { id:uid(), clientId, from:'agency', text:'¡Hola Camila! Subimos la parrilla de la próxima semana. ¿Puedes revisar el reel de la receta exprés? 🙌', at:hhmm(), createdAt:Date.now()-7200000 },
      { id:uid(), clientId, from:'client', text:'Perfecto, lo veo ahora. ¿Podemos mover la promo del jueves a primera hora?', at:hhmm(), createdAt:Date.now()-7000000 },
      { id:uid(), clientId, from:'agency', text:'Hecho, la reprogramamos para las 8:00 a.m. Te dejé 2 piezas en aprobaciones.', at:hhmm(), createdAt:Date.now()-6800000 },
    ],
    // ---------------- CRM: Contactos / Audiencia (estilo Mailchimp + Clientify) -------------
    contacts: [
      { id:uid(), clientId, name:'Andrés Gómez',    email:'andres.g@gmail.com',     phone:'+57 311 555 0182', tag:'VIP',        status:'cliente',  source:'instagram', createdAt:dateOffset(-40), notes:'Pide reservas para grupos grandes.' },
      { id:uid(), clientId, name:'Laura Méndez',    email:'lau.mendez@hotmail.com', phone:'+57 320 555 0934', tag:'Recurrente', status:'cliente',  source:'facebook',  createdAt:dateOffset(-31), notes:'' },
      { id:uid(), clientId, name:'Sofía Ramírez',   email:'sofiar@empresa.co',      phone:'+57 300 555 7711', tag:'Nuevo',      status:'lead',     source:'tiktok',    createdAt:dateOffset(-12), notes:'Llegó por el reel de la arepa.' },
      { id:uid(), clientId, name:'Catering Norte',  email:'ventas@cateringnorte.co',phone:'+57 1 555 2200',   tag:'Empresa',    status:'oportunidad', source:'linkedin', createdAt:dateOffset(-9), notes:'Interesados en evento corporativo.' },
      { id:uid(), clientId, name:'Julián Torres',   email:'julian.t@gmail.com',     phone:'+57 315 555 4456', tag:'Nuevo',      status:'lead',     source:'web',       createdAt:dateOffset(-5), notes:'' },
      { id:uid(), clientId, name:'Daniela Ruiz',    email:'dani.ruiz@gmail.com',    phone:'+57 312 555 8890', tag:'Recurrente', status:'cliente',  source:'instagram', createdAt:dateOffset(-22), notes:'Cumpleaños en julio.' },
      { id:uid(), clientId, name:'Hotel Aurora',    email:'compras@hotelaurora.co', phone:'+57 1 555 6633',   tag:'Empresa',    status:'oportunidad', source:'referido', createdAt:dateOffset(-3), notes:'Quieren alianza de desayunos.' },
      { id:uid(), clientId, name:'Marcela Pinto',   email:'marce.p@gmail.com',      phone:'+57 318 555 1029', tag:'Inactivo',   status:'inactivo', source:'facebook',  createdAt:dateOffset(-95), notes:'No responde hace 3 meses.' },
    ],
    // ---------------- Embudo de ventas (Pipeline kanban, estilo Clientify) -------------
    deals: [
      { id:uid(), clientId, title:'Evento corporativo Catering Norte', contact:'Catering Norte', value:4800000, stage:'propuesta',   createdAt:dateOffset(-9) },
      { id:uid(), clientId, title:'Alianza desayunos Hotel Aurora',    contact:'Hotel Aurora',   value:7200000, stage:'negociacion', createdAt:dateOffset(-3) },
      { id:uid(), clientId, title:'Catering boda Daniela',             contact:'Daniela Ruiz',   value:2500000, stage:'contactado',  createdAt:dateOffset(-6) },
      { id:uid(), clientId, title:'Pedido recurrente oficina',         contact:'Julián Torres',  value:1200000, stage:'nuevo',       createdAt:dateOffset(-2) },
      { id:uid(), clientId, title:'Menú degustación influencers',      contact:'Sofía Ramírez',  value:900000,  stage:'nuevo',       createdAt:dateOffset(-1) },
      { id:uid(), clientId, title:'Cena privada aniversario',          contact:'Andrés Gómez',   value:1800000, stage:'ganado',      createdAt:dateOffset(-15) },
      { id:uid(), clientId, title:'Combo familiar fin de semana',      contact:'Laura Méndez',   value:650000,  stage:'ganado',      createdAt:dateOffset(-20) },
    ],
    // ---------------- Tareas / Agenda (estilo Clientify) -------------
    tasks: [
      { id:uid(), clientId, title:'Llamar a Hotel Aurora para propuesta', due:dateOffset(0),  priority:'alta',  done:false, relatedTo:'Hotel Aurora' },
      { id:uid(), clientId, title:'Enviar cotización a Catering Norte',    due:dateOffset(1),  priority:'alta',  done:false, relatedTo:'Catering Norte' },
      { id:uid(), clientId, title:'Confirmar reserva grupo Andrés',        due:dateOffset(2),  priority:'media', done:false, relatedTo:'Andrés Gómez' },
      { id:uid(), clientId, title:'Responder comentarios del reel',        due:dateOffset(0),  priority:'media', done:false, relatedTo:'' },
      { id:uid(), clientId, title:'Recordatorio cumpleaños Daniela',       due:dateOffset(5),  priority:'baja',  done:false, relatedTo:'Daniela Ruiz' },
      { id:uid(), clientId, title:'Reactivar a Marcela (inactiva)',        due:dateOffset(-1), priority:'baja',  done:true,  relatedTo:'Marcela Pinto' },
    ],
    // ---------------- Campañas de marketing (estilo Mailchimp) -------------
    campaigns: [
      { id:uid(), clientId, name:'Newsletter menú de temporada', channel:'email',     status:'enviada',    audience:1240, sent:1240, opens:512, clicks:98,  date:dateOffset(-7) },
      { id:uid(), clientId, name:'Promo jueves 2x1',             channel:'instagram', status:'programada', audience:14200, sent:0,   opens:0,   clicks:0,   date:dateOffset(3) },
      { id:uid(), clientId, name:'Reactivación clientes inactivos', channel:'email',  status:'borrador',   audience:320,  sent:0,   opens:0,   clicks:0,   date:dateOffset(6) },
      { id:uid(), clientId, name:'Lanzamiento receta arepa',     channel:'multi',     status:'enviada',    audience:33800, sent:33800, opens:9120, clicks:1450, date:dateOffset(-3) },
    ],
    // ---------------- Automatizaciones / Workflows (estilo Mailchimp Journeys + Clientify) -------------
    automations: [
      { id:uid(), clientId, name:'Bienvenida a nuevos contactos', trigger:'Se crea un contacto nuevo', action:'Enviar email de bienvenida + etiqueta', channel:'email', status:'activa', enrolled:128, completed:119 },
      { id:uid(), clientId, name:'Reactivación de inactivos', trigger:'Sin actividad por 60 días', action:'Email con cupón 15% + tarea de seguimiento', channel:'email', status:'activa', enrolled:34, completed:11 },
      { id:uid(), clientId, name:'Seguimiento de propuesta', trigger:'Oportunidad lleva 3 días en "Propuesta"', action:'Crear tarea y recordatorio al equipo', channel:'tarea', status:'activa', enrolled:7, completed:5 },
      { id:uid(), clientId, name:'Gracias por tu compra', trigger:'Oportunidad pasa a "Ganado"', action:'Mensaje de agradecimiento por WhatsApp', channel:'whatsapp', status:'pausada', enrolled:22, completed:22 },
      { id:uid(), clientId, name:'Responder DM al instante', trigger:'Mensaje directo en Instagram', action:'Auto-respuesta + crear conversación', channel:'instagram', status:'activa', enrolled:412, completed:401 },
    ],
    // ---------------- Bandeja de entrada omnicanal (estilo Clientify Inbox) -------------
    conversations: [
      { id:uid(), clientId, contactName:'Sofía Ramírez', channel:'instagram', status:'abierta', unread:2, updatedAt:'10:42',
        messages:[ {from:'them',text:'¡Hola! Vi el reel de la arepa gourmet 😍 ¿hacen domicilios al norte?',at:'10:38'}, {from:'them',text:'¿Y cuál es el horario hoy?',at:'10:42'} ] },
      { id:uid(), clientId, contactName:'Hotel Aurora', channel:'email', status:'abierta', unread:1, updatedAt:'09:15',
        messages:[ {from:'them',text:'Buenos días, quisiéramos avanzar con la propuesta de desayunos. ¿Pueden enviar cotización formal?',at:'09:15'} ] },
      { id:uid(), clientId, contactName:'Andrés Gómez', channel:'whatsapp', status:'abierta', unread:0, updatedAt:'Ayer',
        messages:[ {from:'them',text:'Quiero reservar para 12 personas el sábado',at:'Ayer'}, {from:'me',text:'¡Claro Andrés! Te confirmo mesa para 12 a las 8pm 🙌',at:'Ayer'}, {from:'them',text:'Perfecto, gracias!',at:'Ayer'} ] },
      { id:uid(), clientId, contactName:'Laura Méndez', channel:'facebook', status:'cerrada', unread:0, updatedAt:'Lun',
        messages:[ {from:'them',text:'¿Tienen opciones vegetarianas?',at:'Lun'}, {from:'me',text:'Sí Laura, tenemos 6 platos vegetarianos. Te paso el menú 🌱',at:'Lun'} ] },
    ],
    // ---------------- Métricas base para Analítica (series temporales) -------------
    metricsSeed: {
      followerGrowth: [
        { label: monthLabel(5), value: 38200 },
        { label: monthLabel(4), value: 42100 },
        { label: monthLabel(3), value: 45600 },
        { label: monthLabel(2), value: 49800 },
        { label: monthLabel(1), value: 53200 },
        { label: monthLabel(0), value: 56400 },
      ],
      reachByPlatform: { instagram: 58000, tiktok: 112000, facebook: 21000, x: 9000, youtube: 0, linkedin: 0 },
      engagementRate: 4.8, // %
      openRate: 41.3,      // % email
    },
  };
}

// ---------------------------------------------------------------------------
let cache = null;
export function db() {
  if (cache) return cache;
  if (fs.existsSync(DB_FILE)) cache = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  else { cache = buildSeed(); save(); console.log('🌱 Base de datos creada con datos de ejemplo en', DB_FILE); }
  return cache;
}
export function save() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

// ---- Helpers de dominio ----
export const findUserByEmail = (email) => db().users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
export const findUserById = (id) => db().users.find(u => u.id === id);
export const findClient   = (id) => db().clients.find(c => c.id === id);

export function planFor(clientId) {
  const c = findClient(clientId); if (!c) return null;
  const items = db().content.filter(x => x.clientId === clientId && (x.status === 'approved' || x.status === 'published'));
  const used = items.length; const perPlatform = {};
  for (const p of PLATFORMS) perPlatform[p] = items.filter(i => i.platforms.includes(p)).length;
  return { ...c.plan, used, perPlatform };
}

// Métricas calculadas en vivo + series sembradas
export function metricsFor(clientId) {
  const d = db();
  const m = d.metricsSeed || {};
  const contacts = d.contacts.filter(c => c.clientId === clientId);
  const deals = d.deals.filter(x => x.clientId === clientId);
  const content = d.content.filter(c => c.clientId === clientId);
  const automations = (d.automations || []).filter(a => a.clientId === clientId);
  const conversations = (d.conversations || []).filter(c => c.clientId === clientId);
  const thisMonth = new Date(); thisMonth.setDate(1);
  const newContacts = contacts.filter(c => new Date(c.createdAt) >= thisMonth).length;
  const wonValue = deals.filter(x => x.stage === 'ganado').reduce((s, x) => s + (x.value || 0), 0);
  const pipelineValue = deals.filter(x => x.stage !== 'ganado' && x.stage !== 'perdido').reduce((s, x) => s + (x.value || 0), 0);
  const contentByStatus = {};
  for (const s of ['approved','pending','draft','rejected','published']) contentByStatus[s] = content.filter(c => c.status === s).length;
  return {
    followerGrowth: m.followerGrowth || [],
    reachByPlatform: m.reachByPlatform || {},
    engagementRate: m.engagementRate || 0,
    openRate: m.openRate || 0,
    audienceTotal: contacts.length,
    newContactsThisMonth: newContacts,
    leads: contacts.filter(c => c.status === 'lead' || c.status === 'oportunidad').length,
    customers: contacts.filter(c => c.status === 'cliente').length,
    wonValue, pipelineValue,
    openDeals: deals.filter(x => x.stage !== 'ganado' && x.stage !== 'perdido').length,
    activeAutomations: automations.filter(a => a.status === 'activa').length,
    unreadConversations: conversations.filter(c => c.unread > 0).length,
    contentByStatus,
  };
}

export const colorFor = (platform) => HEX[platform] || '#888';
export { uid };
