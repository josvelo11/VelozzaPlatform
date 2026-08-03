// ============================================================================
//  brand-profiles.js — copy de estrategia de marca por cliente real.
//  Se usa para enriquecer /profile y /plan sin tocar el esquema de datos:
//  es contenido de solo lectura, keyed por email, con un default genérico
//  para cualquier cliente (demo o nuevo) que no esté en la lista.
// ============================================================================

const DEFAULT_PROFILE = {
  identity: 'Tu marca en crecimiento',
  pillar: 'Construcción de marca',
  objective: 'Hacer crecer tu audiencia y convertir más clientes cada mes',
  visual: 'Estética alineada a tu identidad, definida junto a tu equipo Velozza',
  accountManager: 'Equipo Velozza Creative Works',
  supportChannel: 'Escríbenos por el chat del portal (Mensajes) cuando lo necesites',
};

const BRAND_PROFILES = {
  'dicolseg@velozzacws.com': {
    identity: 'El Titán Corporativo',
    pillar: 'EL HACER',
    objective: 'Leads B2B altamente cualificados y contratos de mantenimiento a largo plazo',
    visual: 'Azules de alto contraste, negros profundos y planos de infraestructura.',
  },
  'joseavila@velozzacws.com': {
    identity: 'El Arquitecto del Legado',
    pillar: 'Integración Total',
    objective: 'Sold out de THE SUMMIT y apertura de plazas para mentorías High-Ticket post-evento',
    visual: 'Estética documental premium con validación de lifestyle.',
  },
  'adrianaortega@velozzacws.com': {
    identity: 'La Ciencia del Origen',
    pillar: 'EL SER',
    objective: 'Llenado de agenda de consultas privadas de alto valor',
    visual: 'Luz natural difusa, espacios limpios y cercanía paciente-especialista.',
  },
  'lucymoreno@velozzacws.com': {
    identity: 'La Estratega del Bienestar',
    pillar: 'EL HACER + EL SER',
    objective: 'Conversión a programas grupales y consultoría 1:1 High-Ticket',
    visual: 'Cálida pero corporativa, con movimiento, acción y claridad mental.',
  },
  'starlightgardenfarm@velozzacws.com': {
    identity: 'La Arquitecta de la Consciencia',
    pillar: 'EL TENER + EL SER',
    objective: 'Captación de fondos, padrinos corporativos y expansión de la red de voluntarios que sostienen el jardín-granja terapéutica, liderado por su fundadora Eva Rosa Zamora',
    visual: 'Documental puro con corrección naturalista, luz dorada de campo abierto y momentos reales de siembra, cosecha y cuidado colectivo.',
  },
  'juanmarulanda@velozzacws.com': {
    identity: 'El Criterio Clínico',
    pillar: 'EL SER',
    objective: 'Más pacientes nuevos y mayor retención en tratamientos prolongados',
    visual: 'Asepsia, simetría y planos a la altura de los ojos.',
  },
  'fiestaautoinsurance@velozzacws.com': {
    identity: 'La Máquina de Conversión',
    pillar: 'EL HACER',
    objective: 'Adquisición masiva de pólizas, reducción del CPA y dominio local',
    visual: 'Dinamismo extremo, colores saturados y retención inmediata.',
  },
  'segurosditerich@velozzacws.com': {
    identity: 'El Escudo Patrimonial',
    pillar: 'EL HACER + EL TENER',
    objective: 'Posicionamiento premium y captación de carteras corporativas',
    visual: 'Solidez, calidez y enfoque empresarial con tomas estables.',
  },
};

export function getBrandProfile(email) {
  const key = String(email || '').trim().toLowerCase();
  const match = BRAND_PROFILES[key];
  return {
    ...DEFAULT_PROFILE,
    ...match,
  };
}
