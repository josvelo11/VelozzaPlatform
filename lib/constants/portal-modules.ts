import { PortalModuleData, PortalType } from '@/types/portal';

function toTitle(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const MODULE_TEXT: Record<string, { title?: string; subtitle: string; primaryAction: string; secondaryAction: string; recordPrefix: string }> = {
  dashboard: {
    subtitle: 'Vista ejecutiva con indicadores clave de desempeno, salud operativa y riesgo de cartera.',
    primaryAction: 'Crear Widget',
    secondaryAction: 'Exportar KPIs',
    recordPrefix: 'Iniciativa',
  },
  clients: {
    subtitle: 'Gestion de cartera de clientes, asignaciones, estado contractual y oportunidades de crecimiento.',
    primaryAction: 'Agregar Cliente',
    secondaryAction: 'Exportar Cartera',
    recordPrefix: 'Cliente',
  },
  'advertising-accounts': {
    title: 'Cuentas Publicitarias',
    subtitle: 'Gestion de cuentas publicitarias vinculadas a clientes, presupuesto, estado operativo y responsables.',
    primaryAction: 'Agregar Cuenta Publicitaria',
    secondaryAction: 'Exportar Cuentas',
    recordPrefix: 'Cuenta Publicitaria',
  },
  team: {
    subtitle: 'Capacidad del equipo, carga operativa, performance por rol y seguimiento de cumplimiento.',
    primaryAction: 'Asignar Recurso',
    secondaryAction: 'Exportar Equipo',
    recordPrefix: 'Miembro',
  },
  packages: {
    subtitle: 'Configuracion de paquetes comerciales, versionado de precios, addons y margenes por plan.',
    primaryAction: 'Crear Paquete',
    secondaryAction: 'Exportar Paquetes',
    recordPrefix: 'Paquete',
  },
  'intake-review': {
    title: 'Intake Review',
    subtitle: 'Revisiones de formularios de descubrimiento para aprobar alcance, brief y prioridades del cliente.',
    primaryAction: 'Aprobar Intake',
    secondaryAction: 'Exportar Respuestas',
    recordPrefix: 'Intake',
  },
  'brand-blueprints': {
    title: 'Brand Blueprints',
    subtitle: 'Blueprints de marca, voz editorial y posicionamiento diferenciador por vertical e ICP.',
    primaryAction: 'Generar Blueprint',
    secondaryAction: 'Exportar Blueprint',
    recordPrefix: 'Blueprint',
  },
  'brand-blueprint': {
    title: 'Brand Blueprint',
    subtitle: 'Documento vivo de marca con pilares de comunicacion, mensajes y lineamientos creativos.',
    primaryAction: 'Actualizar Blueprint',
    secondaryAction: 'Exportar Documento',
    recordPrefix: 'Seccion',
  },
  'social-accounts': {
    title: 'Social Accounts',
    subtitle: 'Hub de autorizacion OAuth, estado de tokens y cumplimiento de consentimientos por plataforma.',
    primaryAction: 'Conectar Cuenta',
    secondaryAction: 'Estado de Tokens',
    recordPrefix: 'Cuenta',
  },
  'social-crm': {
    title: 'CRM Operativo',
    subtitle: 'Espacio operativo del equipo para asignar, responder y cerrar interacciones de redes y leads.',
    primaryAction: 'Registrar Interaccion',
    secondaryAction: 'Exportar Operacion',
    recordPrefix: 'Interaccion',
  },
  'publication-planner': {
    title: 'Client Publishing Planner',
    subtitle: 'Calendario mensual de publicaciones y plan semanal de actividad para visibilidad total del cliente.',
    primaryAction: 'Agregar Publicacion',
    secondaryAction: 'Exportar Plan Semanal',
    recordPrefix: 'Publicacion',
  },
  content: {
    subtitle: 'Pipeline editorial desde idea hasta publicacion con control de calidad y trazabilidad.',
    primaryAction: 'Crear Pieza',
    secondaryAction: 'Exportar Calendario',
    recordPrefix: 'Contenido',
  },
  'content-approvals': {
    title: 'Content Approvals',
    subtitle: 'Aprobaciones cliente-equipo, comentarios y ciclos de revision previos a calendarizacion.',
    primaryAction: 'Enviar a Revision',
    secondaryAction: 'Exportar Aprobaciones',
    recordPrefix: 'Aprobacion',
  },
  calendar: {
    subtitle: 'Calendario operativo de entregas, publicaciones, milestones y ventanas de aprobacion.',
    primaryAction: 'Programar Evento',
    secondaryAction: 'Exportar ICS',
    recordPrefix: 'Evento',
  },
  analytics: {
    subtitle: 'Metricas de negocio, contenido y performance multi-canal con foco en crecimiento sostenible.',
    primaryAction: 'Crear Reporte',
    secondaryAction: 'Exportar Dashboard',
    recordPrefix: 'Insight',
  },
  reports: {
    subtitle: 'Reporteria mensual/trimestral con resumen ejecutivo y recomendaciones de accion.',
    primaryAction: 'Generar Reporte',
    secondaryAction: 'Exportar PDF',
    recordPrefix: 'Reporte',
  },
  messages: {
    subtitle: 'Centro de comunicaciones con historial por cliente, contexto y adjuntos operativos.',
    primaryAction: 'Nuevo Mensaje',
    secondaryAction: 'Exportar Conversacion',
    recordPrefix: 'Hilo',
  },
  updates: {
    subtitle: 'Feed de actualizaciones internas y cliente-facing sobre avances, bloqueos y decisiones.',
    primaryAction: 'Publicar Update',
    secondaryAction: 'Exportar Feed',
    recordPrefix: 'Update',
  },
  billing: {
    subtitle: 'Facturacion, estado de cobros, renovaciones y salud financiera por cuenta.',
    primaryAction: 'Crear Factura',
    secondaryAction: 'Exportar Facturacion',
    recordPrefix: 'Factura',
  },
  settings: {
    subtitle: 'Configuracion de cuenta, permisos, notificaciones, branding y preferencias operativas.',
    primaryAction: 'Guardar Configuracion',
    secondaryAction: 'Exportar Config',
    recordPrefix: 'Ajuste',
  },
  'audit-logs': {
    title: 'Audit Logs',
    subtitle: 'Bitacora de seguridad y cumplimiento con trazabilidad completa de eventos criticos.',
    primaryAction: 'Filtrar Eventos',
    secondaryAction: 'Exportar Auditoria',
    recordPrefix: 'Evento',
  },
  intake: {
    subtitle: 'Formulario de descubrimiento para capturar objetivos, audiencia y preferencias estrategicas.',
    primaryAction: 'Nuevo Intake',
    secondaryAction: 'Exportar Intake',
    recordPrefix: 'Formulario',
  },
  assets: {
    subtitle: 'Repositorio de activos de marca con control de version y trazabilidad de aprobacion.',
    primaryAction: 'Subir Asset',
    secondaryAction: 'Exportar Inventario',
    recordPrefix: 'Asset',
  },
  tasks: {
    subtitle: 'Planificacion de tareas por sprint, prioridad, dependencias y responsable.',
    primaryAction: 'Crear Tarea',
    secondaryAction: 'Exportar Backlog',
    recordPrefix: 'Tarea',
  },
};

function buildRecords(slug: string, portal: PortalType) {
  const text = MODULE_TEXT[slug] ?? {
    subtitle: `Gestion operativa de ${toTitle(slug).toLowerCase()} para el portal ${portal}.`,
    primaryAction: `Crear ${toTitle(slug)}`,
    secondaryAction: 'Exportar CSV',
    recordPrefix: toTitle(slug),
  };

  return [
    {
      id: `${slug}-001`,
      title: `${text.recordPrefix} estrategia base`,
      owner: portal === 'client' ? 'Client Success' : 'Operations Lead',
      status: 'active' as const,
      dueDate: '2026-07-05',
      priority: 'high' as const,
    },
    {
      id: `${slug}-002`,
      title: `${text.recordPrefix} iteracion 2`,
      owner: portal === 'team' ? 'Delivery Squad' : 'Account Manager',
      status: 'review' as const,
      dueDate: '2026-07-12',
      priority: 'medium' as const,
    },
    {
      id: `${slug}-003`,
      title: `${text.recordPrefix} seguimiento`,
      owner: 'QA Ops',
      status: 'pending' as const,
      dueDate: '2026-07-20',
      priority: 'medium' as const,
    },
    {
      id: `${slug}-004`,
      title: `${text.recordPrefix} escalado`,
      owner: 'Automation Queue',
      status: 'blocked' as const,
      dueDate: '2026-07-22',
      priority: 'high' as const,
    },
    {
      id: `${slug}-005`,
      title: `${text.recordPrefix} cierre mensual`,
      owner: 'PMO',
      status: 'completed' as const,
      dueDate: '2026-06-30',
      priority: 'low' as const,
    },
  ];
}

function buildModule(slug: string, portal: PortalType): PortalModuleData {
  const text = MODULE_TEXT[slug] ?? {
    subtitle: `Gestion operativa de ${toTitle(slug).toLowerCase()} para el portal ${portal}.`,
    primaryAction: `Crear ${toTitle(slug)}`,
    secondaryAction: 'Exportar CSV',
    recordPrefix: toTitle(slug),
  };

  const title = text.title ?? toTitle(slug);

  return {
    slug,
    title,
    subtitle: text.subtitle,
    metrics: [
      { label: 'Activos', value: '18', trend: '+4 esta semana' },
      { label: 'Pendientes', value: '7', trend: '2 requieren accion hoy' },
      { label: 'Completados', value: '32', trend: '94% SLA mensual' },
      { label: 'Riesgo', value: '3', trend: '1 requiere escalamiento' },
    ],
    records: buildRecords(slug, portal),
    primaryAction: text.primaryAction,
    secondaryAction: text.secondaryAction,
    workflow: [
      { label: 'Backlog', status: 'pending', count: 12 },
      { label: 'En ejecucion', status: 'active', count: 8 },
      { label: 'En revision', status: 'review', count: 4 },
      { label: 'Completado', status: 'completed', count: 19 },
    ],
    checklist: [
      { id: `${slug}-chk-1`, title: 'Validar prioridades del sprint', done: true, owner: 'PMO' },
      { id: `${slug}-chk-2`, title: 'Confirmar dependencias externas', done: false, owner: 'Ops Lead' },
      { id: `${slug}-chk-3`, title: 'Actualizar estado con cliente', done: false, owner: 'Account Manager' },
      { id: `${slug}-chk-4`, title: 'Cerrar tareas vencidas', done: true, owner: 'Delivery Squad' },
    ],
    timeline: [
      { id: `${slug}-ev-1`, title: 'Sync semanal de ejecucion', date: '2026-07-01 09:00', type: 'meeting' },
      { id: `${slug}-ev-2`, title: 'Entrega lote de trabajo', date: '2026-07-04 16:30', type: 'delivery' },
      { id: `${slug}-ev-3`, title: 'Aprobacion final de cliente', date: '2026-07-06 11:00', type: 'approval' },
    ],
    quickActions: [
      { label: 'Asignar responsable', hint: 'Distribuye carga operativa por capacidad' },
      { label: 'Marcar prioridad', hint: 'Eleva tareas criticas de negocio' },
      { label: 'Solicitar aprobacion', hint: 'Dispara el flujo de validacion' },
    ],
  };
}

const CLIENT_MODULES = [
  'dashboard',
  'intake',
  'brand-blueprint',
  'assets',
  'social-accounts',
  'social-crm',
  'publication-planner',
  'content-approvals',
  'calendar',
  'analytics',
  'reports',
  'messages',
  'updates',
  'billing',
  'settings',
] as const;

const ADMIN_MODULES = [
  'dashboard',
  'advertising-accounts',
  'clients',
  'team',
  'packages',
  'intake-review',
  'brand-blueprints',
  'social-accounts',
  'social-crm',
  'content',
  'calendar',
  'analytics',
  'reports',
  'messages',
  'updates',
  'billing',
  'settings',
  'audit-logs',
] as const;

const TEAM_MODULES = [
  'dashboard',
  'tasks',
  'clients',
  'social-accounts',
  'content',
  'social-crm',
  'calendar',
  'messages',
  'updates',
  'assets',
  'reports',
] as const;

export const PORTAL_MODULES: Record<PortalType, Record<string, PortalModuleData>> = {
  client: Object.fromEntries(CLIENT_MODULES.map((slug) => [slug, buildModule(slug, 'client')])),
  admin: Object.fromEntries(ADMIN_MODULES.map((slug) => [slug, buildModule(slug, 'admin')])),
  team: Object.fromEntries(TEAM_MODULES.map((slug) => [slug, buildModule(slug, 'team')])),
};

export function getPortalModule(portal: PortalType, slug: string) {
  return PORTAL_MODULES[portal][slug] ?? null;
}

export function getPortalModuleList(portal: PortalType) {
  return Object.values(PORTAL_MODULES[portal]);
}
